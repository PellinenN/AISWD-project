
const db = require('../database/db');
const Suggestion = require('../models/Suggestion');

class SuggestionRepository {
    getSuggestionsByKeyword(keyword) {
        const rows = db.prepare('SELECT * FROM suggestions WHERE triggerKeyword = ?').all(keyword);
        return rows.map(row => new Suggestion(row.id, row.triggerKeyword, row.moodId, row.text, row.createdAt));
    }

    getSuggestionsByMood(moodId) {
        const rows = db.prepare('SELECT * FROM suggestions WHERE moodId = ?').all(moodId);
        return rows.map(row => new Suggestion(row.id, row.triggerKeyword, row.moodId, row.text, row.createdAt));
    }

    getAllSuggestions() {
        const rows = db.prepare('SELECT * FROM suggestions').all();
        return rows.map(row => new Suggestion(row.id, row.triggerKeyword, row.moodId, row.text, row.createdAt));
    }
}

module.exports = new SuggestionRepository();