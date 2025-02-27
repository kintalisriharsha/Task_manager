export declare enum TaskStatus {
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    DONE = "Done",
    TIMEOUT = "Timeout"
}
export interface StreamData {
    id: string;
    name: string;
    viewerCount: number;
    startedAt: Date;
}
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    duration: number;
    deadline?: Date;
    isTimeout: boolean;
    streamData?: StreamData;
}
export declare const TaskModel: {
    create: (taskData: Omit<Task, "id" | "createdAt" | "updatedAt" | "isTimeout">) => Task;
    findAll: () => Task[];
    findById: (id: string) => Task | undefined;
    update: (id: string, taskData: Partial<Task>) => Task | undefined;
    delete: (id: string) => boolean;
    checkTimeouts: () => void;
};
export default TaskModel;
