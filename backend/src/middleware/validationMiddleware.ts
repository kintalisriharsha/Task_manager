// src/middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { TaskStatus } from '../models/taskModel';

// Validate task creation request
export const validateTaskCreation = (req: Request, res: Response, next: NextFunction): void => {
  const { title, description, status, duration, deadline } = req.body;
  const errors: string[] = [];

  // Required fields
  if (!title || title.trim() === '') {
    errors.push('Title is required');
  }

  if (!description || description.trim() === '') {
    errors.push('Description is required');
  }

  // Status validation
  if (status && !Object.values(TaskStatus).includes(status)) {
    errors.push('Invalid status value');
  }

  // Duration validation
  if (duration !== undefined) {
    if (isNaN(duration) || duration <= 0) {
      errors.push('Duration must be a positive number');
    }
  }

  // Deadline validation
  if (deadline) {
    const deadlineDate = new Date(deadline);
    if (deadlineDate.toString() === 'Invalid Date') {
      errors.push('Invalid deadline date format');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ message: 'Validation failed', errors });
    return;
  }

  next();
};

// Validate task update request
export const validateTaskUpdate = (req: Request, res: Response, next: NextFunction): void => {
  const { status, duration, deadline } = req.body;
  const errors: string[] = [];

  // Status validation
  if (status && !Object.values(TaskStatus).includes(status)) {
    errors.push('Invalid status value');
  }

  // Duration validation
  if (duration !== undefined) {
    if (isNaN(duration) || duration <= 0) {
      errors.push('Duration must be a positive number');
    }
  }

  // Deadline validation
  if (deadline) {
    const deadlineDate = new Date(deadline);
    if (deadlineDate.toString() === 'Invalid Date') {
      errors.push('Invalid deadline date format');
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ message: 'Validation failed', errors });
    return;
  }

  next();
};

// Validate ID parameter
export const validateIdParam = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  
  if (!id || id.trim() === '') {
    res.status(400).json({ message: 'Invalid ID parameter' });
    return;
  }
  
  next();
};

// Validate task ID query parameter
export const validateTaskIdQuery = (req: Request, res: Response, next: NextFunction): void => {
  const { taskId } = req.query;
  
  if (!taskId || typeof taskId !== 'string' || taskId.trim() === '') {
    res.status(400).json({ message: 'taskId query parameter is required' });
    return;
  }
  
  next();
};