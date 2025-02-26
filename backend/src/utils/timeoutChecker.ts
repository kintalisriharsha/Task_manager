import { Task, TaskStatus } from '../models/taskModel';

export const isTaskTimedOut = (task: Task): boolean => {
  if (!task.deadline) {
    return false;
  }
  
  const deadline = new Date(task.deadline);
  const now = new Date();
  
  return deadline < now && task.status !== TaskStatus.DONE;
};

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

export const updateTasksTimeoutStatus = (tasks: Task[]): Task[] => {
  return tasks.map(updateTaskTimeoutStatus);
};