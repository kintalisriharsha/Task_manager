import { useState, useCallback } from 'react';
import { Task, TaskFormData, TaskStatus } from '../interfaces/Task';
import { taskService } from '../services/taskService';

interface UseTaskReturn {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: TaskFormData) => Promise<Task>;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<Task>;
}

export const useTask = (): UseTaskReturn => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch tasks. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData: TaskFormData): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: string, taskData: Partial<TaskFormData>): Promise<Task> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
      return updatedTask;
    } catch (err) {
      setError('Failed to update task. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await taskService.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError('Failed to delete task. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTaskStatus = useCallback(async (id: string, status: TaskStatus): Promise<Task> => {
    return updateTask(id, { status });
  }, [updateTask]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  };
};