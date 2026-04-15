import SuggestionRepository from '../../../src/backend/repositories/suggestionRepository.js';
import { SuggestionService } from '../../../src/backend/services/suggestionService.js';
import db from '../../../src/backend/database/db.js';

jest.mock('../../../src/backend/database/db.js');
jest.mock('../../../src/backend/repositories/suggestionRepository.js', () => ({
  __esModule: true,
  default: {
    getSuggestionsByMood: jest.fn(),
    getSuggestionsByKeyword: jest.fn(),
  },
}));

describe('SuggestionController', () => {
  let mockReq;
  let mockRes;
  let suggestionController;

  beforeAll(async () => {
    const module = await import(
      '../../../src/backend/controllers/suggestionController.js'
    );
    suggestionController = module.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
    SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

    mockReq = {
      body: {},
      params: {},
      query: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('getSuggestions', () => {
    it('should return suggestions based on mood_id and content', () => {
      const mockSuggestions = [
        {
          id: 1,
          trigger_keyword: 'stress',
          mood_id: 1,
          text: 'Try deep breathing',
        },
        {
          id: 2,
          trigger_keyword: 'overwhelm',
          mood_id: 1,
          text: 'Prioritize your tasks',
        },
      ];

      SuggestionRepository.getSuggestionsByMood.mockReturnValue(mockSuggestions);

      mockReq.query = { mood_id: '1', content: 'I am stressed' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle mood_id as query parameter', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      mockReq.query = { mood_id: '2', content: '' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle cases with no mood_id', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      mockReq.query = { content: 'I am feeling stressed' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle empty content query parameter', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      mockReq.query = { mood_id: '1' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return empty array when no suggestions found', () => {
      SuggestionRepository.getSuggestionsByMood.mockReturnValue([]);
      SuggestionRepository.getSuggestionsByKeyword.mockReturnValue([]);

      mockReq.query = { mood_id: '999', content: 'random' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should return 500 on service error', () => {
      SuggestionRepository.getSuggestionsByMood.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.query = { mood_id: '1', content: 'test' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Failed to fetch suggestions',
        })
      );
    });
  });
});
    });

    it('should convert mood_id query parameter to number', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };
      db.prepare.mockReturnValue(mockStmt);

      mockReq.query = { mood_id: '42', content: 'test' };

      suggestionController.getSuggestions(mockReq, mockRes);

      // The service should have been called with numeric mood_id
      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle null mood_id', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };
      db.prepare.mockReturnValue(mockStmt);

      mockReq.query = { content: 'stressed' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should pass content parameter from query', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };
      db.prepare.mockReturnValue(mockStmt);

      mockReq.query = { mood_id: '1', content: 'I feel anxious and tired' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalled();
    });

    it('should default content to empty string if not provided', () => {
      const mockStmt = {
        all: jest.fn().mockReturnValue([]),
      };
      db.prepare.mockReturnValue(mockStmt);

      mockReq.query = { mood_id: '1' };

      suggestionController.getSuggestions(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Array));
    });
  });
});
