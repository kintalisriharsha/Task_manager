import { v4 as uuidv4 } from 'uuid';
import { query } from '../db/database';

export enum TaskStatus {
  TODO = "To Do",
  IN_PROGRESS = "In Progress",
  DONE = "Done",
  TIMEOUT = "Timeout"
}

export interface StreamData {
  id: string;
  taskId?: string;
  name: string;
  viewerCount: number;
  startedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  duration: number; // in minutes
  deadline?: Date;
  isTimeout: boolean;
  streamData?: StreamData;
}

// Type for creating a new task
type TaskInput = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isTimeout' | 'streamData'>;

// Helper to convert DB row to Task
const rowToTask = (row: any): Task => {
  const task: Task = {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status as TaskStatus,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    duration: row.duration,
    isTimeout: Boolean(row.is_timeout)
  };

  if (row.deadline) {
    task.deadline = new Date(row.deadline);
  }

  return task;
};

// Helper to convert DB row to StreamData
const rowToStreamData = (row: any): StreamData => {
  return {
    id: row.id,
    taskId: row.task_id,
    name: row.name,
    viewerCount: row.viewer_count,
    startedAt: new Date(row.started_at)
  };
};

export const TaskModel = {
  async findAll(): Promise<Task[]> {
    // Get all tasks
    const taskRows = await query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    
    // Get all stream data
    const streamRows = await query('SELECT * FROM stream_data');
    
    // Map stream data by task_id for easy lookup
    interface StreamDataMap {
      [taskId: string]: StreamData;
    }
    
    const streamByTaskId = streamRows.reduce((acc: StreamDataMap, stream: any) => {
      if (stream.task_id) {
        acc[stream.task_id] = rowToStreamData(stream);
      }
      return acc;
    }, {} as StreamDataMap);
    
    // Map tasks and attach stream data if available
    return taskRows.map((row: Record<string, any>): Task => {
      const task: Task = rowToTask(row);
      if (streamByTaskId[task.id]) {
        task.streamData = streamByTaskId[task.id];
      }
      return task;
    });
  },
  
  async findById(id: string): Promise<Task | undefined> {
    // Get task
    const rows = await query('SELECT * FROM tasks WHERE id = ?', [id]);
    if (rows.length === 0) return undefined;
    
    const task = rowToTask(rows[0]);
    
    // Get stream data if exists
    const streamRows = await query('SELECT * FROM stream_data WHERE task_id = ?', [id]);
    if (streamRows.length > 0) {
      task.streamData = rowToStreamData(streamRows[0]);
    }
    
    return task;
  },
  
  async create(taskData: TaskInput): Promise<Task> {
    const now = new Date();
    const id = uuidv4();
    
    const newTask: Task = {
      id,
      ...taskData,
      createdAt: now,
      updatedAt: now,
      isTimeout: false
    };
    
    // Insert task
    await query(
      `INSERT INTO tasks (id, title, description, status, created_at, updated_at, duration, deadline, is_timeout) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newTask.id,
        newTask.title,
        newTask.description,
        newTask.status,
        newTask.createdAt.toISOString(),
        newTask.updatedAt.toISOString(),
        newTask.duration,
        newTask.deadline ? newTask.deadline.toISOString() : null,
        0 // is_timeout false
      ]
    );
    
    return newTask;
  },
  
  async update(id: string, taskData: Partial<TaskInput>): Promise<Task | undefined> {
    // Check if task exists
    const existingTask = await this.findById(id);
    if (!existingTask) return undefined;
    
    // Prepare update data
    const updatedTask: Task = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date()
    };
    
    // Build dynamic SQL update query
    const updates: string[] = [];
    const values: any[] = [];
    
    if (taskData.title !== undefined) {
      updates.push('title = ?');
      values.push(taskData.title);
    }
    
    if (taskData.description !== undefined) {
      updates.push('description = ?');
      values.push(taskData.description);
    }
    
    if (taskData.status !== undefined) {
      updates.push('status = ?');
      values.push(taskData.status);
    }
    
    if (taskData.duration !== undefined) {
      updates.push('duration = ?');
      values.push(taskData.duration);
    }
    
    if ('deadline' in taskData) {
      updates.push('deadline = ?');
      values.push(taskData.deadline ? taskData.deadline.toISOString() : null);
    }
    
    updates.push('updated_at = ?');
    values.push(updatedTask.updatedAt.toISOString());
    
    // Add the ID for the WHERE clause
    values.push(id);
    
    // Execute update
    if (updates.length > 0) {
      await query(
        `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }
    
    return updatedTask;
  },
  
  async delete(id: string): Promise<boolean> {
    // Check if task exists
    const existingTask = await this.findById(id);
    if (!existingTask) return false;
    
    // Delete task (stream data will be deleted via cascade)
    await query('DELETE FROM tasks WHERE id = ?', [id]);
    
    return true;
  },
  
  async checkTimeouts(): Promise<void> {
    const now = new Date().toISOString();
    
    // Find tasks that should be marked as timeout
    await query(
      `UPDATE tasks 
       SET status = ?, is_timeout = 1, updated_at = ? 
       WHERE deadline < ? 
       AND status != ? 
       AND is_timeout = 0`,
      [TaskStatus.TIMEOUT, now, now, TaskStatus.DONE]
    );
  },
  
  async findByStatus(status: TaskStatus): Promise<Task[]> {
    const rows = await query(
      'SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC',
      [status]
    );
    
    // Map rows to Task objects
    const tasks = rows.map(rowToTask);
    
    // Get stream data for all tasks
    for (const task of tasks) {
      const streamRows = await query(
        'SELECT * FROM stream_data WHERE task_id = ?',
        [task.id]
      );
      
      if (streamRows.length > 0) {
        task.streamData = rowToStreamData(streamRows[0]);
      }
    }
    
    return tasks;
  },
  
  async addStreamData(taskId: string, streamData: Omit<StreamData, 'id' | 'taskId'>): Promise<Task | undefined> {
    // Check if task exists
    const task = await this.findById(taskId);
    if (!task) return undefined;
    
    // Remove any existing stream data for this task
    await query('DELETE FROM stream_data WHERE task_id = ?', [taskId]);
    
    // Create new stream data
    const streamId = uuidv4();
    await query(
      `INSERT INTO stream_data (id, task_id, name, viewer_count, started_at)
       VALUES (?, ?, ?, ?, ?)`,
      [
        streamId,
        taskId,
        streamData.name,
        streamData.viewerCount,
        streamData.startedAt.toISOString()
      ]
    );
    
    // Return updated task with stream data
    task.streamData = {
      id: streamId,
      taskId,
      ...streamData
    };
    
    return task;
  },
  
  async removeStreamData(taskId: string): Promise<Task | undefined> {
    // Check if task exists
    const task = await this.findById(taskId);
    if (!task) return undefined;
    
    // Remove stream data
    await query('DELETE FROM stream_data WHERE task_id = ?', [taskId]);
    
    // Return updated task without stream data
    delete task.streamData;
    return task;
  },
  
  async getTotalDuration(): Promise<number> {
    const result = await query('SELECT SUM(duration) as total FROM tasks');
    return result[0].total || 0;
  },
  
  async getTasksDueToday(): Promise<Task[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const rows = await query(
      `SELECT * FROM tasks 
       WHERE deadline >= ? AND deadline < ? 
       ORDER BY deadline ASC`,
      [today.toISOString(), tomorrow.toISOString()]
    );
    
    return rows.map(rowToTask);
  },
  
  async getOverdueTasks(): Promise<Task[]> {
    const now = new Date().toISOString();
    
    const rows = await query(
      `SELECT * FROM tasks 
       WHERE deadline < ? AND status != ? 
       ORDER BY deadline ASC`,
      [now, TaskStatus.DONE]
    );
    
    return rows.map(rowToTask);
  }
};