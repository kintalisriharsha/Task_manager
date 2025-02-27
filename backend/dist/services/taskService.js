"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/services/taskService.ts
const taskModel_1 = require("../models/taskModel");
class TaskService {
    constructor() {
        // Get all tasks
        this.getAllTasks = () => {
            return taskModel_1.TaskModel.findAll();
        };
        // Get task by ID
        this.getTaskById = (id) => {
            return taskModel_1.TaskModel.findById(id);
        };
        // Create a new task
        this.createTask = (taskData) => {
            const task = taskModel_1.TaskModel.create({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status || taskModel_1.TaskStatus.TODO,
                duration: taskData.duration || 30,
                deadline: taskData.deadline
            });
            return task;
        };
        // Update a task
        this.updateTask = (id, taskData) => {
            return taskModel_1.TaskModel.update(id, taskData);
        };
        // Delete a task
        this.deleteTask = (id) => {
            return taskModel_1.TaskModel.delete(id);
        };
        // Update task status
        this.updateTaskStatus = (id, status) => {
            return taskModel_1.TaskModel.update(id, { status });
        };
        // Check for task timeouts
        this.checkTimeouts = () => {
            taskModel_1.TaskModel.checkTimeouts();
        };
        // Filter tasks by status
        this.getTasksByStatus = (status) => {
            return taskModel_1.TaskModel.findAll().filter(task => task.status === status);
        };
        // Filter tasks by deadline (today, this week, overdue)
        this.getTasksByDeadline = (type) => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
            return taskModel_1.TaskModel.findAll().filter(task => {
                if (type === 'noDeadline') {
                    return !task.deadline;
                }
                if (!task.deadline) {
                    return false;
                }
                const taskDate = new Date(task.deadline);
                if (type === 'today') {
                    return (taskDate.getDate() === today.getDate() &&
                        taskDate.getMonth() === today.getMonth() &&
                        taskDate.getFullYear() === today.getFullYear());
                }
                if (type === 'thisWeek') {
                    return taskDate >= today && taskDate <= endOfWeek;
                }
                if (type === 'overdue') {
                    return taskDate < today;
                }
                return false;
            });
        };
        // Filter tasks by duration
        this.getTasksByDuration = (type) => {
            return taskModel_1.TaskModel.findAll().filter(task => {
                const duration = task.duration;
                if (type === 'lessThan30') {
                    return duration < 30;
                }
                if (type === '30to60') {
                    return duration >= 30 && duration <= 60;
                }
                if (type === '60to120') {
                    return duration > 60 && duration <= 120;
                }
                if (type === 'moreThan120') {
                    return duration > 120;
                }
                return false;
            });
        };
        // Search tasks by title or description
        this.searchTasks = (searchTerm) => {
            if (!searchTerm || searchTerm.trim() === '') {
                return this.getAllTasks();
            }
            const normalizedSearchTerm = searchTerm.toLowerCase().trim();
            return taskModel_1.TaskModel.findAll().filter(task => task.title.toLowerCase().includes(normalizedSearchTerm) ||
                task.description.toLowerCase().includes(normalizedSearchTerm));
        };
        // Get tasks with complex filtering
        this.getFilteredTasks = (filters) => {
            let filteredTasks = this.getAllTasks();
            // Filter by search term
            if (filters.searchTerm && filters.searchTerm.trim() !== '') {
                filteredTasks = this.searchTasks(filters.searchTerm);
            }
            // Filter by status
            if (filters.status && filters.status !== 'all') {
                filteredTasks = filteredTasks.filter(task => task.status === filters.status);
            }
            // Filter by deadline
            if (filters.deadline && filters.deadline !== 'all') {
                const deadlineTasks = this.getTasksByDeadline(filters.deadline);
                filteredTasks = filteredTasks.filter(task => deadlineTasks.some(deadlineTask => deadlineTask.id === task.id));
            }
            // Filter by duration
            if (filters.duration && filters.duration !== 'all') {
                const durationTasks = this.getTasksByDuration(filters.duration);
                filteredTasks = filteredTasks.filter(task => durationTasks.some(durationTask => durationTask.id === task.id));
            }
            return filteredTasks;
        };
    }
}
exports.default = new TaskService();
//# sourceMappingURL=taskService.js.map