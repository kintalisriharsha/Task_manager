"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskTimeProgress = exports.updateTasksTimeoutStatus = exports.updateTaskTimeoutStatus = exports.getTimedOutTasks = exports.isTaskTimedOut = void 0;
const Task_1 = require("../interfaces/Task");
/**
 * Checks if a task has timed out based on its deadline
 */
const isTaskTimedOut = (task) => {
    if (!task.deadline) {
        return false;
    }
    const deadline = new Date(task.deadline);
    const now = new Date();
    return deadline < now && task.status !== Task_1.TaskStatus.DONE;
};
exports.isTaskTimedOut = isTaskTimedOut;
/**
 * Checks an array of tasks and returns those that have timed out
 */
const getTimedOutTasks = (tasks) => {
    return tasks.filter(exports.isTaskTimedOut);
};
exports.getTimedOutTasks = getTimedOutTasks;
/**
 * Updates task status to TIMEOUT if it has timed out
 */
const updateTaskTimeoutStatus = (task) => {
    if ((0, exports.isTaskTimedOut)(task) && !task.isTimeout) {
        return Object.assign(Object.assign({}, task), { status: Task_1.TaskStatus.TIMEOUT, isTimeout: true, updatedAt: new Date() });
    }
    return task;
};
exports.updateTaskTimeoutStatus = updateTaskTimeoutStatus;
/**
 * Updates all timed out tasks in an array
 */
const updateTasksTimeoutStatus = (tasks) => {
    return tasks.map(exports.updateTaskTimeoutStatus);
};
exports.updateTasksTimeoutStatus = updateTasksTimeoutStatus;
/**
 * Calculates the percentage of time elapsed for a task
 */
const getTaskTimeProgress = (task) => {
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
exports.getTaskTimeProgress = getTaskTimeProgress;
