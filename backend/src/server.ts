// src/server.ts
import app from './app';
import { env, validateEnv } from './config/env';
import taskService from './services/taskService';
import { scheduleTimeoutChecking } from './utils/timeoutChecker';

// Validate environment variables
validateEnv();

// Log application startup
console.log(`Starting Task Management API in ${env.NODE_ENV} mode`);

// Schedule task timeout checking (every minute)
const timeoutCheckInterval = scheduleTimeoutChecking(() => {
  console.log('[Scheduler] Checking for task timeouts...');
  taskService.checkTimeouts();
}, 60000);

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
  console.log(`API is available at http://localhost:${env.PORT}`);
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