"use strict";
// src/config/db.ts
/**
 * This file is a placeholder for database configuration.
 * Since we're using in-memory storage, no actual database connection is made.
 * If you want to add a database in the future, configure it here.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Implementation for in-memory storage (no actual database)
const dbConfig = {
    // Mock connection function
    connect: async () => {
        console.log('Using in-memory storage (no database connection)');
        return Promise.resolve();
    },
    // Mock disconnect function
    disconnect: async () => {
        console.log('In-memory storage disconnected');
        return Promise.resolve();
    },
    // Always returns true since in-memory storage is always "connected"
    isConnected: () => {
        return true;
    }
};
exports.default = dbConfig;
//# sourceMappingURL=db.js.map