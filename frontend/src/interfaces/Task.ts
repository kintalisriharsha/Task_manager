export enum TaskStatus {
    TODO = "To Do",
    IN_PROGRESS = "In Progress",
    DONE = "Done",
    TIMEOUT = "Timeout"
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date;
    duration: number; // in minutes
    deadline?: Date;
    isTimeout: boolean;
    streamData?: StreamData;
  }
  
  export interface StreamData {
    id: string;
    name: string;
    viewerCount: number;
    startedAt: Date;
  }
  
  export interface TaskFormData {
    title: string;
    description: string;
    status: TaskStatus;
    duration: number;
    deadline?: Date;
  }