import entryService from '../services/entryService.js';

class EntryController {
    getEntries(req, res) {
        try {
            const userId = req.query.userId ? Number(req.query.userId) : null;
            const moodId = req.query.moodId ? Number(req.query.moodId) : null;
            const keyword = req.query.keyword || null;

            const result = entryService.getEntries(userId, moodId, keyword);

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
            const { userId, content, moodId } = req.body;
            const result = entryService.createEntry(userId, content, moodId);

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
            const { userId, content, moodId } = req.body;
            const result = entryService.updateEntry(entryId, userId, content, moodId);

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
            const userId = req.body.userId ? Number(req.body.userId) : null;
            const result = entryService.deleteEntry(entryId, userId);

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
