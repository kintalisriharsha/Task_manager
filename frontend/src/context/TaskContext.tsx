import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task, TaskFormData, TaskStatus } from '../interfaces/Task';
import { taskService } from '../services/taskService';

// Filter options interface
export interface FilterOptions {
  status: TaskStatus | 'all';
  deadline: 'all' | 'today' | 'thisWeek' | 'overdue' | 'noDeadline';
  duration: 'all' | 'lessThan30' | '30to60' | '60to120' | 'moreThan120';
}

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  selectedCategory: TaskStatus;
  setSelectedCategory: (category: TaskStatus) => void;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: TaskFormData) => Promise<void>;
  updateTask: (id: string, taskData: Partial<TaskFormData>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  getTasksByCategory: (category: TaskStatus) => Task[];
  checkTimeouts: () => void;
  // Search and filter
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  resetFilters: () => void;
  filteredTasks: Task[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

// Helper function to check if a date is today
const isToday = (date: Date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Helper function to check if a date is this week
const isThisWeek = (date: Date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  
  return date >= startOfWeek && date < endOfWeek;
};

// Helper function to check if a date is overdue
const isOverdue = (date: Date) => {
  const now = new Date();
  return date < now;
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TaskStatus>(TaskStatus.TODO);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: 'all',
    deadline: 'all',
    duration: 'all'
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const fetchTasks = async () => {
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
  };

  const createTask = async (taskData: TaskFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTask = await taskService.createTask(taskData);
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch (err) {
      setError('Failed to create task. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (id: string, taskData: Partial<TaskFormData>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTask(id, taskData);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
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
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedTask = await taskService.updateTaskStatus(id, status);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (err) {
      setError('Failed to update task status. Please try again later.');
      console.error(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getTasksByCategory = (category: TaskStatus) => {
    return filteredTasks.filter((task) => task.status === category);
  };

  const checkTimeouts = () => {
    const currentTime = new Date();
    const updatedTasks = tasks.map((task) => {
      if (task.deadline && new Date(task.deadline) < currentTime && task.status !== TaskStatus.DONE) {
        return { ...task, status: TaskStatus.TIMEOUT, isTimeout: true };
      }
      return task;
    });
    
    // Only update state if there are changes
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
      
      // Update timed out tasks in the backend
      updatedTasks.forEach(async (task) => {
        if (task.isTimeout && task.status === TaskStatus.TIMEOUT) {
          try {
            await taskService.updateTaskStatus(task.id, TaskStatus.TIMEOUT);
          } catch (err) {
            console.error(`Failed to update timeout status for task ${task.id}`, err);
          }
        }
      });
    }
  };

  // Reset filters to default
  const resetFilters = () => {
    setFilterOptions({
      status: 'all',
      deadline: 'all',
      duration: 'all'
    });
    setSearchTerm('');
  };

  // Apply filters and search to tasks
  const filteredTasks = tasks.filter(task => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    // Status filter
    if (filterOptions.status !== 'all' && task.status !== filterOptions.status) {
      return false;
    }
    
    // Deadline filter
    if (filterOptions.deadline !== 'all') {
      if (filterOptions.deadline === 'noDeadline' && task.deadline) {
        return false;
      } else if (filterOptions.deadline === 'today' && (!task.deadline || !isToday(new Date(task.deadline)))) {
        return false;
      } else if (filterOptions.deadline === 'thisWeek' && (!task.deadline || !isThisWeek(new Date(task.deadline)))) {
        return false;
      } else if (filterOptions.deadline === 'overdue' && (!task.deadline || !isOverdue(new Date(task.deadline)))) {
        return false;
      }
    }
    
    // Duration filter
    if (filterOptions.duration !== 'all') {
      const duration = task.duration;
      if (filterOptions.duration === 'lessThan30' && duration >= 30) {
        return false;
      } else if (filterOptions.duration === '30to60' && (duration < 30 || duration > 60)) {
        return false;
      } else if (filterOptions.duration === '60to120' && (duration < 60 || duration > 120)) {
        return false;
      } else if (filterOptions.duration === 'moreThan120' && duration <= 120) {
        return false;
      }
    }
    
    return true;
  });

  useEffect(() => {
    fetchTasks();
    
    // Check for timeouts initially
    checkTimeouts();
    
    // Set up a timer to check for timeouts every minute
    const timeoutInterval = setInterval(checkTimeouts, 60000);
    
    return () => clearInterval(timeoutInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    tasks,
    isLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTasksByCategory,
    checkTimeouts,
    // Search and filter
    searchTerm,
    setSearchTerm,
    filterOptions,
    setFilterOptions,
    resetFilters,
    filteredTasks,
    showFilters,
    setShowFilters
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};