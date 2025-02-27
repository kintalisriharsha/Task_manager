"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const taskService_1 = tslib_1.__importDefault(require("./taskService"));
class StreamService {
    constructor() {
        // Get mock streaming data
        this.getMockStreamingData = async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            // Generate random stream names and data
            const streamPrefixes = ['Development', 'Design', 'Planning', 'Review', 'Testing', 'Deployment'];
            const streamTypes = ['Session', 'Workshop', 'Meeting', 'Standup', 'Demo', 'Live Stream'];
            // Generate 5-8 random streams
            const streamCount = Math.floor(Math.random() * 4) + 5;
            const streams = [];
            for (let i = 0; i < streamCount; i++) {
                const prefix = streamPrefixes[Math.floor(Math.random() * streamPrefixes.length)];
                const type = streamTypes[Math.floor(Math.random() * streamTypes.length)];
                streams.push({
                    id: 'stream-' + Math.floor(Math.random() * 10000),
                    name: `${prefix} ${type}`,
                    viewerCount: Math.floor(Math.random() * 1500) + 50,
                    startedAt: new Date(Date.now() - Math.floor(Math.random() * 7200000)) // Random time in last 2 hours
                });
            }
            return streams;
        };
        // Get streaming data for a specific task
        this.getStreamingDataForTask = async (taskId) => {
            const task = taskService_1.default.getTaskById(taskId);
            if (!task) {
                return undefined;
            }
            // Get available streams
            const streams = await this.getMockStreamingData();
            // Randomly select a stream
            const selectedStream = streams[Math.floor(Math.random() * streams.length)];
            // Update task with stream data
            const updatedTask = taskService_1.default.updateTask(taskId, { streamData: selectedStream });
            return updatedTask;
        };
        // Get streams filtered by viewer count
        this.getPopularStreams = async (minViewers = 500) => {
            const streams = await this.getMockStreamingData();
            return streams.filter(stream => stream.viewerCount >= minViewers);
        };
        // Get streams that started in the last hour
        this.getRecentStreams = async () => {
            const streams = await this.getMockStreamingData();
            const oneHourAgo = new Date(Date.now() - 3600000);
            return streams.filter(stream => new Date(stream.startedAt) >= oneHourAgo);
        };
        // Get streaming stats for all tasks
        this.getStreamingStats = async () => {
            const tasks = taskService_1.default.getAllTasks();
            const tasksWithStreams = tasks.filter(task => task.streamData);
            if (tasksWithStreams.length === 0) {
                return {
                    totalStreams: 0,
                    totalViewers: 0,
                    averageViewers: 0
                };
            }
            const streamData = tasksWithStreams.map(task => task.streamData);
            const totalViewers = streamData.reduce((sum, stream) => sum + stream.viewerCount, 0);
            // Find most popular stream
            const mostPopularStream = streamData.reduce((mostPopular, current) => current.viewerCount > (mostPopular?.viewerCount || 0) ? current : mostPopular, streamData[0]);
            return {
                totalStreams: streamData.length,
                totalViewers,
                averageViewers: Math.round(totalViewers / streamData.length),
                mostPopularStream
            };
        };
        // Associate streams with matching tasks based on name similarity
        this.matchStreamsToTasks = async () => {
            const tasks = taskService_1.default.getAllTasks();
            const streams = await this.getMockStreamingData();
            const matches = [];
            // Simple matching algorithm based on word overlap
            tasks.forEach(task => {
                const taskWords = (task.title + ' ' + task.description).toLowerCase().split(/\s+/);
                streams.forEach(stream => {
                    const streamWords = stream.name.toLowerCase().split(/\s+/);
                    let matchCount = 0;
                    taskWords.forEach(word => {
                        if (word.length > 3 && streamWords.includes(word)) {
                            matchCount++;
                        }
                    });
                    if (matchCount > 0) {
                        // Calculate match score (0.0-1.0)
                        const matchScore = matchCount / Math.max(taskWords.length, streamWords.length);
                        // Only include decent matches
                        if (matchScore > 0.1) {
                            matches.push({
                                task,
                                stream,
                                matchScore
                            });
                        }
                    }
                });
            });
            // Sort by match score (best matches first)
            return matches.sort((a, b) => b.matchScore - a.matchScore);
        };
    }
}
exports.default = new StreamService();
//# sourceMappingURL=streamService.js.map