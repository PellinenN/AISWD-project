import entryService from '../services/entryService.js';

class EntryController {
    getEntries(req, res) {
        try {
            const user_id = req.query.user_id ? Number(req.query.user_id) : null;
            const mood_id = req.query.mood_id ? Number(req.query.mood_id) : null;
            const keyword = req.query.keyword || null;

            const result = entryService.getEntries(user_id, mood_id, keyword);

            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            return res.status(200).json({ success: true, entries: result.entries });
        } catch (error) {
            console.error('Error fetching entries:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch journal entries' });
        }
    }

    getEntryById(req, res) {
        try {
            const entryId = Number(req.params.id);

            const result = entryService.getEntryById(entryId);

            if (!result.success) {
                return res.status(404).json({ success: false, message: result.message });
            }

            return res.status(200).json({ success: true, entry: result.entry });
        } catch (error) {
            console.error('Error fetching entry by ID:', error);
            return res.status(500).json({ success: false, message: 'Failed to fetch journal entry' });
        }
    }

    createEntry(req, res) {
        try {
            const { user_id, content, mood_ids } = req.body;
            // mood_ids can be undefined/null/empty array - all are acceptable
            const moodIdsArray = Array.isArray(mood_ids) ? mood_ids : [];
            const result = entryService.createEntry(user_id, content, moodIdsArray);

            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            return res.status(201).json(result);
        } catch (error) {
            console.error('Error creating entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to create journal entry' });
        }
    }

    updateEntry(req, res) {
        try {
            const entryId = Number(req.params.id);
            const { user_id, content, mood_ids } = req.body;
            const moodIdsArray = Array.isArray(mood_ids) ? mood_ids : [];
            const result = entryService.updateEntry(entryId, user_id, content, moodIdsArray);

            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error updating entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to update journal entry' });
        }
    }

    deleteEntry(req, res) {
        try {
            const entryId = Number(req.params.id);
            const user_id = req.body.user_id ? Number(req.body.user_id) : null;
            const result = entryService.deleteEntry(entryId, user_id);

            if (!result.success) {
                return res.status(400).json({ success: false, message: result.message });
            }

            return res.status(200).json(result);
        } catch (error) {
            console.error('Error deleting entry:', error);
            return res.status(500).json({ success: false, message: 'Failed to delete journal entry' });
        }
    }
}

const entryController = new EntryController();
export default entryController;
