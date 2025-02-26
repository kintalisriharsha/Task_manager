import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '../models/taskModel';
import { AppError } from '../utils/errorHandler';

export const validateTaskInput = (req: Request, res: Response, next: NextFunction) => {
  const { title, description } = req.body;
  
  if (!title || title.trim() === '') {
    return next(new AppError('Title is required', 400));
  }
  
  if (!description || description.trim() === '') {
    return next(new AppError('Description is required', 400));
  }
  
  next();
};

export const validateTaskStatus = (req: Request, res: Response, next: NextFunction) => {
  const { status } = req.body;
  
  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) {
    return next(new AppError('Invalid task status', 400));
  }
  
  next();
};

export const validateTaskId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  
  if (!id || typeof id !== 'string') {
    return next(new AppError('Invalid task ID', 400));
  }
  
  next();
};