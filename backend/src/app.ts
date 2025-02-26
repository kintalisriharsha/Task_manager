import express from 'express';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import streamRoutes from './routes/streamRoutes';
import { notFound, errorHandler } from './middleware/errorMiddleware';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/tasks', taskRoutes);
app.use('/streaming', streamRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;