
const db = require('../database/db');
const Mood = require('../models/Mood');

class MoodRepository {
    getAllMoods() {
        const rows = db.prepare('SELECT * FROM moods').all();
        return rows.map(row => new Mood(row.id, row.name, row.createdAt));
    }

    getMoodById(id) {
        const row = db.prepare('SELECT * FROM moods WHERE id = ?').get(id);
        if (!row) return null;
        return new Mood(row.id, row.name, row.createdAt);
    }
}

module.exports = new MoodRepository();