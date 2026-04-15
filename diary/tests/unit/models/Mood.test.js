import Mood from '../../../src/backend/models/Mood.js';

describe('Mood Model', () => {
  describe('Constructor', () => {
    it('should create a new Mood instance with all properties', () => {
      const mood = new Mood(1, 'happy');

      expect(mood.id).toBe(1);
      expect(mood.name).toBe('happy');
    });

    it('should handle different id values', () => {
      const mood1 = new Mood(1, 'happy');
      const mood2 = new Mood(999, 'sad');

      expect(mood1.id).toBe(1);
      expect(mood2.id).toBe(999);
    });

    it('should preserve various mood names', () => {
      const moodNames = [
        'happy',
        'sad',
        'anxious',
        'calm',
        'excited',
        'depressed',
        'peaceful',
        'angry',
        'overwhelmed',
        'neutral',
      ];

      moodNames.forEach((name) => {
        const mood = new Mood(1, name);
        expect(mood.name).toBe(name);
      });
    });

    it('should handle case sensitivity in mood names', () => {
      const mood1 = new Mood(1, 'happy');
      const mood2 = new Mood(2, 'Happy');
      const mood3 = new Mood(3, 'HAPPY');

      expect(mood1.name).toBe('happy');
      expect(mood2.name).toBe('Happy');
      expect(mood3.name).toBe('HAPPY');
    });

    it('should handle special characters in mood names', () => {
      const mood = new Mood(1, 'so-so_fine');
      expect(mood.name).toBe('so-so_fine');
    });
  });

  describe('Properties', () => {
    it('should allow modification of properties after creation', () => {
      const mood = new Mood(1, 'happy');

      mood.name = 'sad';

      expect(mood.name).toBe('sad');
    });

    it('should maintain property independence between instances', () => {
      const mood1 = new Mood(1, 'happy');
      const mood2 = new Mood(2, 'sad');

      mood1.name = 'modified';
      expect(mood2.name).toBe('sad');
    });
  });

  describe('Creating multiple moods', () => {
    it('should allow creating multiple moods with different ids', () => {
      const moods = [
        new Mood(1, 'happy'),
        new Mood(2, 'sad'),
        new Mood(3, 'anxious'),
      ];

      expect(moods).toHaveLength(3);
      expect(moods[0].id).toBe(1);
      expect(moods[1].id).toBe(2);
      expect(moods[2].id).toBe(3);
    });
  });
});
