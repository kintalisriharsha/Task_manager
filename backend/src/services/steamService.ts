import { TaskModel, StreamData } from '../models/taskModel';
import { v4 as uuidv4 } from 'uuid';

interface StreamInput {
  name: string;
  viewerCount: number;
  startedAt: Date;
}

export class StreamService {
  // Simulate fetching data from a streaming API
  async fetchStreamingData(): Promise<StreamInput[]> {
    // Simulating an API request delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
  }

  async getStreamingDataForTask(taskId: string): Promise<StreamData | undefined> {
    const task = await TaskModel.findById(taskId);
    
    if (!task) {
      return undefined;
    }
    
    // If task already has stream data, return it
    if (task.streamData) {
      return task.streamData;
    }
    
    // Get random stream data
    const streams = await this.fetchStreamingData();
    const randomStream = streams[Math.floor(Math.random() * streams.length)];
    
    // Update task with streaming data
    const updatedTask = await TaskModel.addStreamData(taskId, randomStream);
    
    return updatedTask?.streamData;
  }
}

export const streamService = new StreamService();