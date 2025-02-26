import { TaskModel, Task, TaskStatus } from '../models/taskModel';
import { v4 as uuidv4 } from 'uuid';

export interface TaskInput {
  title: string;
  description: string;
  status?: TaskStatus;
  duration?: number;
  deadline?: Date;
}

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    return TaskModel.findAll();
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    return TaskModel.findById(id);
  }

  async createTask(taskData: TaskInput): Promise<Task> {
    const newTask = {
      ...taskData,
      status: taskData.status || TaskStatus.TODO,
      duration: taskData.duration || 30
    };
    
    return TaskModel.create(newTask);
  }

  async updateTask(id: string, taskData: Partial<TaskInput>): Promise<Task | undefined> {
    return TaskModel.update(id, taskData);
  }

  async deleteTask(id: string): Promise<boolean> {
    return TaskModel.delete(id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | undefined> {
    return TaskModel.update(id, { status });
  }

  async checkTimeouts(): Promise<void> {
    await TaskModel.checkTimeouts();
  }

  async getTasksByStatus(status: TaskStatus): Promise<Task[]> {
    return TaskModel.findByStatus(status);
  }
}

export const taskService = new TaskService();