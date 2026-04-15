import db from '../database/db.js';
import User from '../models/User.js';

class UserRepository {
    createUser(username, passwordHash) {
        const stmt = db.prepare('INSERT INTO users (username, passwordHash) VALUES (?, ?)');

        const result = stmt.run(username, passwordHash);
        return new User(result.lastInsertRowid, username, passwordHash, new Date());
    }

    getUserByUsername(username) {
        const row = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
        if (!row) return null;
        return new User(row.id, row.username, row.passwordHash, row.created_at);
    }

    getUserById(id) {
        const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        if (!row) return null;
        return new User(row.id, row.username, row.passwordHash, row.created_at);
    }
}

module.exports = new UserRepository();