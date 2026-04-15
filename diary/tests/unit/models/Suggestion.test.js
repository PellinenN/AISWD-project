import { Suggestion } from '../../../src/backend/models/Suggestion.js';

describe('Suggestion Model', () => {
  describe('Constructor', () => {
    it('should create a new Suggestion instance with all properties', () => {
      const suggestion = new Suggestion(1, 'stress', 3, 'Try taking a deep breath');

      expect(suggestion.id).toBe(1);
      expect(suggestion.trigger_keyword).toBe('stress');
      expect(suggestion.mood_id).toBe(3);
      expect(suggestion.text).toBe('Try taking a deep breath');
    });

    it('should handle different id values', () => {
      const sug1 = new Suggestion(1, 'stress', 1, 'text');
      const sug2 = new Suggestion(999, 'anxiety', 2, 'text');

      expect(sug1.id).toBe(1);
      expect(sug2.id).toBe(999);
    });

    it('should preserve various trigger keywords', () => {
      const keywords = ['stress', 'anxiety', 'overwhelm', 'sadness', 'anger', 'panic'];

      keywords.forEach((keyword) => {
        const suggestion = new Suggestion(1, keyword, 1, 'text');
        expect(suggestion.trigger_keyword).toBe(keyword);
      });
    });

    it('should preserve mood_id values', () => {
      const suggestion = new Suggestion(1, 'stress', 5, 'text');
      expect(suggestion.mood_id).toBe(5);
    });

    it('should preserve various suggestion texts', () => {
      const texts = [
        'Short text',
        'A longer text with multiple sentences. This one has punctuation!',
        'Text with\nnewlines',
        '123456 numbers and symbols !@#$%',
      ];

      texts.forEach((text) => {
        const suggestion = new Suggestion(1, 'keyword', 1, text);
        expect(suggestion.text).toBe(text);
      });
    });
  });

  describe('Properties', () => {
    it('should allow modification of properties after creation', () => {
      const suggestion = new Suggestion(1, 'stress', 1, 'original text');

      suggestion.text = 'modified text';
      suggestion.mood_id = 2;

      expect(suggestion.text).toBe('modified text');
      expect(suggestion.mood_id).toBe(2);
    });

    it('should maintain property independence between instances', () => {
      const sug1 = new Suggestion(1, 'stress', 1, 'text1');
      const sug2 = new Suggestion(2, 'anxiety', 2, 'text2');

      sug1.text = 'modified1';
      expect(sug2.text).toBe('text2');
    });
  });

  describe('Field names', () => {
    it('should use snake_case field names for database column compatibility', () => {
      const suggestion = new Suggestion(1, 'stress', 2, 'text');

      expect(suggestion).toHaveProperty('trigger_keyword');
      expect(suggestion).toHaveProperty('mood_id');
    });
  });

  describe('Creating multiple suggestions', () => {
    it('should allow creating multiple suggestions with different ids', () => {
      const suggestions = [
        new Suggestion(1, 'stress', 1, 'Take a break'),
        new Suggestion(2, 'anxiety', 2, 'Practice breathing'),
        new Suggestion(3, 'sadness', 3, 'Reach out to someone'),
      ];

      expect(suggestions).toHaveLength(3);
      expect(suggestions[0].trigger_keyword).toBe('stress');
      expect(suggestions[1].trigger_keyword).toBe('anxiety');
      expect(suggestions[2].trigger_keyword).toBe('sadness');
    });
  });
});
