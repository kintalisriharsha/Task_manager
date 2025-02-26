"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = require("../models/taskModel");
class TaskController {
    constructor() {
        // Get all tasks
        this.getAllTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield taskModel_1.TaskModel.findAll();
                res.status(200).json(tasks);
            }
            catch (error) {
                console.error('Error fetching tasks:', error);
                res.status(500).json({ message: 'Error fetching tasks', error });
            }
        });
        // Get a single task by ID
        this.getTaskById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.id;
                const task = yield taskModel_1.TaskModel.findById(taskId);
                if (!task) {
                    res.status(404).json({ message: 'Task not found' });
                    return;
                }
                res.status(200).json(task);
            }
            catch (error) {
                console.error('Error fetching task:', error);
                res.status(500).json({ message: 'Error fetching task', error });
            }
        });
        // Create a new task
        this.createTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, description, status, duration, deadline } = req.body;
                if (!title || !description) {
                    res.status(400).json({ message: 'Title and description are required' });
                    return;
                }
                const taskStatus = status || taskModel_1.TaskStatus.TODO;
                const taskDuration = duration || 30;
                let deadlineDate = undefined;
                if (deadline) {
                    deadlineDate = new Date(deadline);
                }
                const newTask = yield taskModel_1.TaskModel.create({
                    title,
                    description,
                    status: taskStatus,
                    duration: taskDuration,
                    deadline: deadlineDate
                });
                res.status(201).json(newTask);
            }
            catch (error) {
                console.error('Error creating task:', error);
                res.status(500).json({ message: 'Error creating task', error });
            }
        });
        // Update a task
        this.updateTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.id;
                const updateData = req.body;
                // Validate deadline if provided
                if (updateData.deadline) {
                    updateData.deadline = new Date(updateData.deadline);
                }
                const updatedTask = yield taskModel_1.TaskModel.update(taskId, updateData);
                if (!updatedTask) {
                    res.status(404).json({ message: 'Task not found' });
                    return;
                }
                res.status(200).json(updatedTask);
            }
            catch (error) {
                console.error('Error updating task:', error);
                res.status(500).json({ message: 'Error updating task', error });
            }
        });
        // Delete a task
        this.deleteTask = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskId = req.params.id;
                const deleted = yield taskModel_1.TaskModel.delete(taskId);
                if (!deleted) {
                    res.status(404).json({ message: 'Task not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting task:', error);
                res.status(500).json({ message: 'Error deleting task', error });
            }
        });
        // Check for timeouts
        this.checkTimeouts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield taskModel_1.TaskModel.checkTimeouts();
                res.status(200).json({ message: 'Timeout check completed' });
            }
            catch (error) {
                console.error('Error checking timeouts:', error);
                res.status(500).json({ message: 'Error checking timeouts', error });
            }
        });
        // Get tasks by status
        this.getTasksByStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status } = req.params;
                if (!Object.values(taskModel_1.TaskStatus).includes(status)) {
                    res.status(400).json({ message: 'Invalid status' });
                    return;
                }
                const tasks = yield taskModel_1.TaskModel.findByStatus(status);
                res.status(200).json(tasks);
            }
            catch (error) {
                console.error('Error fetching tasks by status:', error);
                res.status(500).json({ message: 'Error fetching tasks by status', error });
            }
        });
        // Get tasks due today
        this.getTasksDueToday = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield taskModel_1.TaskModel.getTasksDueToday();
                res.status(200).json(tasks);
            }
            catch (error) {
                console.error('Error fetching tasks due today:', error);
                res.status(500).json({ message: 'Error fetching tasks due today', error });
            }
        });
        // Get overdue tasks
        this.getOverdueTasks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield taskModel_1.TaskModel.getOverdueTasks();
                res.status(200).json(tasks);
            }
            catch (error) {
                console.error('Error fetching overdue tasks:', error);
                res.status(500).json({ message: 'Error fetching overdue tasks', error });
            }
        });
    }
}
exports.default = new TaskController();
