import { StreamData, Task } from '../models/taskModel';
declare class StreamService {
    getMockStreamingData: () => Promise<StreamData[]>;
    getStreamingDataForTask: (taskId: string) => Promise<Task | undefined>;
    getPopularStreams: (minViewers?: number) => Promise<StreamData[]>;
    getRecentStreams: () => Promise<StreamData[]>;
    getStreamingStats: () => Promise<{
        totalStreams: number;
        totalViewers: number;
        averageViewers: number;
        mostPopularStream?: StreamData;
    }>;
    matchStreamsToTasks: () => Promise<{
        task: Task;
        stream: StreamData;
        matchScore: number;
    }[]>;
}
declare const _default: StreamService;
export default _default;
