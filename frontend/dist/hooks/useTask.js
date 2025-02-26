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
exports.useTask = void 0;
const react_1 = require("react");
const taskService_1 = require("../services/taskService");
const useTask = () => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchTasks = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const fetchedTasks = yield taskService_1.taskService.getAllTasks();
            setTasks(fetchedTasks);
        }
        catch (err) {
            setError('Failed to fetch tasks. Please try again later.');
            console.error(err);
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    const createTask = (0, react_1.useCallback)((taskData) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const newTask = yield taskService_1.taskService.createTask(taskData);
            setTasks((prevTasks) => [...prevTasks, newTask]);
            return newTask;
        }
        catch (err) {
            setError('Failed to create task. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    const updateTask = (0, react_1.useCallback)((id, taskData) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const updatedTask = yield taskService_1.taskService.updateTask(id, taskData);
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)));
            return updatedTask;
        }
        catch (err) {
            setError('Failed to update task. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    const deleteTask = (0, react_1.useCallback)((id) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            yield taskService_1.taskService.deleteTask(id);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        }
        catch (err) {
            setError('Failed to delete task. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    }), []);
    const updateTaskStatus = (0, react_1.useCallback)((id, status) => __awaiter(void 0, void 0, void 0, function* () {
        return updateTask(id, { status });
    }), [updateTask]);
    return {
        tasks,
        isLoading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus
    };
};
exports.useTask = useTask;
