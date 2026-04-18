import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Support database path from environment variable (set by Docker entrypoint)
// Defaults to diary.db in the current working directory
const databasePath = process.env.DATABASE_PATH || 'diary.db';

const db = new Database(databasePath);

db.pragma('foreign_keys = ON');

export default db;