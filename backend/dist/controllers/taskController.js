"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const taskModel_1 = require("../models/taskModel");
const taskService_1 = tslib_1.__importDefault(require("../services/taskService"));
const errorHandler_1 = require("../utils/errorHandler");
class TaskController {
    constructor() {
        // Get all tasks
        this.getAllTasks = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
            const tasks = taskService_1.default.getAllTasks();
            res.status(200).json(tasks);
        });
        // Get a single task by ID
        this.getTaskById = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const taskId = req.params.id;
            if (!taskId) {
                res.status(400).json({ message: 'Task ID is required' });
                return;
            }
            const task = taskService_1.default.getTaskById(taskId);
            if (!task) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            res.status(200).json(task);
        });
        // Create a new task
        this.createTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { title, description, status, duration, deadline } = req.body;
            let deadlineDate = undefined;
            if (deadline) {
                deadlineDate = new Date(deadline);
            }
            const newTask = taskService_1.default.createTask({
                title,
                description,
                status,
                duration,
                deadline: deadlineDate
            });
            res.status(201).json(newTask);
        });
        // Update a task
        this.updateTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const taskId = req.params.id;
            if (!taskId) {
                res.status(400).json({ message: 'Task ID is required' });
                return;
            }
            const updateData = req.body;
            // Handle deadline conversion if provided
            if (updateData.deadline) {
                updateData.deadline = new Date(updateData.deadline);
            }
            const updatedTask = taskService_1.default.updateTask(taskId, updateData);
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            res.status(200).json(updatedTask);
        });
        // Delete a task
        this.deleteTask = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const taskId = req.params.id;
            if (!taskId) {
                res.status(400).json({ message: 'Task ID is required' });
                return;
            }
            const deleted = taskService_1.default.deleteTask(taskId);
            if (!deleted) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            res.status(204).send();
        });
        // Update task status
        this.updateTaskStatus = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const taskId = req.params.id;
            const { status } = req.body;
            if (!taskId) {
                res.status(400).json({ message: 'Task ID is required' });
                return;
            }
            if (!status || !Object.values(taskModel_1.TaskStatus).includes(status)) {
                res.status(400).json({
                    message: 'Invalid status. Must be one of: To Do, In Progress, Done, Timeout'
                });
                return;
            }
            const updatedTask = taskService_1.default.updateTaskStatus(taskId, status);
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            res.status(200).json(updatedTask);
        });
        // Check for timeouts
        this.checkTimeouts = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
            taskService_1.default.checkTimeouts();
            res.status(200).json({ message: 'Timeout check completed' });
        });
    }
}
exports.default = new TaskController();
//# sourceMappingURL=taskController.js.map