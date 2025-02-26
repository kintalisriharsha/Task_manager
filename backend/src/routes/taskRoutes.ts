import { Router } from 'express';
import taskController from '../controllers/taskController';

const router = Router();

// Task CRUD routes
router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

// Additional routes
router.get('/system/check-timeouts', taskController.checkTimeouts);
router.get('/status/:status', taskController.getTasksByStatus);
router.get('/due/today', taskController.getTasksDueToday);
router.get('/due/overdue', taskController.getOverdueTasks);

export default router;