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
exports.streamService = exports.StreamService = void 0;
const taskModel_1 = require("../models/taskModel");
class StreamService {
    // Simulate fetching data from a streaming API
    fetchStreamingData() {
        return __awaiter(this, void 0, void 0, function* () {
            // Simulating an API request delay
            yield new Promise(resolve => setTimeout(resolve, 500));
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
    }
    getStreamingDataForTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield taskModel_1.TaskModel.findById(taskId);
            if (!task) {
                return undefined;
            }
            // If task already has stream data, return it
            if (task.streamData) {
                return task.streamData;
            }
            // Get random stream data
            const streams = yield this.fetchStreamingData();
            const randomStream = streams[Math.floor(Math.random() * streams.length)];
            // Update task with streaming data
            const updatedTask = yield taskModel_1.TaskModel.addStreamData(taskId, randomStream);
            return updatedTask === null || updatedTask === void 0 ? void 0 : updatedTask.streamData;
        });
    }
}
exports.StreamService = StreamService;
exports.streamService = new StreamService();
