// src/utils/timeoutChecker.ts
import { Task, TaskStatus } from '../models/taskModel';

// Check if task has timed out
export const isTaskTimedOut = (task: Task): boolean => {
  if (!task.deadline) {
    return false;
  }
  
  const deadline = new Date(task.deadline);
  const now = new Date();
  
  return deadline < now && task.status !== TaskStatus.DONE && !task.isTimeout;
};

// Update task status to timeout if deadline has passed
export const updateTaskTimeoutStatus = (task: Task): Task => {
  if (isTaskTimedOut(task)) {
    task.status = TaskStatus.TIMEOUT;
    task.isTimeout = true;
    task.updatedAt = new Date();
  }
  
  return task;
};

// Process an array of tasks to check for timeouts
export const processTaskTimeouts = (tasks: Task[]): Task[] => {
  return tasks.map(updateTaskTimeoutStatus);
};

// Calculate time remaining until deadline
export const getTimeRemaining = (deadline: Date): string => {
  const now = new Date();
  const timeLeft = deadline.getTime() - now.getTime();
  
  if (timeLeft <= 0) {
    return 'Overdue';
  }
  
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) {
    return `${days}d ${hours}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};

// Schedule task timeout checking
export const scheduleTimeoutChecking = (checkFunction: () => void, intervalMs: number = 60000): NodeJS.Timeout => {
  // Run immediately on startup
  checkFunction();
  
  // Then schedule to run at the specified interval
  return setInterval(checkFunction, intervalMs);
};