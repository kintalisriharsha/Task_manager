"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskId = exports.validateTaskStatus = exports.validateTaskInput = void 0;
const taskModel_1 = require("../models/taskModel");
const errorHandler_1 = require("../utils/errorHandler");
const validateTaskInput = (req, res, next) => {
    const { title, description } = req.body;
    if (!title || title.trim() === '') {
        return next(new errorHandler_1.AppError('Title is required', 400));
    }
    if (!description || description.trim() === '') {
        return next(new errorHandler_1.AppError('Description is required', 400));
    }
    next();
};
exports.validateTaskInput = validateTaskInput;
const validateTaskStatus = (req, res, next) => {
    const { status } = req.body;
    if (status && !Object.values(taskModel_1.TaskStatus).includes(status)) {
        return next(new errorHandler_1.AppError('Invalid task status', 400));
    }
    next();
};
exports.validateTaskStatus = validateTaskStatus;
const validateTaskId = (req, res, next) => {
    const { id } = req.params;
    if (!id || typeof id !== 'string') {
        return next(new errorHandler_1.AppError('Invalid task ID', 400));
    }
    next();
};
exports.validateTaskId = validateTaskId;
