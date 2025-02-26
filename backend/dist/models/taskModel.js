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
exports.TaskModel = exports.TaskStatus = void 0;
const uuid_1 = require("uuid");
const database_1 = require("../db/database");
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["TODO"] = "To Do";
    TaskStatus["IN_PROGRESS"] = "In Progress";
    TaskStatus["DONE"] = "Done";
    TaskStatus["TIMEOUT"] = "Timeout";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
// Helper to convert DB row to Task
const rowToTask = (row) => {
    const task = {
        id: row.id,
        title: row.title,
        description: row.description,
        status: row.status,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
        duration: row.duration,
        isTimeout: Boolean(row.is_timeout)
    };
    if (row.deadline) {
        task.deadline = new Date(row.deadline);
    }
    return task;
};
// Helper to convert DB row to StreamData
const rowToStreamData = (row) => {
    return {
        id: row.id,
        taskId: row.task_id,
        name: row.name,
        viewerCount: row.viewer_count,
        startedAt: new Date(row.started_at)
    };
};
exports.TaskModel = {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get all tasks
            const taskRows = yield (0, database_1.query)('SELECT * FROM tasks ORDER BY created_at DESC');
            // Get all stream data
            const streamRows = yield (0, database_1.query)('SELECT * FROM stream_data');
            const streamByTaskId = streamRows.reduce((acc, stream) => {
                if (stream.task_id) {
                    acc[stream.task_id] = rowToStreamData(stream);
                }
                return acc;
            }, {});
            // Map tasks and attach stream data if available
            return taskRows.map((row) => {
                const task = rowToTask(row);
                if (streamByTaskId[task.id]) {
                    task.streamData = streamByTaskId[task.id];
                }
                return task;
            });
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get task
            const rows = yield (0, database_1.query)('SELECT * FROM tasks WHERE id = ?', [id]);
            if (rows.length === 0)
                return undefined;
            const task = rowToTask(rows[0]);
            // Get stream data if exists
            const streamRows = yield (0, database_1.query)('SELECT * FROM stream_data WHERE task_id = ?', [id]);
            if (streamRows.length > 0) {
                task.streamData = rowToStreamData(streamRows[0]);
            }
            return task;
        });
    },
    create(taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const id = (0, uuid_1.v4)();
            const newTask = Object.assign(Object.assign({ id }, taskData), { createdAt: now, updatedAt: now, isTimeout: false });
            // Insert task
            yield (0, database_1.query)(`INSERT INTO tasks (id, title, description, status, created_at, updated_at, duration, deadline, is_timeout) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                newTask.id,
                newTask.title,
                newTask.description,
                newTask.status,
                newTask.createdAt.toISOString(),
                newTask.updatedAt.toISOString(),
                newTask.duration,
                newTask.deadline ? newTask.deadline.toISOString() : null,
                0 // is_timeout false
            ]);
            return newTask;
        });
    },
    update(id, taskData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if task exists
            const existingTask = yield this.findById(id);
            if (!existingTask)
                return undefined;
            // Prepare update data
            const updatedTask = Object.assign(Object.assign(Object.assign({}, existingTask), taskData), { updatedAt: new Date() });
            // Build dynamic SQL update query
            const updates = [];
            const values = [];
            if (taskData.title !== undefined) {
                updates.push('title = ?');
                values.push(taskData.title);
            }
            if (taskData.description !== undefined) {
                updates.push('description = ?');
                values.push(taskData.description);
            }
            if (taskData.status !== undefined) {
                updates.push('status = ?');
                values.push(taskData.status);
            }
            if (taskData.duration !== undefined) {
                updates.push('duration = ?');
                values.push(taskData.duration);
            }
            if ('deadline' in taskData) {
                updates.push('deadline = ?');
                values.push(taskData.deadline ? taskData.deadline.toISOString() : null);
            }
            updates.push('updated_at = ?');
            values.push(updatedTask.updatedAt.toISOString());
            // Add the ID for the WHERE clause
            values.push(id);
            // Execute update
            if (updates.length > 0) {
                yield (0, database_1.query)(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`, values);
            }
            return updatedTask;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if task exists
            const existingTask = yield this.findById(id);
            if (!existingTask)
                return false;
            // Delete task (stream data will be deleted via cascade)
            yield (0, database_1.query)('DELETE FROM tasks WHERE id = ?', [id]);
            return true;
        });
    },
    checkTimeouts() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            // Find tasks that should be marked as timeout
            yield (0, database_1.query)(`UPDATE tasks 
       SET status = ?, is_timeout = 1, updated_at = ? 
       WHERE deadline < ? 
       AND status != ? 
       AND is_timeout = 0`, [TaskStatus.TIMEOUT, now, now, TaskStatus.DONE]);
        });
    },
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield (0, database_1.query)('SELECT * FROM tasks WHERE status = ? ORDER BY created_at DESC', [status]);
            // Map rows to Task objects
            const tasks = rows.map(rowToTask);
            // Get stream data for all tasks
            for (const task of tasks) {
                const streamRows = yield (0, database_1.query)('SELECT * FROM stream_data WHERE task_id = ?', [task.id]);
                if (streamRows.length > 0) {
                    task.streamData = rowToStreamData(streamRows[0]);
                }
            }
            return tasks;
        });
    },
    addStreamData(taskId, streamData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if task exists
            const task = yield this.findById(taskId);
            if (!task)
                return undefined;
            // Remove any existing stream data for this task
            yield (0, database_1.query)('DELETE FROM stream_data WHERE task_id = ?', [taskId]);
            // Create new stream data
            const streamId = (0, uuid_1.v4)();
            yield (0, database_1.query)(`INSERT INTO stream_data (id, task_id, name, viewer_count, started_at)
       VALUES (?, ?, ?, ?, ?)`, [
                streamId,
                taskId,
                streamData.name,
                streamData.viewerCount,
                streamData.startedAt.toISOString()
            ]);
            // Return updated task with stream data
            task.streamData = Object.assign({ id: streamId, taskId }, streamData);
            return task;
        });
    },
    removeStreamData(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check if task exists
            const task = yield this.findById(taskId);
            if (!task)
                return undefined;
            // Remove stream data
            yield (0, database_1.query)('DELETE FROM stream_data WHERE task_id = ?', [taskId]);
            // Return updated task without stream data
            delete task.streamData;
            return task;
        });
    },
    getTotalDuration() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, database_1.query)('SELECT SUM(duration) as total FROM tasks');
            return result[0].total || 0;
        });
    },
    getTasksDueToday() {
        return __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const rows = yield (0, database_1.query)(`SELECT * FROM tasks 
       WHERE deadline >= ? AND deadline < ? 
       ORDER BY deadline ASC`, [today.toISOString(), tomorrow.toISOString()]);
            return rows.map(rowToTask);
        });
    },
    getOverdueTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date().toISOString();
            const rows = yield (0, database_1.query)(`SELECT * FROM tasks 
       WHERE deadline < ? AND status != ? 
       ORDER BY deadline ASC`, [now, TaskStatus.DONE]);
            return rows.map(rowToTask);
        });
    }
};
