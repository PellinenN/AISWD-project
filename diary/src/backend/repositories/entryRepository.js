import db from '../database/db.js';
import JournalEntry from '../models/JournalEntry.js';

class EntryRepository {
    createEntry(user_id, content, mood_id) {
        const stmt = db.prepare('INSERT INTO journal_entries (user_id, content, mood_id) VALUES (?, ?, ?)');
        const result = stmt.run(user_id, content, mood_id);
        return this.getEntryById(result.lastInsertRowid);
    }

    updateEntry(id, content, mood_id) {
        db.prepare('UPDATE journal_entries SET content = ?, mood_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(content, mood_id, id);
        return this.getEntryById(id);
    }

    deleteEntry(id) {
        db.prepare('DELETE FROM journal_entries WHERE id = ?').run(id);
    }

    getEntryById(id) {
        const row = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id);
        if (!row) return null;
        return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at);
    }

    getEntriesByUserId(user_id) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
        return rows.map(row => new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at));
    }

    getEntriesByMoodId(mood_id) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE mood_id = ? ORDER BY created_at DESC').all(mood_id);
        return rows.map(row => new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at));
    }

    getAllEntries() {
        const rows = db.prepare('SELECT * FROM journal_entries ORDER BY created_at DESC').all();
        return rows.map(row => new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at));
    }

    searchEntriesByKeyword(user_id, keyword) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? AND content LIKE ? ORDER BY created_at DESC')
            .all(user_id, `%${keyword}%`);
        return rows.map(row => new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at));
    }
}

export default new EntryRepository();