import Database from 'better-sqlite3';

const db = new Database('diary.db');

db.pragma('foreign_keys = ON');

export default db;