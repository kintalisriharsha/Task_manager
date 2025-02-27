// src/services/taskService.ts
import { TaskModel, Task, TaskStatus } from '../models/taskModel';

class TaskService {
  // Get all tasks
  getAllTasks = (): Task[] => {
    return TaskModel.findAll();
  };

  // Get task by ID
  getTaskById = (id: string): Task | undefined => {
    return TaskModel.findById(id);
  };

  // Create a new task
  createTask = (taskData: {
    title: string;
    description: string;
    status?: TaskStatus;
    duration?: number;
    deadline?: Date;
  }): Task => {
    const task = TaskModel.create({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status || TaskStatus.TODO,
      duration: taskData.duration || 30,
      deadline: taskData.deadline
    });

    return task;
  };

  // Update a task
  updateTask = (id: string, taskData: Partial<Task>): Task | undefined => {
    return TaskModel.update(id, taskData);
  };

  // Delete a task
  deleteTask = (id: string): boolean => {
    return TaskModel.delete(id);
  };

  // Update task status
  updateTaskStatus = (id: string, status: TaskStatus): Task | undefined => {
    return TaskModel.update(id, { status });
  };

  // Check for task timeouts
  checkTimeouts = (): void => {
    TaskModel.checkTimeouts();
  };

  // Filter tasks by status
  getTasksByStatus = (status: TaskStatus): Task[] => {
    return TaskModel.findAll().filter(task => task.status === status);
  };

  // Filter tasks by deadline (today, this week, overdue)
  getTasksByDeadline = (type: 'today' | 'thisWeek' | 'overdue' | 'noDeadline'): Task[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    return TaskModel.findAll().filter(task => {
      if (type === 'noDeadline') {
        return !task.deadline;
      }

      if (!task.deadline) {
        return false;
      }

      const taskDate = new Date(task.deadline);
      
      if (type === 'today') {
        return (
          taskDate.getDate() === today.getDate() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getFullYear() === today.getFullYear()
        );
      }

      if (type === 'thisWeek') {
        return taskDate >= today && taskDate <= endOfWeek;
      }

      if (type === 'overdue') {
        return taskDate < today;
      }

      return false;
    });
  };

  // Filter tasks by duration
  getTasksByDuration = (type: 'lessThan30' | '30to60' | '60to120' | 'moreThan120'): Task[] => {
    return TaskModel.findAll().filter(task => {
      const duration = task.duration;

      if (type === 'lessThan30') {
        return duration < 30;
      }

      if (type === '30to60') {
        return duration >= 30 && duration <= 60;
      }

      if (type === '60to120') {
        return duration > 60 && duration <= 120;
      }

      if (type === 'moreThan120') {
        return duration > 120;
      }

      return false;
    });
  };

  // Search tasks by title or description
  searchTasks = (searchTerm: string): Task[] => {
    if (!searchTerm || searchTerm.trim() === '') {
      return this.getAllTasks();
    }

    const normalizedSearchTerm = searchTerm.toLowerCase().trim();

    return TaskModel.findAll().filter(task => 
      task.title.toLowerCase().includes(normalizedSearchTerm) || 
      task.description.toLowerCase().includes(normalizedSearchTerm)
    );
  };

  // Get tasks with complex filtering
  getFilteredTasks = (filters: {
    status?: TaskStatus | 'all';
    deadline?: 'today' | 'thisWeek' | 'overdue' | 'noDeadline' | 'all';
    duration?: 'lessThan30' | '30to60' | '60to120' | 'moreThan120' | 'all';
    searchTerm?: string;
  }): Task[] => {
    let filteredTasks = this.getAllTasks();

    // Filter by search term
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      filteredTasks = this.searchTasks(filters.searchTerm);
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.status === filters.status);
    }

    // Filter by deadline
    if (filters.deadline && filters.deadline !== 'all') {
      const deadlineTasks = this.getTasksByDeadline(filters.deadline);
      filteredTasks = filteredTasks.filter(task => 
        deadlineTasks.some(deadlineTask => deadlineTask.id === task.id)
      );
    }

    // Filter by duration
    if (filters.duration && filters.duration !== 'all') {
      const durationTasks = this.getTasksByDuration(filters.duration);
      filteredTasks = filteredTasks.filter(task => 
        durationTasks.some(durationTask => durationTask.id === task.id)
      );
    }

    return filteredTasks;
  };
}

export default new TaskService();