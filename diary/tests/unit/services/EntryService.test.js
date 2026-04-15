import db from '../../../src/backend/database/db.js';
import JournalEntry from '../../../src/backend/models/JournalEntry.js';

jest.mock('../../../src/backend/database/db.js');

describe('EntryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should successfully create an entry', async () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'Test entry content',
        mood_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, 'Test entry content', 2);

      expect(result.success).toBe(true);
      expect(result.entry).toEqual(mockEntry);
      expect(result.message).toBe('Entry created successfully');
    });

    it('should return error for missing user_id', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(null, 'content', 1);

      expect(result.success).toBe(false);
      expect(result.entry).toBeNull();
      expect(result.message).toContain('required');
    });

    it('should return error for missing content', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, null, 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should return error for missing mood_id', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, 'content', null);

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should return error for non-string content', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, 12345, 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('must be a string');
    });

    it('should return error for empty content after trimming', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, '   ', 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('cannot be empty');
    });

    it('should return error for content exceeding 10000 characters', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const longContent = 'a'.repeat(10001);
      const result = entryService.createEntry(1, longContent, 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('cannot exceed 10000 characters');
    });

    it('should trim whitespace from content', async () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'trimmed content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.createEntry(1, '  trimmed content  ', 1);

      expect(result.success).toBe(true);
    });
  });

  describe('updateEntry', () => {
    it('should successfully update an entry', async () => {
      const mockExistingEntry = {
        id: 1,
        user_id: 1,
        content: 'Old content',
        mood_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockUpdatedEntry = {
        id: 1,
        user_id: 1,
        content: 'Updated content',
        mood_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      };

      let callCount = 0;
      const mockStmt = {
        run: jest.fn(),
        get: jest
          .fn()
          .mockImplementation(() => {
            callCount++;
            return callCount === 1 ? mockExistingEntry : mockUpdatedEntry;
          }),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.updateEntry(1, 1, 'Updated content', 3);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Entry updated successfully');
    });

    it('should return error if entry not found', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.updateEntry(999, 1, 'content', 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Entry not found');
    });

    it('should return error if user does not own entry', async () => {
      const mockEntry = {
        id: 1,
        user_id: 2, // Different user
        content: 'content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.updateEntry(1, 1, 'content', 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });

    it('should return error for empty content', async () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.updateEntry(1, 1, '   ', 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('cannot be empty');
    });
  });

  describe('deleteEntry', () => {
    it('should successfully delete an entry', async () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockEntry),
        run: jest.fn(),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.deleteEntry(1, 1);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Entry deleted successfully');
    });

    it('should return error if entry not found', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.deleteEntry(999, 1);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Entry not found');
    });

    it('should return error if user does not own entry', async () => {
      const mockEntry = {
        id: 1,
        user_id: 2, // Different user
        content: 'content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.deleteEntry(1, 1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Unauthorized');
    });
  });

  describe('getEntryById', () => {
    it('should return entry if found', async () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'content',
        mood_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockEntry),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.getEntryById(1);

      expect(result.success).toBe(true);
      expect(result.entry).toEqual(mockEntry);
    });

    it('should return error if entry not found', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.getEntryById(999);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Entry not found');
    });

    it('should return error for missing entry id', async () => {
      const { default: entryService } = await import(
        '../../../src/backend/services/entryService.js'
      );

      const result = entryService.getEntryById(null);

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });
  });
});
