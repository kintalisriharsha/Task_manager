// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDatabase, closeDatabase } from './db/database';
import taskRoutes from './routes/taskRoutes';
import streamRoutes from './routes/streamRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { TaskModel } from './models/taskModel';

// Create the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// API routes
app.use('/api/tasks', taskRoutes);
app.use('/api/streaming', streamRoutes);

// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
  });
} else {
  // Basic route for API testing in development
  app.get('/', (req, res) => {
    res.send('Task Manager API is running');
  });
}

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to database with fallback mechanism
    await connectDatabase();
    
    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Check for timeouts every minute
    const timeoutInterval = setInterval(() => {
      console.log('Checking for task timeouts...');
      TaskModel.checkTimeouts().catch(error => {
        console.error('Error checking timeouts:', error);
      });
    }, 60000);

    // Handle graceful shutdown
    const gracefulShutdown = async () => {
      console.log('Shutting down server...');
      clearInterval(timeoutInterval);
      
      server.close(async () => {
        await closeDatabase();
        console.log('Server shutdown complete');
        process.exit(0);
      });
      
      // Force close after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        console.error('Could not close connections in time, forcing shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Application continues to run, but log the error
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

export default app;