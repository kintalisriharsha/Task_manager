// src/routes/taskRoutes.ts
import { Router } from 'express';
import taskController from '../controllers/taskController';
import { 
  validateTaskCreation, 
  validateTaskUpdate, 
  validateIdParam 
} from '../middleware/validationMiddleware';

const router = Router();

// Task CRUD routes
router.get('/', taskController.getAllTasks);
router.get('/:id', validateIdParam, taskController.getTaskById);
router.post('/', validateTaskCreation, taskController.createTask);
router.put('/:id', validateIdParam, validateTaskUpdate, taskController.updateTask);
router.delete('/:id', validateIdParam, taskController.deleteTask);

// Task status update route
router.put('/:id/status', validateIdParam, taskController.updateTaskStatus);

// Timeout check route
router.get('/system/check-timeouts', taskController.checkTimeouts);

export default router;