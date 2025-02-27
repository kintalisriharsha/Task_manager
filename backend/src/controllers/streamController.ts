// src/controllers/streamController.ts
import { Request, Response } from 'express';
import streamService from '../services/streamService';
import { asyncHandler } from '../utils/errorHandler';

class StreamController {
  // Fetch streaming data for a task
  getStreamingData = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { taskId } = req.query;
    
    if (!taskId || typeof taskId !== 'string') {
      res.status(400).json({ message: 'taskId query parameter is required' });
      return;
    }
    
    const streamData = await streamService.getStreamingDataForTask(taskId);
    
    if (!streamData) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    // Get the updated task with streaming data
    const updatedTask = await streamService.getStreamingDataForTask(taskId);
    
    res.status(200).json({ 
      message: 'Streaming data fetched successfully',
      stream: streamData,
      task: updatedTask
    });
  });
  
  // Get all available streams (mock data)
  getAllStreams = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const streams = await streamService.getMockStreamingData();
    
    res.status(200).json({
      message: 'Available streams fetched successfully',
      streams
    });
  });
}

export default new StreamController();