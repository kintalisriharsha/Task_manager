// Update src/index.ts to properly import and use your server.ts logic
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { TaskModel } from './models/taskModel';
import { initDatabase } from './db/database';

const PORT = process.env.PORT || 5000;

// Initialize database and start server
(async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');

    // Check for timeouts every minute
    setInterval(() => {
      console.log('Checking for task timeouts...');
      TaskModel.checkTimeouts();
    }, 60000);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
})();