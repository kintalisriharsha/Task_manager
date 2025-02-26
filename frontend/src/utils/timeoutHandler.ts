import { Task, TaskStatus } from '../interfaces/Task';

/**
 * Checks if a task has timed out based on its deadline
 */
export const isTaskTimedOut = (task: Task): boolean => {
  if (!task.deadline) {
    return false;
  }
  
  const deadline = new Date(task.deadline);
  const now = new Date();
  
  return deadline < now && task.status !== TaskStatus.DONE;
};

/**
 * Checks an array of tasks and returns those that have timed out
 */
export const getTimedOutTasks = (tasks: Task[]): Task[] => {
  return tasks.filter(isTaskTimedOut);
};

/**
 * Updates task status to TIMEOUT if it has timed out
 */
export const updateTaskTimeoutStatus = (task: Task): Task => {
  if (isTaskTimedOut(task) && !task.isTimeout) {
    return {
      ...task,
      status: TaskStatus.TIMEOUT,
      isTimeout: true,
      updatedAt: new Date()
    };
  }
  
  return task;
};

/**
 * Updates all timed out tasks in an array
 */
export const updateTasksTimeoutStatus = (tasks: Task[]): Task[] => {
  return tasks.map(updateTaskTimeoutStatus);
};

/**
 * Calculates the percentage of time elapsed for a task
 */
export const getTaskTimeProgress = (task: Task): number => {
  if (!task.deadline || !task.createdAt) {
    return 0;
  }
  
  const deadline = new Date(task.deadline);
  const createdAt = new Date(task.createdAt);
  const now = new Date();
  
  const totalDuration = deadline.getTime() - createdAt.getTime();
  const elapsedDuration = now.getTime() - createdAt.getTime();
  
  const progress = Math.min(100, Math.max(0, (elapsedDuration / totalDuration) * 100));
  
  return Math.round(progress);
};