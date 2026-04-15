import { SuggestionService } from '../services/suggestionService.js';

const suggestionService = new SuggestionService();

class SuggestionController {
    getSuggestions(req, res) {
        try {
            const mood_id = req.query.mood_id ? Number(req.query.mood_id) : null;
            const content = req.query.content || '';

            const suggestions = suggestionService.getSuggestionsForEntry(mood_id, content);
            res.json(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            res.status(500).json({ error: 'Failed to fetch suggestions' });
        }
    }
}

export default new SuggestionController();