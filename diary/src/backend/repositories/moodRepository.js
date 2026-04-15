import db from '../database/db.js';
import Mood from '../models/Mood.js';

class MoodRepository {
    getAllMoods() {
        const rows = db.prepare('SELECT * FROM moods').all();
        return rows.map(row => new Mood(row.id, row.name));
    }

    getMoodById(id) {
        const row = db.prepare('SELECT * FROM moods WHERE id = ?').get(id);
        if (!row) return null;
        return new Mood(row.id, row.name);
    }
}

export default new MoodRepository();