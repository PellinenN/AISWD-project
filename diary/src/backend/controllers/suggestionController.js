import { SuggestionService } from '../services/suggestionService.js';

const suggestionService = new SuggestionService();

class SuggestionController {
    getSuggestions(req, res) {
        try {
            // Handle mood_ids array from query parameters (mood_ids[0]=1&mood_ids[1]=2)
            const mood_ids = [];
            let index = 0;
            while (req.query[`mood_ids[${index}]`] !== undefined) {
                mood_ids.push(Number(req.query[`mood_ids[${index}]`]));
                index++;
            }
            const content = req.query.content || '';

            const suggestions = suggestionService.getSuggestionsForEntry(mood_ids, content);
            res.json(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            res.status(500).json({ error: 'Failed to fetch suggestions' });
        }
    }
}

export default new SuggestionController();