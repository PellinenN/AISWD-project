import db from '../database/db.js';
import JournalEntry from '../models/JournalEntry.js';

class EntryRepository {
    createEntry(user_id, content, mood_ids = []) {
        // Insert entry with first mood_id for backward compatibility, or NULL if no moods
        const firstMoodId = mood_ids && mood_ids.length > 0 ? mood_ids[0] : null;
        const stmt = db.prepare('INSERT INTO journal_entries (user_id, content, mood_id) VALUES (?, ?, ?)');
        const result = stmt.run(user_id, content, firstMoodId);
        
        // Insert moods into entry_moods junction table
        if (mood_ids && mood_ids.length > 0) {
            const moodStmt = db.prepare('INSERT INTO entry_moods (entry_id, mood_id) VALUES (?, ?)');
            for (const moodId of mood_ids) {
                moodStmt.run(result.lastInsertRowid, moodId);
            }
        }
        
        return this.getEntryById(result.lastInsertRowid);
    }

    updateEntry(id, content, mood_ids = []) {
        // Update entry with first mood_id for backward compatibility
        const firstMoodId = mood_ids && mood_ids.length > 0 ? mood_ids[0] : null;
        db.prepare('UPDATE journal_entries SET content = ?, mood_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
            .run(content, firstMoodId, id);
        
        // Remove old moods and insert new ones
        db.prepare('DELETE FROM entry_moods WHERE entry_id = ?').run(id);
        if (mood_ids && mood_ids.length > 0) {
            const moodStmt = db.prepare('INSERT INTO entry_moods (entry_id, mood_id) VALUES (?, ?)');
            for (const moodId of mood_ids) {
                moodStmt.run(id, moodId);
            }
        }
        
        return this.getEntryById(id);
    }

    deleteEntry(id) {
        db.prepare('DELETE FROM journal_entries WHERE id = ?').run(id);
    }

    getEntryById(id) {
        const row = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id);
        if (!row) return null;
        
        // Fetch associated moods from entry_moods table
        const moods = db.prepare(`
            SELECT m.id, m.name FROM moods m
            INNER JOIN entry_moods em ON m.id = em.mood_id
            WHERE em.entry_id = ?
            ORDER BY em.created_at ASC
        `).all(id);
        
        return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at, moods);
    }

    getEntriesByUserId(user_id) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? ORDER BY created_at DESC').all(user_id);
        return rows.map(row => {
            const moods = db.prepare(`
                SELECT m.id, m.name FROM moods m
                INNER JOIN entry_moods em ON m.id = em.mood_id
                WHERE em.entry_id = ?
                ORDER BY em.created_at ASC
            `).all(row.id);
            return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at, moods);
        });
    }

    getEntriesByMoodId(mood_id) {
        const rows = db.prepare(`
            SELECT DISTINCT je.* FROM journal_entries je
            INNER JOIN entry_moods em ON je.id = em.entry_id
            WHERE em.mood_id = ?
            ORDER BY je.created_at DESC
        `).all(mood_id);
        return rows.map(row => {
            const moods = db.prepare(`
                SELECT m.id, m.name FROM moods m
                INNER JOIN entry_moods em ON m.id = em.mood_id
                WHERE em.entry_id = ?
                ORDER BY em.created_at ASC
            `).all(row.id);
            return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at, moods);
        });
    }

    getAllEntries() {
        const rows = db.prepare('SELECT * FROM journal_entries ORDER BY created_at DESC').all();
        return rows.map(row => {
            const moods = db.prepare(`
                SELECT m.id, m.name FROM moods m
                INNER JOIN entry_moods em ON m.id = em.mood_id
                WHERE em.entry_id = ?
                ORDER BY em.created_at ASC
            `).all(row.id);
            return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at, moods);
        });
    }

    searchEntriesByKeyword(user_id, keyword) {
        const rows = db.prepare('SELECT * FROM journal_entries WHERE user_id = ? AND content LIKE ? ORDER BY created_at DESC')
            .all(user_id, `%${keyword}%`);
        return rows.map(row => {
            const moods = db.prepare(`
                SELECT m.id, m.name FROM moods m
                INNER JOIN entry_moods em ON m.id = em.mood_id
                WHERE em.entry_id = ?
                ORDER BY em.created_at ASC
            `).all(row.id);
            return new JournalEntry(row.id, row.user_id, row.content, row.mood_id, row.created_at, row.updated_at, moods);
        });
    }
}

export default new EntryRepository();