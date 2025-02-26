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
exports.taskService = exports.TaskService = void 0;
const taskModel_1 = require("../models/taskModel");
class TaskService {
    getAllTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.findAll();
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.findById(id);
        });
    }
    createTask(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTask = Object.assign(Object.assign({}, taskData), { status: taskData.status || taskModel_1.TaskStatus.TODO, duration: taskData.duration || 30 });
            return taskModel_1.TaskModel.create(newTask);
        });
    }
    updateTask(id, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.update(id, taskData);
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.delete(id);
        });
    }
    updateTaskStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.update(id, { status });
        });
    }
    checkTimeouts() {
        return __awaiter(this, void 0, void 0, function* () {
            yield taskModel_1.TaskModel.checkTimeouts();
        });
    }
    getTasksByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            return taskModel_1.TaskModel.findByStatus(status);
        });
    }
}
exports.TaskService = TaskService;
exports.taskService = new TaskService();
