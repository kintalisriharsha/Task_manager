"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTasksTimeoutStatus = exports.updateTaskTimeoutStatus = exports.isTaskTimedOut = void 0;
const taskModel_1 = require("../models/taskModel");
const isTaskTimedOut = (task) => {
    if (!task.deadline) {
        return false;
    }
    const deadline = new Date(task.deadline);
    const now = new Date();
    return deadline < now && task.status !== taskModel_1.TaskStatus.DONE;
};
exports.isTaskTimedOut = isTaskTimedOut;
const updateTaskTimeoutStatus = (task) => {
    if ((0, exports.isTaskTimedOut)(task) && !task.isTimeout) {
        return Object.assign(Object.assign({}, task), { status: taskModel_1.TaskStatus.TIMEOUT, isTimeout: true, updatedAt: new Date() });
    }
    return task;
};
exports.updateTaskTimeoutStatus = updateTaskTimeoutStatus;
const updateTasksTimeoutStatus = (tasks) => {
    return tasks.map(exports.updateTaskTimeoutStatus);
};
exports.updateTasksTimeoutStatus = updateTasksTimeoutStatus;
