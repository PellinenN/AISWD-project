
const db = require('../database/db');
const JournalEntry = require('../models/JournalEntry');

class EntryRepository {
    createEntry(userId, content, moodId) {
        const stmt = db.prepare('INSERT INTO journal_entries (userId, content, moodId) VALUES (?, ?, ?)');
        const result = stmt.run(userId, content, moodId);
        return this.getEntryById(result.lastInsertRowid);
    }

    updateEntry(id, content, moodId) {
        db.prepare('UPDATE journal_entries SET content = ?, moodId = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?') 
            .run(content, moodId, id);
        return this.getEntryById(id);
    }

    deleteEntry(id) {
        db.prepare('DELETE FROM journal_entries WHERE id = ?').run(id);
    }

    getEntryById(id) {
        const row = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id);
        if (!row) return null;
        return new JournalEntry(row.id, row.userId, row.content, row.moodId, row.createdAt, row.updatedAt);
    }

    getEntriesByUserId(userId) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC').all(userId);
        return rows.map(row => new JournalEntry(row.id, row.userId, row.content, row.moodId, row.createdAt, row.updatedAt));
    }

    getEntriesByMoodId(moodId) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE moodId = ? ORDER BY createdAt DESC').all(moodId);
        return rows.map(row => new JournalEntry(row.id, row.userId, row.content, row.moodId, row.createdAt, row.updatedAt));
    }

    searchEntriesByKeyword(userId, keyword) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE userId = ? AND content LIKE ? ORDER BY createdAt DESC')
            .all(userId, `%${keyword}%`);
        return rows.map(row => new JournalEntry(row.id, row.userId, row.content, row.moodId, row.createdAt, row.updatedAt));
    }
}

module.exports = new EntryRepository();