"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/server.ts
const app_1 = tslib_1.__importDefault(require("./app"));
const env_1 = require("./config/env");
const taskService_1 = tslib_1.__importDefault(require("./services/taskService"));
const timeoutChecker_1 = require("./utils/timeoutChecker");
// Validate environment variables
(0, env_1.validateEnv)();
// Log application startup
console.log(`Starting Task Management API in ${env_1.env.NODE_ENV} mode`);
// Schedule task timeout checking (every minute)
const timeoutCheckInterval = (0, timeoutChecker_1.scheduleTimeoutChecking)(() => {
    console.log('[Scheduler] Checking for task timeouts...');
    taskService_1.default.checkTimeouts();
}, 60000);
// Start server
const server = app_1.default.listen(env_1.env.PORT, () => {
    console.log(`Server running on port ${env_1.env.PORT}`);
    console.log(`API is available at http://localhost:${env_1.env.PORT}`);
});
// Handle graceful shutdown
const gracefulShutdown = () => {
    console.log('Shutting down gracefully...');
    // Clear the timeout checking interval
    clearInterval(timeoutCheckInterval);
    // Close the HTTP server
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
    // Force close after 10 seconds if graceful shutdown fails
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
// Listen for termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown();
});
// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown();
});
//# sourceMappingURL=server.js.map