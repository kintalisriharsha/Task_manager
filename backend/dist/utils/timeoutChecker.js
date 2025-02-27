"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleTimeoutChecking = exports.getTimeRemaining = exports.processTaskTimeouts = exports.updateTaskTimeoutStatus = exports.isTaskTimedOut = void 0;
// src/utils/timeoutChecker.ts
const taskModel_1 = require("../models/taskModel");
// Check if task has timed out
const isTaskTimedOut = (task) => {
    if (!task.deadline) {
        return false;
    }
    const deadline = new Date(task.deadline);
    const now = new Date();
    return deadline < now && task.status !== taskModel_1.TaskStatus.DONE && !task.isTimeout;
};
exports.isTaskTimedOut = isTaskTimedOut;
// Update task status to timeout if deadline has passed
const updateTaskTimeoutStatus = (task) => {
    if ((0, exports.isTaskTimedOut)(task)) {
        task.status = taskModel_1.TaskStatus.TIMEOUT;
        task.isTimeout = true;
        task.updatedAt = new Date();
    }
    return task;
};
exports.updateTaskTimeoutStatus = updateTaskTimeoutStatus;
// Process an array of tasks to check for timeouts
const processTaskTimeouts = (tasks) => {
    return tasks.map(exports.updateTaskTimeoutStatus);
};
exports.processTaskTimeouts = processTaskTimeouts;
// Calculate time remaining until deadline
const getTimeRemaining = (deadline) => {
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
    }
    else if (hours > 0) {
        return `${hours}h ${minutes}m remaining`;
    }
    else {
        return `${minutes}m remaining`;
    }
};
exports.getTimeRemaining = getTimeRemaining;
// Schedule task timeout checking
const scheduleTimeoutChecking = (checkFunction, intervalMs = 60000) => {
    // Run immediately on startup
    checkFunction();
    // Then schedule to run at the specified interval
    return setInterval(checkFunction, intervalMs);
};
exports.scheduleTimeoutChecking = scheduleTimeoutChecking;
//# sourceMappingURL=timeoutChecker.js.map