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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const api_1 = __importDefault(require("./api"));
exports.taskService = {
    getAllTasks: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tasks = yield api_1.default.get('/tasks');
            return tasks;
        }
        catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }),
    getTaskById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const task = yield api_1.default.get(`/tasks/${id}`);
            return task;
        }
        catch (error) {
            console.error(`Error fetching task with id ${id}:`, error);
            throw error;
        }
    }),
    createTask: (taskData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newTask = yield api_1.default.post('/tasks', taskData);
            return newTask;
        }
        catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }),
    updateTask: (id, taskData) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedTask = yield api_1.default.put(`/tasks/${id}`, taskData);
            return updatedTask;
        }
        catch (error) {
            console.error(`Error updating task with id ${id}:`, error);
            throw error;
        }
    }),
    deleteTask: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield api_1.default.delete(`/tasks/${id}`);
        }
        catch (error) {
            console.error(`Error deleting task with id ${id}:`, error);
            throw error;
        }
    }),
    updateTaskStatus: (id, status) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedTask = yield api_1.default.put(`/tasks/${id}`, { status });
            return updatedTask;
        }
        catch (error) {
            console.error(`Error updating task status with id ${id}:`, error);
            throw error;
        }
    }),
    getStreamingData: (taskId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const taskWithStreamData = yield api_1.default.get(`/streaming?taskId=${taskId}`);
            return taskWithStreamData;
        }
        catch (error) {
            console.error('Error fetching streaming data:', error);
            throw error;
        }
    })
};
