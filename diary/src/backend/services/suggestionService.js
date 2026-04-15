
import SuggestionRepository from '../repositories/suggestionRepository.js';

export class SuggestionService {

    getSuggestionsForEntry(mood_id, content) {
        const suggestions = [];
        if (mood_id) {
            const moodSuggestions = SuggestionRepository.getSuggestionsByMood(mood_id);
            suggestions.push(...moodSuggestions);
        }

            const detectedKeywords = this.extractKeywords(content);
            detectedKeywords.forEach(keyword => {
                const keywordSuggestions = SuggestionRepository.getSuggestionsByKeyword(keyword);
                suggestions.push(...keywordSuggestions);
            });

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
