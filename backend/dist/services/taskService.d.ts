import { Task, TaskStatus } from '../models/taskModel';
declare class TaskService {
    getAllTasks: () => Task[];
    getTaskById: (id: string) => Task | undefined;
    createTask: (taskData: {
        title: string;
        description: string;
        status?: TaskStatus;
        duration?: number;
        deadline?: Date;
    }) => Task;
    updateTask: (id: string, taskData: Partial<Task>) => Task | undefined;
    deleteTask: (id: string) => boolean;
    updateTaskStatus: (id: string, status: TaskStatus) => Task | undefined;
    checkTimeouts: () => void;
    getTasksByStatus: (status: TaskStatus) => Task[];
    getTasksByDeadline: (type: "today" | "thisWeek" | "overdue" | "noDeadline") => Task[];
    getTasksByDuration: (type: "lessThan30" | "30to60" | "60to120" | "moreThan120") => Task[];
    searchTasks: (searchTerm: string) => Task[];
    getFilteredTasks: (filters: {
        status?: TaskStatus | "all";
        deadline?: "today" | "thisWeek" | "overdue" | "noDeadline" | "all";
        duration?: "lessThan30" | "30to60" | "60to120" | "moreThan120" | "all";
        searchTerm?: string;
    }) => Task[];
}
declare const _default: TaskService;
export default _default;
