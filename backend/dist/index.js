"use strict";
// src/index.ts
/**
 * Task Management API Entry Point
 *
 * This file serves as the main entry point for the application.
 * It imports the server module which initializes and runs the Express app.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskStatus = void 0;
require("./server");
/**
 * Export model and type definitions for use in other projects
 * This allows the API to be imported as a module by other applications
 */
var taskModel_1 = require("./models/taskModel");
Object.defineProperty(exports, "TaskStatus", { enumerable: true, get: function () { return taskModel_1.TaskStatus; } });
/**
 * This structure allows the application to be started in two ways:
 *
 * 1. Direct execution: `node dist/index.js` or `npm start`
 * 2. Import as a module: `import { Task, TaskStatus } from 'task-management-api'`
 */ 
//# sourceMappingURL=index.js.map