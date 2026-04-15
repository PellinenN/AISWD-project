
import db from '../database/db.js';
import { Suggestion } from '../models/Suggestion.js';

export class SuggestionRepository {
    getSuggestionsByKeyword(keyword) {
        const rows = db.prepare('SELECT * FROM suggestions WHERE triggerKeyword = ?').all(keyword);
        return rows.map(row => new Suggestion(row.id, row.trigger_keyword, row.mood_id, row.text));
    }

    getSuggestionsByMood(mood_id) {
        const rows = db.prepare('SELECT * FROM suggestions WHERE mood_id = ?').all(mood_id);
        return rows.map(row => new Suggestion(row.id, row.trigger_keyword, row.mood_id, row.text));
    }

    getAllSuggestions() {
        const rows = db.prepare('SELECT * FROM suggestions').all();
        return rows.map(row => new Suggestion(row.id, row.trigger_keyword, row.mood_id, row.text));
    }
}