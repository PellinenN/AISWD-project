import { SuggestionService } from '../services/suggestionService.js';

const suggestionService = new SuggestionService();

class SuggestionController {
    getSuggestions(req, res) {
        try {
            const moodId = req.query.moodId ? Number(req.query.moodId) : null;
            const content = req.query.content || '';

            const suggestions = suggestionService.getSuggestionsForEntry(moodId, content);
            res.json(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            res.status(500).json({ error: 'Failed to fetch suggestions' });
        }
    }
}

export default new SuggestionController();