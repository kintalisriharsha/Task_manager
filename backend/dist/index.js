"use strict";
// src/index.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const taskModel_1 = require("./models/taskModel");
const database_1 = require("./db/database");
const PORT = process.env.PORT || 5000;
// Initialize database and start server
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database first
        yield (0, database_1.connectDatabase)();
        console.log('Database initialized successfully');
        // Check for timeouts every minute
        setInterval(() => {
            console.log('Checking for task timeouts...');
            taskModel_1.TaskModel.checkTimeouts();
        }, 60000);
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // Handle graceful shutdown
        process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Shutting down server...');
            process.exit(0);
        }));
        process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Shutting down server...');
            process.exit(0);
        }));
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}))();
