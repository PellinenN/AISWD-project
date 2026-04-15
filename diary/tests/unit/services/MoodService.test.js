import db from '../../../src/backend/database/db.js';
import Mood from '../../../src/backend/models/Mood.js';

jest.mock('../../../src/backend/database/db.js');

describe('MoodService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMoods', () => {
    it('should return all moods successfully', async () => {
      const mockMoods = [
        { id: 1, name: 'happy' },
        { id: 2, name: 'sad' },
        { id: 3, name: 'anxious' },
      ];

      const mockStmt = {
        all: jest.fn().mockReturnValue(mockMoods),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getAllMoods();

      expect(result.success).toBe(true);
      expect(result.moods).toHaveLength(3);
      expect(result.count).toBe(3);
      expect(result.message).toBe('Moods retrieved successfully');
    });

    it('should return empty moods array when no moods exist', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getAllMoods();

      expect(result.success).toBe(true);
      expect(result.moods).toEqual([]);
      expect(result.count).toBe(0);
    });

    it('should include id and name in mood objects', async () => {
      const mockMoods = [{ id: 1, name: 'happy' }];

      const mockStmt = {
        all: jest.fn().mockReturnValue(mockMoods),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getAllMoods();

      expect(result.moods[0]).toHaveProperty('id', 1);
      expect(result.moods[0]).toHaveProperty('name', 'happy');
    });
  });

  describe('getMoodById', () => {
    it('should return mood if found', async () => {
      const mockMood = { id: 2, name: 'sad' };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockMood),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getMoodById(2);

      expect(result.success).toBe(true);
      expect(result.mood).toEqual(mockMood);
      expect(result.message).toBe('Mood retrieved successfully');
    });

    it('should return error if mood not found', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getMoodById(999);

      expect(result.success).toBe(false);
      expect(result.mood).toBeNull();
      expect(result.message).toBe('Mood not found');
    });

    it('should return error for missing mood_id', async () => {
      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getMoodById(null);

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should handle error when database query fails', async () => {
      const mockStmt = {
        get: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const result = moodService.getMoodById(1);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to retrieve mood');
    });
  });

  describe('validateMoodId', () => {
    it('should return true for existing mood_id', async () => {
      const mockMood = { id: 1, name: 'happy' };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockMood),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const isValid = moodService.validateMoodId(1);

      expect(isValid).toBe(true);
    });

    it('should return false for non-existing mood_id', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const isValid = moodService.validateMoodId(999);

      expect(isValid).toBe(false);
    });

    it('should return false for null or undefined mood_id', async () => {
      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      expect(moodService.validateMoodId(null)).toBe(false);
      expect(moodService.validateMoodId(undefined)).toBe(false);
    });

    it('should handle database errors gracefully', async () => {
      const mockStmt = {
        get: jest.fn().mockImplementation(() => {
          throw new Error('Database error');
        }),
      };
      db.prepare.mockReturnValue(mockStmt);

      const module = await import(
        '../../../src/backend/services/moodService.js'
      );
      const moodService = module.default;

      const isValid = moodService.validateMoodId(1);

      expect(isValid).toBe(false);
    });
  });
});
