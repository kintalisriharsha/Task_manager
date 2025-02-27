// src/controllers/taskController.ts
import { Request, Response } from 'express';
import { TaskStatus } from '../models/taskModel';
import taskService from '../services/taskService';
import { asyncHandler } from '../utils/errorHandler';

class TaskController {
  // Get all tasks
  getAllTasks = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const tasks = taskService.getAllTasks();
    res.status(200).json(tasks);
  });

  // Get a single task by ID
  getTaskById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    
    if (!taskId) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }
    
    const task = taskService.getTaskById(taskId);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(task);
  });

  // Create a new task
  createTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { title, description, status, duration, deadline } = req.body;
    
    let deadlineDate: Date | undefined = undefined;
    if (deadline) {
      deadlineDate = new Date(deadline);
    }
    
    const newTask = taskService.createTask({
      title,
      description,
      status,
      duration,
      deadline: deadlineDate
    });
    
    res.status(201).json(newTask);
  });

  // Update a task
  updateTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    
    if (!taskId) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }
    
    const updateData = req.body;
    
    // Handle deadline conversion if provided
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline);
    }
    
    const updatedTask = taskService.updateTask(taskId, updateData);
    
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(updatedTask);
  });

  // Delete a task
  deleteTask = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    
    if (!taskId) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }
    
    const deleted = taskService.deleteTask(taskId);
    
    if (!deleted) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(204).send();
  });

  // Update task status
  updateTaskStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const taskId = req.params.id;
    const { status } = req.body;
    
    if (!taskId) {
      res.status(400).json({ message: 'Task ID is required' });
      return;
    }
    
    if (!status || !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({ 
        message: 'Invalid status. Must be one of: To Do, In Progress, Done, Timeout' 
      });
      return;
    }
    
    const updatedTask = taskService.updateTaskStatus(taskId, status);
    
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(updatedTask);
  });

  // Check for timeouts
  checkTimeouts = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    taskService.checkTimeouts();
    res.status(200).json({ message: 'Timeout check completed' });
  });
}

export default new TaskController();