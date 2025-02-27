"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEnv = exports.env = void 0;
const tslib_1 = require("tslib");
// src/config/env.ts
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Environment variables with defaults
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '5000', 10),
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    // Add other environment variables as needed
};
// Validate required environment variables
const validateEnv = () => {
    const requiredEnvVars = [
    // Add any required environment variables here
    ];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
    if (missingEnvVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    }
};
exports.validateEnv = validateEnv;
//# sourceMappingURL=env.js.map