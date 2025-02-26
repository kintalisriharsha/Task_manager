"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const taskModel_1 = require("../models/taskModel");
// Simulate fetching data from a streaming API
const fetchStreamingData = () => __awaiter(void 0, void 0, void 0, function* () {
    // Simulating an API request delay
    yield new Promise(resolve => setTimeout(resolve, 1000));
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
});
class StreamController {
    constructor() {
        // Fetch streaming data for a task
        this.getStreamingData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { taskId } = req.query;
                if (!taskId) {
                    res.status(400).json({ message: 'taskId is required' });
                    return;
                }
                const task = yield taskModel_1.TaskModel.findById(taskId);
                if (!task) {
                    res.status(404).json({ message: 'Task not found' });
                    return;
                }
                // Fetch streaming data
                const streamingData = yield fetchStreamingData();
                // Randomly select a stream to associate with the task
                const randomStream = streamingData[Math.floor(Math.random() * streamingData.length)];
                // Update task with streaming data
                const updatedTask = yield taskModel_1.TaskModel.addStreamData(task.id, randomStream);
                res.status(200).json(updatedTask);
            }
            catch (error) {
                console.error('Error fetching streaming data:', error);
                res.status(500).json({ message: 'Error fetching streaming data', error });
            }
        });
    }
}
exports.default = new StreamController();
