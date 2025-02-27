// src/models/taskModel.ts
export enum TaskStatus {
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
  duration: number; // in minutes
  deadline?: Date;
  isTimeout: boolean;
  streamData?: StreamData;
}

// In-memory database store
const tasks: Task[] = [];

// Add some sample tasks
const addSampleTasks = () => {
  const now = new Date();
  
  // Tomorrow's date
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // Next week
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  // Yesterday (for timeout testing)
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const sampleTasks = [
    {
      title: "Research project requirements",
      description: "Gather information about project requirements and create documentation",
      status: TaskStatus.TODO,
      duration: 120,
      deadline: tomorrow
    },
    {
      title: "Design user interface",
      description: "Create wireframes and mockups for the new application",
      status: TaskStatus.IN_PROGRESS,
      duration: 180,
      deadline: nextWeek
    },
    {
      title: "Fix login bug",
      description: "Debug and fix the login authentication issue reported by users",
      status: TaskStatus.DONE,
      duration: 60
    },
    {
      title: "Update documentation",
      description: "Update the user documentation with new feature descriptions",
      status: TaskStatus.TODO,
      duration: 90,
      deadline: yesterday // This will be marked as timeout
    },
    {
      title: "Weekly team meeting",
      description: "Discuss project progress and next steps with the team",
      status: TaskStatus.IN_PROGRESS,
      duration: 45,
      deadline: tomorrow
    }
  ];
  
  // Add sample tasks to the store
  sampleTasks.forEach(task => {
    TaskModel.create(task);
  });
  
  console.log(`Added ${sampleTasks.length} sample tasks`);
};

// Helper to generate a random ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// TaskModel with CRUD operations
export const TaskModel = {
  create: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'isTimeout'>): Task => {
    const now = new Date();
    
    const newTask: Task = {
      id: generateId(),
      ...taskData,
      createdAt: now,
      updatedAt: now,
      isTimeout: false
    };
    
    tasks.push(newTask);
    return newTask;
  },
  
  findAll: (): Task[] => {
    return [...tasks];
  },
  
  findById: (id: string): Task | undefined => {
    return tasks.find(task => task.id === id);
  },
  
  update: (id: string, taskData: Partial<Task>): Task | undefined => {
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const updatedTask: Task = {
      ...tasks[index],
      ...taskData,
      updatedAt: new Date()
    } as Task;
    
    // If task is marked as done, it's no longer in timeout
    if (taskData.status === TaskStatus.DONE) {
      updatedTask.isTimeout = false;
    }
    
    tasks[index] = updatedTask;
    return updatedTask;
  },
  
  delete: (id: string): boolean => {
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) {
      return false;
    }
    
    tasks.splice(index, 1);
    return true;
  },
  
  checkTimeouts: (): void => {
    const now = new Date();
    
    tasks.forEach(task => {
      if (
        task.deadline &&
        new Date(task.deadline) < now &&
        task.status !== TaskStatus.DONE &&
        !task.isTimeout
      ) {
        task.status = TaskStatus.TIMEOUT;
        task.isTimeout = true;
        task.updatedAt = new Date();
        console.log(`Task "${task.title}" marked as timeout`);
      }
    });
  }
};

// Initialize with sample data
addSampleTasks();

// Run timeout check on startup
TaskModel.checkTimeouts();

export default TaskModel;