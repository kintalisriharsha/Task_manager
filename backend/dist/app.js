"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// src/app.ts
const express_1 = tslib_1.__importDefault(require("express"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const env_1 = require("./config/env");
const taskRoutes_1 = tslib_1.__importDefault(require("./routes/taskRoutes"));
const streamRoutes_1 = tslib_1.__importDefault(require("./routes/streamRoutes"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// Create Express application
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// Logging middleware
app.use((0, morgan_1.default)(env_1.env.NODE_ENV === "development" ? "dev" : "combined"));
// Body parsing middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS middleware
app.use((0, cors_1.default)({
    origin: env_1.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
// API Routes
app.use("/tasks", taskRoutes_1.default);
app.use("/streaming", streamRoutes_1.default);
// Base route
app.get("/", (_req, res) => {
    res.json({
        message: "Task Management API",
        version: "1.0.0",
        status: "ok",
        environment: env_1.env.NODE_ENV,
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
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map