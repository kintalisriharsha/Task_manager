// src/index.ts
/**
 * Task Management API Entry Point
 * 
 * This file serves as the main entry point for the application.
 * It imports the server module which initializes and runs the Express app.
 */

import './server';

/**
 * Export model and type definitions for use in other projects
 * This allows the API to be imported as a module by other applications
 */
export { Task, TaskStatus, StreamData } from './models/taskModel';

/**
 * This structure allows the application to be started in two ways:
 * 
 * 1. Direct execution: `node dist/index.js` or `npm start`
 * 2. Import as a module: `import { Task, TaskStatus } from 'task-management-api'`
 */