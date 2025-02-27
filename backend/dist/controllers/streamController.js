"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const streamService_1 = tslib_1.__importDefault(require("../services/streamService"));
const errorHandler_1 = require("../utils/errorHandler");
class StreamController {
    constructor() {
        // Fetch streaming data for a task
        this.getStreamingData = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const { taskId } = req.query;
            if (!taskId || typeof taskId !== 'string') {
                res.status(400).json({ message: 'taskId query parameter is required' });
                return;
            }
            const streamData = await streamService_1.default.getStreamingDataForTask(taskId);
            if (!streamData) {
                res.status(404).json({ message: 'Task not found' });
                return;
            }
            // Get the updated task with streaming data
            const updatedTask = await streamService_1.default.getStreamingDataForTask(taskId);
            res.status(200).json({
                message: 'Streaming data fetched successfully',
                stream: streamData,
                task: updatedTask
            });
        });
        // Get all available streams (mock data)
        this.getAllStreams = (0, errorHandler_1.asyncHandler)(async (_req, res) => {
            const streams = await streamService_1.default.getMockStreamingData();
            res.status(200).json({
                message: 'Available streams fetched successfully',
                streams
            });
        });
    }
}
exports.default = new StreamController();
//# sourceMappingURL=streamController.js.map