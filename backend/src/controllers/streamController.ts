import { Request, Response } from 'express';
import { TaskModel, StreamData } from '../models/taskModel';

// Simulate fetching data from a streaming API
const fetchStreamingData = async (): Promise<Omit<StreamData, 'id' | 'taskId'>[]> => {
  // Simulating an API request delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock streaming data
  return [
    {
      name: 'Development Stream',
      viewerCount: 1250,
      startedAt: new Date(Date.now() - 3600000) // Started 1 hour ago
    },
    {
      name: 'Design Workshop',
      viewerCount: 890,
      startedAt: new Date(Date.now() - 7200000) // Started 2 hours ago
    },
    {
      name: 'Code Review Session',
      viewerCount: 560,
      startedAt: new Date(Date.now() - 1800000) // Started 30 minutes ago
    }
  ];
};

class StreamController {
  // Fetch streaming data for a task
  getStreamingData = async (req: Request, res: Response): Promise<void> => {
    try {
      const { taskId } = req.query;
      
      if (!taskId) {
        res.status(400).json({ message: 'taskId is required' });
        return;
      }
      
      const task = await TaskModel.findById(taskId as string);
      
      if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
      }
      
      // Fetch streaming data
      const streamingData = await fetchStreamingData();
      
      // Randomly select a stream to associate with the task
      const randomStream = streamingData[Math.floor(Math.random() * streamingData.length)];
      
      // Update task with streaming data
      const updatedTask = await TaskModel.addStreamData(task.id, randomStream);
      
      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error fetching streaming data:', error);
      res.status(500).json({ message: 'Error fetching streaming data', error });
    }
  };
}

export default new StreamController();