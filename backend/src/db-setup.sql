-- Run this script in MySQL to set up the database and tables
-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS task_manager CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE task_manager;

-- Create tasks table
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
);

-- Create stream_data table
CREATE TABLE IF NOT EXISTS stream_data (
  id VARCHAR(36) PRIMARY KEY,
  task_id VARCHAR(36),
  name VARCHAR(255) NOT NULL,
  viewer_count INT NOT NULL,
  started_at DATETIME NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- Create an index on task_id for faster lookup
CREATE INDEX idx_stream_data_task_id ON stream_data(task_id);