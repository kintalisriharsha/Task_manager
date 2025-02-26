// src/db/database.ts
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// SQLite database handling (as fallback or for development)
import sqlite3 from 'sqlite3';
import { open, Database as SQLiteDatabase } from 'sqlite';

// MySQL database handling (for production)
import mysql from 'mysql2/promise';

// Database type definition
type DatabaseType = 'mysql' | 'sqlite';

// Configuration
const DB_TYPE: DatabaseType = (process.env.DB_TYPE || 'sqlite') as DatabaseType;
const MYSQL_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'harsha@019',
  database: process.env.DB_NAME || 'task_manager',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// Ensure the database directory exists for SQLite
const dbDir = path.resolve(__dirname, '../../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = path.join(dbDir, 'tasks.db');

// Database instances
let sqliteDb: SQLiteDatabase | null = null;
let mysqlPool: mysql.Pool | null = null;

/**
 * Initialize the SQLite database
 */
async function initSQLite(): Promise<SQLiteDatabase> {
  if (sqliteDb) {
    return sqliteDb;
  }

  console.log('Initializing SQLite database...');
  
  // Open database connection
  sqliteDb = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Enable foreign keys
  await sqliteDb.exec('PRAGMA foreign_keys = ON');

  // Create tables if they don't exist
  await sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at DATETIME NOT NULL,
      updated_at DATETIME NOT NULL,
      duration INTEGER NOT NULL,
      deadline DATETIME,
      is_timeout BOOLEAN NOT NULL DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS stream_data (
      id TEXT PRIMARY KEY,
      task_id TEXT,
      name TEXT NOT NULL,
      viewer_count INTEGER NOT NULL,
      started_at DATETIME NOT NULL,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
    );
  `);

  console.log('SQLite database initialized successfully');
  return sqliteDb;
}

/**
 * Initialize the MySQL database
 */
async function initMySQL(): Promise<mysql.Pool> {
  if (mysqlPool) {
    return mysqlPool;
  }

  console.log('Initializing MySQL database...');
  
  try {
    // Create a connection pool
    mysqlPool = mysql.createPool(MYSQL_CONFIG);

    // Test the connection
    await mysqlPool.query('SELECT 1');

    // Create tables if they don't exist
    await mysqlPool.execute(`
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

    await mysqlPool.execute(`
      CREATE TABLE IF NOT EXISTS stream_data (
        id VARCHAR(36) PRIMARY KEY,
        task_id VARCHAR(36),
        name VARCHAR(255) NOT NULL,
        viewer_count INT NOT NULL,
        started_at DATETIME NOT NULL,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
      )
    `);

    console.log('MySQL database initialized successfully');
    return mysqlPool;
  } catch (error) {
    console.error('MySQL initialization error:', error);
    throw error;
  }
}

/**
 * Initialize the database based on configuration
 */
export const initDatabase = async (): Promise<void>  => {
  try {
    if (DB_TYPE === 'mysql') {
      try {
        await initMySQL();
      } catch (error) {
        console.warn('Failed to initialize MySQL, falling back to SQLite...');
        await initSQLite();
      }
    } else {
      await initSQLite();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * Close the database connection
 */
export const closeDatabase = async (): Promise<void> => {
  if (sqliteDb) {
    await sqliteDb.close();
    sqliteDb = null;
    console.log('SQLite database connection closed');
  }
  
  if (mysqlPool) {
    await mysqlPool.end();
    mysqlPool = null;
    console.log('MySQL database connection closed');
  }
}

/**
 * Execute a query with appropriate database adapter
 */
export const query = async (sql: string, params?: any[]): Promise<any>  => {
  try {
    if (DB_TYPE === 'mysql' && mysqlPool) {
      const [results] = await mysqlPool.execute(sql, params);
      return results;
    } else {
      // Fall back to SQLite or use it if it's the configured type
      if (!sqliteDb) {
        await initSQLite();
      }
      return await sqliteDb!.all(sql, params);
    }
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

/**
 * Connect to the database
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    console.log("Connecting to database...");
    await initDatabase();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}