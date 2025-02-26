import api from './api';
import { Task, TaskFormData, TaskStatus } from '../interfaces/Task';

export const taskService = {
  getAllTasks: async (): Promise<Task[]> => {
    try {
      const tasks = await api.get<Task[]>('/tasks');
      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },
  
  getTaskById: async (id: string): Promise<Task> => {
    try {
      const task = await api.get<Task>(`/tasks/${id}`);
      return task;
    } catch (error) {
      console.error(`Error fetching task with id ${id}:`, error);
      throw error;
    }
  },
  
  createTask: async (taskData: TaskFormData): Promise<Task> => {
    try {
      const newTask = await api.post<Task>('/tasks', taskData);
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },
  
  updateTask: async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    try {
      const updatedTask = await api.put<Task>(`/tasks/${id}`, taskData);
      return updatedTask;
    } catch (error) {
      console.error(`Error updating task with id ${id}:`, error);
      throw error;
    }
  },
  
  deleteTask: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error) {
      console.error(`Error deleting task with id ${id}:`, error);
      throw error;
    }
  },
  
  updateTaskStatus: async (id: string, status: TaskStatus): Promise<Task> => {
    try {
      const updatedTask = await api.put<Task>(`/tasks/${id}`, { status });
      return updatedTask;
    } catch (error) {
      console.error(`Error updating task status with id ${id}:`, error);
      throw error;
    }
  },
  
  getStreamingData: async (taskId: string): Promise<Task> => {
    try {
      const taskWithStreamData = await api.get<Task>(`/streaming?taskId=${taskId}`);
      return taskWithStreamData;
    } catch (error) {
      console.error('Error fetching streaming data:', error);
      throw error;
    }
  }
};