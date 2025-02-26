import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// MySQL connection pool
let pool: mysql.Pool | null = null;

/**
 * Initialize the MySQL database connection pool
 */
export const initDatabase = async (): Promise<mysql.Pool> => {
  if (pool) {
    return pool;
  }

  // Create a connection pool
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'task_manager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    // Create tables if they don't exist
    await pool.execute(`
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

    await pool.execute(`
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
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

/**
 * Get the MySQL connection pool
 */
export const getDatabase = async (): Promise<mysql.Pool> => {
  if (!pool) {
    return initDatabase();
  }
  return pool;
};

/**
 * Close the database connection pool
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('Database connection closed');
  }
};

/**
 * Helper method to execute a query
 */
export const query = async (sql: string, params?: any[]): Promise<any> => {
  const db = await getDatabase();
  const [results] = await db.execute(sql, params);
  return results;
};

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
};