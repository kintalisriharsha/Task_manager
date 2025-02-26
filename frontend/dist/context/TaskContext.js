"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.TaskProvider = exports.useTaskContext = void 0;
const react_1 = __importStar(require("react"));
const Task_1 = require("../interfaces/Task");
const taskService_1 = require("../services/taskService");
const TaskContext = (0, react_1.createContext)(undefined);
const useTaskContext = () => {
    const context = (0, react_1.useContext)(TaskContext);
    if (!context) {
        throw new Error('useTaskContext must be used within a TaskProvider');
    }
    return context;
};
exports.useTaskContext = useTaskContext;
// Helper function to check if a date is today
const isToday = (date) => {
    const today = new Date();
    return (date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear());
};
// Helper function to check if a date is this week
const isThisWeek = (date) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    return date >= startOfWeek && date < endOfWeek;
};
// Helper function to check if a date is overdue
const isOverdue = (date) => {
    const now = new Date();
    return date < now;
};
const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)(Task_1.TaskStatus.TODO);
    // Search and filter states
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [filterOptions, setFilterOptions] = (0, react_1.useState)({
        status: 'all',
        deadline: 'all',
        duration: 'all'
    });
    const [showFilters, setShowFilters] = (0, react_1.useState)(false);
    const fetchTasks = () => __awaiter(void 0, void 0, void 0, function* () {
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
    });
    const createTask = (taskData) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const newTask = yield taskService_1.taskService.createTask(taskData);
            setTasks((prevTasks) => [...prevTasks, newTask]);
        }
        catch (err) {
            setError('Failed to create task. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    });
    const updateTask = (id, taskData) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const updatedTask = yield taskService_1.taskService.updateTask(id, taskData);
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)));
        }
        catch (err) {
            setError('Failed to update task. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    });
    const deleteTask = (id) => __awaiter(void 0, void 0, void 0, function* () {
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
    });
    const updateTaskStatus = (id, status) => __awaiter(void 0, void 0, void 0, function* () {
        setIsLoading(true);
        setError(null);
        try {
            const updatedTask = yield taskService_1.taskService.updateTaskStatus(id, status);
            setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? updatedTask : task)));
        }
        catch (err) {
            setError('Failed to update task status. Please try again later.');
            console.error(err);
            throw err;
        }
        finally {
            setIsLoading(false);
        }
    });
    const getTasksByCategory = (category) => {
        return filteredTasks.filter((task) => task.status === category);
    };
    const checkTimeouts = () => {
        const currentTime = new Date();
        const updatedTasks = tasks.map((task) => {
            if (task.deadline && new Date(task.deadline) < currentTime && task.status !== Task_1.TaskStatus.DONE) {
                return Object.assign(Object.assign({}, task), { status: Task_1.TaskStatus.TIMEOUT, isTimeout: true });
            }
            return task;
        });
        // Only update state if there are changes
        if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
            setTasks(updatedTasks);
            // Update timed out tasks in the backend
            updatedTasks.forEach((task) => __awaiter(void 0, void 0, void 0, function* () {
                if (task.isTimeout && task.status === Task_1.TaskStatus.TIMEOUT) {
                    try {
                        yield taskService_1.taskService.updateTaskStatus(task.id, Task_1.TaskStatus.TIMEOUT);
                    }
                    catch (err) {
                        console.error(`Failed to update timeout status for task ${task.id}`, err);
                    }
                }
            }));
        }
    };
    // Reset filters to default
    const resetFilters = () => {
        setFilterOptions({
            status: 'all',
            deadline: 'all',
            duration: 'all'
        });
        setSearchTerm('');
    };
    // Apply filters and search to tasks
    const filteredTasks = tasks.filter(task => {
        // Search term filter
        const matchesSearch = searchTerm === '' ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        if (!matchesSearch)
            return false;
        // Status filter
        if (filterOptions.status !== 'all' && task.status !== filterOptions.status) {
            return false;
        }
        // Deadline filter
        if (filterOptions.deadline !== 'all') {
            if (filterOptions.deadline === 'noDeadline' && task.deadline) {
                return false;
            }
            else if (filterOptions.deadline === 'today' && (!task.deadline || !isToday(new Date(task.deadline)))) {
                return false;
            }
            else if (filterOptions.deadline === 'thisWeek' && (!task.deadline || !isThisWeek(new Date(task.deadline)))) {
                return false;
            }
            else if (filterOptions.deadline === 'overdue' && (!task.deadline || !isOverdue(new Date(task.deadline)))) {
                return false;
            }
        }
        // Duration filter
        if (filterOptions.duration !== 'all') {
            const duration = task.duration;
            if (filterOptions.duration === 'lessThan30' && duration >= 30) {
                return false;
            }
            else if (filterOptions.duration === '30to60' && (duration < 30 || duration > 60)) {
                return false;
            }
            else if (filterOptions.duration === '60to120' && (duration < 60 || duration > 120)) {
                return false;
            }
            else if (filterOptions.duration === 'moreThan120' && duration <= 120) {
                return false;
            }
        }
        return true;
    });
    (0, react_1.useEffect)(() => {
        fetchTasks();
        // Check for timeouts initially
        checkTimeouts();
        // Set up a timer to check for timeouts every minute
        const timeoutInterval = setInterval(checkTimeouts, 60000);
        return () => clearInterval(timeoutInterval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const value = {
        tasks,
        isLoading,
        error,
        selectedCategory,
        setSelectedCategory,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        getTasksByCategory,
        checkTimeouts,
        // Search and filter
        searchTerm,
        setSearchTerm,
        filterOptions,
        setFilterOptions,
        resetFilters,
        filteredTasks,
        showFilters,
        setShowFilters
    };
    return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
exports.TaskProvider = TaskProvider;
