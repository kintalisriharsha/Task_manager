"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTaskIdQuery = exports.validateIdParam = exports.validateTaskUpdate = exports.validateTaskCreation = void 0;
const taskModel_1 = require("../models/taskModel");
// Validate task creation request
const validateTaskCreation = (req, res, next) => {
    const { title, description, status, duration, deadline } = req.body;
    const errors = [];
    // Required fields
    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }
    if (!description || description.trim() === '') {
        errors.push('Description is required');
    }
    // Status validation
    if (status && !Object.values(taskModel_1.TaskStatus).includes(status)) {
        errors.push('Invalid status value');
    }
    // Duration validation
    if (duration !== undefined) {
        if (isNaN(duration) || duration <= 0) {
            errors.push('Duration must be a positive number');
        }
    }
    // Deadline validation
    if (deadline) {
        const deadlineDate = new Date(deadline);
        if (deadlineDate.toString() === 'Invalid Date') {
            errors.push('Invalid deadline date format');
        }
    }
    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
    }
    next();
};
exports.validateTaskCreation = validateTaskCreation;
// Validate task update request
const validateTaskUpdate = (req, res, next) => {
    const { status, duration, deadline } = req.body;
    const errors = [];
    // Status validation
    if (status && !Object.values(taskModel_1.TaskStatus).includes(status)) {
        errors.push('Invalid status value');
    }
    // Duration validation
    if (duration !== undefined) {
        if (isNaN(duration) || duration <= 0) {
            errors.push('Duration must be a positive number');
        }
    }
    // Deadline validation
    if (deadline) {
        const deadlineDate = new Date(deadline);
        if (deadlineDate.toString() === 'Invalid Date') {
            errors.push('Invalid deadline date format');
        }
    }
    if (errors.length > 0) {
        res.status(400).json({ message: 'Validation failed', errors });
        return;
    }
    next();
};
exports.validateTaskUpdate = validateTaskUpdate;
// Validate ID parameter
const validateIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!id || id.trim() === '') {
        res.status(400).json({ message: 'Invalid ID parameter' });
        return;
    }
    next();
};
exports.validateIdParam = validateIdParam;
// Validate task ID query parameter
const validateTaskIdQuery = (req, res, next) => {
    const { taskId } = req.query;
    if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
        res.status(400).json({ message: 'taskId query parameter is required' });
        return;
    }
    next();
};
exports.validateTaskIdQuery = validateTaskIdQuery;
//# sourceMappingURL=validationMiddleware.js.map