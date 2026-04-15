import JournalEntry from '../../../src/backend/models/JournalEntry.js';

describe('JournalEntry Model', () => {
  describe('Constructor', () => {
    it('should create a new JournalEntry instance with all properties', () => {
      const created = new Date('2024-01-15T10:00:00');
      const updated = new Date('2024-01-15T11:00:00');
      const entry = new JournalEntry(1, 5, 'This is my journal entry', 2, created, updated);

      expect(entry.id).toBe(1);
      expect(entry.user_id).toBe(5);
      expect(entry.content).toBe('This is my journal entry');
      expect(entry.mood_id).toBe(2);
      expect(entry.created_at).toEqual(created);
      expect(entry.updated_at).toEqual(updated);
    });

    it('should handle different id values', () => {
      const now = new Date();
      const entry1 = new JournalEntry(1, 1, 'content', 1, now, now);
      const entry2 = new JournalEntry(999, 1, 'content', 1, now, now);

      expect(entry1.id).toBe(1);
      expect(entry2.id).toBe(999);
    });

    it('should preserve various content strings', () => {
      const now = new Date();
      const contentExamples = [
        'Short entry',
        'A longer entry with multiple sentences. This one has punctuation!',
        'Entry with\nnewlines\nand\ttabs',
        '123456 numbers and symbols !@#$%',
        '',
      ];

      contentExamples.forEach((content) => {
        const entry = new JournalEntry(1, 1, content, 1, now, now);
        expect(entry.content).toBe(content);
      });
    });

    it('should handle different user_id and mood_id values', () => {
      const now = new Date();
      const entry = new JournalEntry(1, 42, 'content', 7, now, now);

      expect(entry.user_id).toBe(42);
      expect(entry.mood_id).toBe(7);
    });

    it('should preserve created_at and updated_at dates', () => {
      const created = new Date('2024-01-01T08:00:00');
      const updated = new Date('2024-01-15T20:30:00');
      const entry = new JournalEntry(1, 1, 'content', 1, created, updated);

      expect(entry.created_at).toEqual(created);
      expect(entry.updated_at).toEqual(updated);
    });
  });

  describe('Properties', () => {
    it('should allow modification of properties after creation', () => {
      const now = new Date();
      const entry = new JournalEntry(1, 1, 'original content', 1, now, now);

      entry.content = 'modified content';
      entry.mood_id = 3;

      expect(entry.content).toBe('modified content');
      expect(entry.mood_id).toBe(3);
    });

    it('should maintain property independence between instances', () => {
      const now = new Date();
      const entry1 = new JournalEntry(1, 1, 'content1', 1, now, now);
      const entry2 = new JournalEntry(2, 1, 'content2', 1, now, now);

      entry1.content = 'modified1';
      expect(entry2.content).toBe('content2');
    });
  });

  describe('Field names', () => {
    it('should use snake_case field names for database column compatibility', () => {
      const now = new Date();
      const entry = new JournalEntry(1, 5, 'content', 2, now, now);

      expect(entry).toHaveProperty('user_id');
      expect(entry).toHaveProperty('mood_id');
      expect(entry).toHaveProperty('created_at');
      expect(entry).toHaveProperty('updated_at');
    });
  });
});
