
import { SuggestionRepository } from '../repositories/suggestionRepository.js';

export class SuggestionService {

    getSuggestionsForEntry(mood_ids, content) {
        const suggestions = [];
        
        // Handle mood_ids: can be single ID, array, or empty
        const moods = Array.isArray(mood_ids) ? mood_ids : (mood_ids ? [mood_ids] : []);
        
        // Add suggestions from all selected moods
        if (moods.length > 0) {
            for (const mood_id of moods) {
                const moodSuggestions = SuggestionRepository.getSuggestionsByMood(mood_id);
                suggestions.push(...moodSuggestions);
            }
        }

        // Add suggestions based on detected keywords in content
        if (content) {
            const detectedKeywords = this.extractKeywords(content);
            detectedKeywords.forEach(keyword => {
                const keywordSuggestions = SuggestionRepository.getSuggestionsByKeyword(keyword);
                suggestions.push(...keywordSuggestions);
            });
        }

        // Deduplicate by suggestion text
        const unique = [];
        const seen = new Set();

        for (const s of suggestions) {
            if (!seen.has(s.text)) {
                seen.add(s.text);
                unique.push(s);
            }
        }
        return unique;
    }   
        
    extractKeywords(content) {
        if (!content) return [];
        const lowered = content.toLowerCase();
        const knownKeywords = ['Happy', 'Tired', 'Depressed', 'Bored', 'Sad', 'Stressed', 'Content', 'Calm', 'Anxious', 'Excited', 'Angry', 'exhausted', 'confused', 'lost'];

        return knownKeywords.filter(keyword => lowered.includes(keyword.toLowerCase()));
    }
}
