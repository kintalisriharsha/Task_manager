// src/app.ts
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import taskRoutes from "./routes/taskRoutes";
import streamRoutes from "./routes/streamRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

// Create Express application
const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// API Routes
app.use("/tasks", taskRoutes);
app.use("/streaming", streamRoutes);

// Base route
app.get("/", (_req, res) => {
  res.json({
    message: "Task Management API",
    version: "1.0.0",
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
