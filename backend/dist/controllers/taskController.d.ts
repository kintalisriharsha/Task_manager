declare class TaskController {
    getAllTasks: (req: any, res: any, next: any) => void;
    getTaskById: (req: any, res: any, next: any) => void;
    createTask: (req: any, res: any, next: any) => void;
    updateTask: (req: any, res: any, next: any) => void;
    deleteTask: (req: any, res: any, next: any) => void;
    updateTaskStatus: (req: any, res: any, next: any) => void;
    checkTimeouts: (req: any, res: any, next: any) => void;
}
declare const _default: TaskController;
export default _default;
