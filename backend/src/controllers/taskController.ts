import { Request, Response } from 'express';
import { TaskModel, TaskStatus, Task } from '../models/taskModel';

class TaskController {
  // Get all tasks
  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await TaskModel.findAll();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks', error });
    }
  };

  // Get a single task by ID
  getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id;
      const task = await TaskModel.findById(taskId);

      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({ message: 'Error fetching task', error });
    }
  };

  // Create a new task
  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, status, duration, deadline } = req.body;

      if (!title || !description) {
        res.status(400).json({ message: 'Title and description are required' });
        return;
      }

      const taskStatus = status || TaskStatus.TODO;
      const taskDuration = duration || 30;
      
      let deadlineDate: Date | undefined = undefined;
      if (deadline) {
        deadlineDate = new Date(deadline);
      }

      const newTask = await TaskModel.create({
        title,
        description,
        status: taskStatus,
        duration: taskDuration,
        deadline: deadlineDate
      });

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Error creating task', error });
    }
  };

  // Update a task
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id;
      const updateData = req.body;

      // Validate deadline if provided
      if (updateData.deadline) {
        updateData.deadline = new Date(updateData.deadline);
      }

      const updatedTask = await TaskModel.update(taskId, updateData);

      if (!updatedTask) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ message: 'Error updating task', error });
    }
  };

  // Delete a task
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const taskId = req.params.id;
      const deleted = await TaskModel.delete(taskId);

      if (!deleted) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task', error });
    }
  };

  // Check for timeouts
  checkTimeouts = async (req: Request, res: Response): Promise<void> => {
    try {
      await TaskModel.checkTimeouts();
      res.status(200).json({ message: 'Timeout check completed' });
    } catch (error) {
      console.error('Error checking timeouts:', error);
      res.status(500).json({ message: 'Error checking timeouts', error });
    }
  };

  // Get tasks by status
  getTasksByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      
      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        res.status(400).json({ message: 'Invalid status' });
        return;
      }
      
      const tasks = await TaskModel.findByStatus(status as TaskStatus);
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks by status:', error);
      res.status(500).json({ message: 'Error fetching tasks by status', error });
    }
  };

  // Get tasks due today
  getTasksDueToday = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await TaskModel.getTasksDueToday();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks due today:', error);
      res.status(500).json({ message: 'Error fetching tasks due today', error });
    }
  };

  // Get overdue tasks
  getOverdueTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await TaskModel.getOverdueTasks();
      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching overdue tasks:', error);
      res.status(500).json({ message: 'Error fetching overdue tasks', error });
    }
  };
}

export default new TaskController();