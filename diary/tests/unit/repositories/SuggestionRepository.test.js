import { Suggestion } from '../../../src/backend/models/Suggestion.js';
import db from '../../../src/backend/database/db.js';

jest.mock('../../../src/backend/database/db.js');

describe('SuggestionRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSuggestionsByKeyword', () => {
    it('should return array of Suggestion instances for keyword', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              trigger_keyword: 'stress',
              mood_id: 1,
              text: 'Try deep breathing',
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getSuggestionsByKeyword('stress');

      expect(suggestions).toHaveLength(1);
      expect(suggestions[0]).toBeInstanceOf(Suggestion);
      expect(suggestions[0].trigger_keyword).toBe('stress');
    });

    it('should return empty array when no suggestions match keyword', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getSuggestionsByKeyword('nonexistent');

      expect(suggestions).toEqual([]);
    });
  });

  describe('getSuggestionsByMood', () => {
    it('should return array of Suggestion instances for mood', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              trigger_keyword: 'stress',
              mood_id: 2,
              text: 'Take a walk',
            },
            {
              id: 2,
              trigger_keyword: 'overwhelm',
              mood_id: 2,
              text: 'Prioritize tasks',
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getSuggestionsByMood(2);

      expect(suggestions).toHaveLength(2);
      suggestions.forEach((suggestion) => {
        expect(suggestion).toBeInstanceOf(Suggestion);
        expect(suggestion.mood_id).toBe(2);
      });
    });

    it('should return empty array when mood has no suggestions', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getSuggestionsByMood(999);

      expect(suggestions).toEqual([]);
    });
  });

  describe('getAllSuggestions', () => {
    it('should return array of all Suggestion instances', async () => {
      const mockStmt = {
        all: jest
          .fn()
          .mockReturnValue([
            {
              id: 1,
              trigger_keyword: 'stress',
              mood_id: 1,
              text: 'Relax',
            },
            {
              id: 2,
              trigger_keyword: 'anxiety',
              mood_id: 2,
              text: 'Breathe',
            },
          ]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getAllSuggestions();

      expect(suggestions).toHaveLength(2);
      suggestions.forEach((suggestion) => {
        expect(suggestion).toBeInstanceOf(Suggestion);
      });
    });

    it('should return empty array when no suggestions exist', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      const suggestions = suggestionRepository.getAllSuggestions();

      expect(suggestions).toEqual([]);
    });
  });

  describe('Database interaction', () => {
    it('should call db.prepare for getSuggestionsByKeyword', async () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      suggestionRepository.getSuggestionsByKeyword('test');

      expect(db.prepare).toHaveBeenCalled();
    });

    it('should call prepared statement with correct parameter', async () => {
      const mockAll = jest.fn().mockReturnValue([]);
      const mockStmt = {
        all: mockAll,
      };

      db.prepare.mockReturnValue(mockStmt);

      const { SuggestionRepository } = await import(
        '../../../src/backend/repositories/suggestionRepository.js'
      );
      const suggestionRepository = new SuggestionRepository();

      suggestionRepository.getSuggestionsByKeyword('stress');

      expect(mockAll).toHaveBeenCalledWith('stress');
    });
  });
});
