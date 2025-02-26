import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import streamRoutes from './routes/streamRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));

// Routes with API prefix
app.use('/api/tasks', taskRoutes);
app.use('/api/streaming', streamRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Task Manager API is running');
});

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;