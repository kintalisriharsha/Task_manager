"use strict";
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
exports.connectDatabase = exports.query = exports.closeDatabase = exports.getDatabase = exports.initDatabase = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// MySQL connection pool
let pool = null;
/**
 * Initialize the MySQL database connection pool
 */
const initDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (pool) {
        return pool;
    }
    // Create a connection pool
    const MYSQL_CONFIG = {
        host: process.env.DB_HOST || 'caboose.proxy.rlwy.net',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'pGHUGULgUogWbrfozMrDhnnVagRUNFqH',
        database: process.env.DB_NAME || 'railway',
        port: process.env.DB_PORT || 29933,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      };
      
    try {
        // Create tables if they don't exist
        yield pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        created_at DATETIME NOT NULL,
        updated_at DATETIME NOT NULL,
        duration INT NOT NULL,
        deadline DATETIME,
        is_timeout BOOLEAN NOT NULL DEFAULT 0
      )
    `);
        yield pool.execute(`
      CREATE TABLE IF NOT EXISTS stream_data (
        id VARCHAR(36) PRIMARY KEY,
        task_id VARCHAR(36),
        name VARCHAR(255) NOT NULL,
        viewer_count INT NOT NULL,
        started_at DATETIME NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);
        console.log('Database tables initialized successfully');
        return pool;
    }
    catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
});
exports.initDatabase = initDatabase;
/**
 * Get the MySQL connection pool
 */
const getDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!pool) {
        return (0, exports.initDatabase)();
    }
    return pool;
});
exports.getDatabase = getDatabase;
/**
 * Close the database connection pool
 */
const closeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    if (pool) {
        yield pool.end();
        pool = null;
        console.log('Database connection closed');
    }
});
exports.closeDatabase = closeDatabase;
/**
 * Helper method to execute a query
 */
const query = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
    const db = yield (0, exports.getDatabase)();
    const [results] = yield db.execute(sql, params);
    return results;
});
exports.query = query;
/**
 * Connect to the database
 */
const connectDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("Connecting to database...");
        yield (0, exports.initDatabase)();
        console.log("✅ Database connected successfully!");
    }
    catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error;
    }
});
exports.connectDatabase = connectDatabase;
