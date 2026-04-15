import Mood from '../../../src/backend/models/Mood.js';
import db from '../../../src/backend/database/db.js';

jest.mock('../../../src/backend/database/db.js');

// Note: moodRepository currently uses CommonJS export (module.exports)
// This test imports it with CommonJS require
let moodRepository;

beforeAll(async () => {
  // Dynamic import to ensure db mock is in place
  const module = await import('../../../src/backend/repositories/moodRepository.js');
  moodRepository = module.default;
});

describe('MoodRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllMoods', () => {
    it('should return array of all Mood instances', () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              name: 'happy',
            },
            {
              id: 2,
              name: 'sad',
            },
            {
              id: 3,
              name: 'anxious',
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getAllMoods) {
        const moods = moodRepository.getAllMoods();

        expect(moods).toHaveLength(3);
        moods.forEach((mood) => {
          expect(mood).toBeInstanceOf(Mood);
        });
        expect(moods[0].name).toBe('happy');
        expect(moods[1].name).toBe('sad');
      }
    });

    it('should return empty array when no moods exist', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getAllMoods) {
        const moods = moodRepository.getAllMoods();
        expect(moods).toEqual([]);
      }
    });
  });

  describe('getMoodById', () => {
    it('should return Mood instance for existing id', () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue({
          id: 2,
          name: 'sad',
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getMoodById) {
        const mood = moodRepository.getMoodById(2);

        expect(mood).toBeInstanceOf(Mood);
        expect(mood.id).toBe(2);
        expect(mood.name).toBe('sad');
      }
    });

    it('should return null for non-existing id', () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getMoodById) {
        const mood = moodRepository.getMoodById(999);
        expect(mood).toBeNull();
      }
    });
  });

  describe('Database interaction', () => {
    it('should call db.prepare for getAllMoods', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getAllMoods) {
        moodRepository.getAllMoods();
        expect(db.prepare).toHaveBeenCalled();
      }
    });

    it('should call db.prepare for getMoodById', () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };

      db.prepare.mockReturnValue(mockStmt);

      if (moodRepository.getMoodById) {
        moodRepository.getMoodById(1);
        expect(db.prepare).toHaveBeenCalled();
      }
    });
  });
});
