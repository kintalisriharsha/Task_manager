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
declare const dbConfig: DbConfig;
export default dbConfig;
