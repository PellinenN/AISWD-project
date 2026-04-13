const Database = require('better-sqlite3');

const db = new Database('diary.db');

db.pragma('forein_keys = ON');

module.exports = db;