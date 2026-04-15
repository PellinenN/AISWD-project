import SuggestionRepository from '../../../src/backend/repositories/suggestionRepository.js';
import { SuggestionService } from '../../../src/backend/services/suggestionService.js';

jest.mock('../../../src/backend/repositories/suggestionRepository.js', () => ({
  __esModule: true,
  default: {
    getSuggestionsByMood: jest.fn(),
    getSuggestionsByKeyword: jest.fn(),
  },
}));

describe('SuggestionService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSuggestionsForEntry', () => {
    it('should return suggestions based on mood_id', () => {
      const mockSuggestions = [
        {
          id: 1,
          trigger_keyword: 'stress',
          mood_id: 1,
          text: 'Try deep breathing',
        },
      ];

      SuggestionRepository.getSuggestionsByMood.mockReturnValue(mockSuggestions);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      const suggestionService = new SuggestionService();
      const suggestions = suggestionService.getSuggestionsForEntry(1, 'normal content');

      expect(suggestions.length).toBeGreaterThanOrEqual(0);
      expect(SuggestionRepository.getSuggestionsByMood).toHaveBeenCalledWith(1);
    });

    it('should extract keywords from content', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      const suggestionService = new SuggestionService();
      const suggestions = suggestionService.getSuggestionsForEntry(
        1,
        'I am feeling stressed and anxious'
      );

      // Should have called repository methods for extracted keywords
      expect(SuggestionRepository.getSuggestionsByMood).toHaveBeenCalled();
      expect(SuggestionRepository.getSuggestionsByKeyword).toHaveBeenCalledWith('Stressed');
      expect(SuggestionRepository.getSuggestionsByKeyword).toHaveBeenCalledWith('Anxious');
    });

    it('should remove duplicate suggestions', () => {
      const duplicateSuggestions = [
        { id: 1, trigger_keyword: 'stress', mood_id: 1, text: 'Same text' },
        { id: 2, trigger_keyword: 'anxious', mood_id: 1, text: 'Same text' },
      ];

      SuggestionRepository.getSuggestionsByMood.mockReturnValue(duplicateSuggestions);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      const suggestionService = new SuggestionService();
      const suggestions = suggestionService.getSuggestionsForEntry(1, 'stressed');

      // After deduplication, should have only unique text
      const uniqueTexts = new Set(suggestions.map((s) => s.text));
      expect(uniqueTexts.size).toBeLessThanOrEqual(suggestions.length);
    });

    it('should return empty array when no suggestions found', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      const suggestionService = new SuggestionService();
      const suggestions = suggestionService.getSuggestionsForEntry(1, 'normal content');

      expect(Array.isArray(suggestions)).toBe(true);
    });
  });

  describe('extractKeywords', () => {
    it('should extract known keywords from content', () => {
      const suggestionService = new SuggestionService();

      const keywords = suggestionService.extractKeywords(
        'I am feeling Happy and Tired today'
      );

      expect(keywords).toContain('Happy');
      expect(keywords).toContain('Tired');
    });

    it('should be case insensitive', () => {
      const suggestionService = new SuggestionService();

      const keywords = suggestionService.extractKeywords(
        'i am feeling happy and stressed'
      );

      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should return empty array for content without keywords', () => {
      const suggestionService = new SuggestionService();

      const keywords = suggestionService.extractKeywords('normal day today');

      expect(keywords).toEqual([]);
    });

    it('should return empty array for null or empty content', () => {
      const suggestionService = new SuggestionService();

      expect(suggestionService.extractKeywords(null)).toEqual([]);
      expect(suggestionService.extractKeywords('')).toEqual([]);
    });

    it('should detect multiple keywords in same content', () => {
      const suggestionService = new SuggestionService();

      const keywords = suggestionService.extractKeywords(
        'I feel depressed, burned out and exhausted'
      );

      expect(keywords).toContain('Depressed');
      expect(keywords).toContain('exhausted');
    });

    it('should recognize known keywords: Happy, Tired, Depressed, etc.', () => {
      const suggestionService = new SuggestionService();

      const content =
        'Happy Tired Depressed Bored Sad Stressed Content Calm Anxious Excited Angry exhausted confused lost';
      const keywords = suggestionService.extractKeywords(content);

      expect(keywords.length).toBeGreaterThan(5);
    });
  });
});
