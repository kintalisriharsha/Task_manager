// src/config/db.ts
/**
 * This file is a placeholder for database configuration.
 * Since we're using in-memory storage, no actual database connection is made.
 * If you want to add a database in the future, configure it here.
 */

interface DbConfig {
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    isConnected: () => boolean;
  }
  
  // Implementation for in-memory storage (no actual database)
  const dbConfig: DbConfig = {
    // Mock connection function
    connect: async (): Promise<void> => {
      console.log('Using in-memory storage (no database connection)');
      return Promise.resolve();
    },
    
    // Mock disconnect function
    disconnect: async (): Promise<void> => {
      console.log('In-memory storage disconnected');
      return Promise.resolve();
    },
    
    // Always returns true since in-memory storage is always "connected"
    isConnected: (): boolean => {
      return true;
    }
  };
  
  export default dbConfig;