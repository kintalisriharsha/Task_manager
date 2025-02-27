import { Task } from '../models/taskModel';
export declare const isTaskTimedOut: (task: Task) => boolean;
export declare const updateTaskTimeoutStatus: (task: Task) => Task;
export declare const processTaskTimeouts: (tasks: Task[]) => Task[];
export declare const getTimeRemaining: (deadline: Date) => string;
export declare const scheduleTimeoutChecking: (checkFunction: () => void, intervalMs?: number) => NodeJS.Timeout;
