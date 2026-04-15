import JournalEntry from '../../../src/backend/models/JournalEntry.js';
import db from '../../../src/backend/database/db.js';

jest.mock('../../../src/backend/database/db.js');

describe('EntryRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should create an entry and return a JournalEntry instance', async () => {
      const mockDate = new Date('2024-01-15T10:00:00');
      const mockStmt = {
        run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
        get: jest.fn().mockReturnValue({
          id: 1,
          user_id: 1,
          content: 'Test entry content',
          mood_id: 2,
          created_at: mockDate,
          updated_at: mockDate,
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entry = entryRepository.createEntry(1, 'Test entry content', 2);

      expect(entry).toBeInstanceOf(JournalEntry);
      expect(entry.id).toBe(1);
      expect(entry.user_id).toBe(1);
      expect(entry.content).toBe('Test entry content');
      expect(entry.mood_id).toBe(2);
    });
  });

  describe('updateEntry', () => {
    it('should update an entry and return updated JournalEntry', async () => {
      const mockStmt = {
        run: jest.fn(),
        get: jest.fn().mockReturnValue({
          id: 1,
          user_id: 1,
          content: 'Updated content',
          mood_id: 3,
          created_at: new Date('2024-01-15T10:00:00'),
          updated_at: new Date('2024-01-15T11:00:00'),
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entry = entryRepository.updateEntry(1, 'Updated content', 3);

      expect(entry).toBeInstanceOf(JournalEntry);
      expect(entry.content).toBe('Updated content');
      expect(entry.mood_id).toBe(3);
    });

    it('should call db.prepare with UPDATE statement', async () => {
      const mockStmt = {
        run: jest.fn(),
        get: jest.fn().mockReturnValue({
          id: 1,
          user_id: 1,
          content: 'Updated',
          mood_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      entryRepository.updateEntry(1, 'Updated', 2);

      expect(db.prepare).toHaveBeenCalled();
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry without error', async () => {
      const mockStmt = {
        run: jest.fn(),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      expect(() => entryRepository.deleteEntry(1)).not.toThrow();
      expect(mockStmt.run).toHaveBeenCalled();
    });
  });

  describe('getEntryById', () => {
    it('should return a JournalEntry for existing id', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue({
          id: 1,
          user_id: 1,
          content: 'Test entry',
          mood_id: 2,
          created_at: new Date('2024-01-15T10:00:00'),
          updated_at: new Date('2024-01-15T10:00:00'),
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entry = entryRepository.getEntryById(1);

      expect(entry).toBeInstanceOf(JournalEntry);
      expect(entry.id).toBe(1);
      expect(entry.content).toBe('Test entry');
    });

    it('should return null for non-existing id', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entry = entryRepository.getEntryById(999);

      expect(entry).toBeNull();
    });
  });

  describe('getEntriesByUserId', () => {
    it('should return array of JournalEntry instances for valid user', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              user_id: 1,
              content: 'Entry 1',
              mood_id: 2,
              created_at: new Date('2024-01-15'),
              updated_at: new Date('2024-01-15'),
            },
            {
              id: 2,
              user_id: 1,
              content: 'Entry 2',
              mood_id: 3,
              created_at: new Date('2024-01-14'),
              updated_at: new Date('2024-01-14'),
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getEntriesByUserId(1);

      expect(entries).toHaveLength(2);
      expect(entries[0]).toBeInstanceOf(JournalEntry);
      expect(entries[0].user_id).toBe(1);
      expect(entries[1].user_id).toBe(1);
    });

    it('should return empty array when user has no entries', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getEntriesByUserId(999);

      expect(entries).toEqual([]);
    });
  });

  describe('getEntriesByMoodId', () => {
    it('should return array of JournalEntry instances for valid mood', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              user_id: 1,
              content: 'Happy entry',
              mood_id: 2,
              created_at: new Date('2024-01-15'),
              updated_at: new Date('2024-01-15'),
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getEntriesByMoodId(2);

      expect(entries).toHaveLength(1);
      expect(entries[0].mood_id).toBe(2);
    });

    it('should return empty array when no entries with mood', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getEntriesByMoodId(999);

      expect(entries).toEqual([]);
    });
  });

  describe('getAllEntries', () => {
    it('should return array of all JournalEntry instances', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              user_id: 1,
              content: 'Entry 1',
              mood_id: 2,
              created_at: new Date(),
              updated_at: new Date(),
            },
            {
              id: 2,
              user_id: 2,
              content: 'Entry 2',
              mood_id: 3,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getAllEntries();

      expect(entries).toHaveLength(2);
      entries.forEach((entry) => {
        expect(entry).toBeInstanceOf(JournalEntry);
      });
    });

    it('should return empty array when no entries exist', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.getAllEntries();

      expect(entries).toEqual([]);
    });
  });

  describe('searchEntriesByKeyword', () => {
    it('should return entries matching keyword for user', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              user_id: 1,
              content: 'I went hiking today',
              mood_id: 2,
              created_at: new Date(),
              updated_at: new Date(),
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.searchEntriesByKeyword(1, 'hiking');

      expect(entries).toHaveLength(1);
      expect(entries[0].content).toContain('hiking');
    });

    it('should return empty array when no matches found', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: entryRepository } = await import(
        '../../../src/backend/repositories/entryRepository.js'
      );

      const entries = entryRepository.searchEntriesByKeyword(1, 'nonexistent');

      expect(entries).toEqual([]);
    });
  });
});
