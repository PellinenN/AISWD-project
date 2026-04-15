import db from '../../../src/backend/database/db.js';
import moodService from '../../../src/backend/services/moodService.js';

jest.mock('../../../src/backend/database/db.js');
jest.mock('../../../src/backend/services/moodService.js');

describe('MoodController', () => {
  let mockReq;
  let mockRes;
  let MoodController;
  let moodController;

  beforeAll(async () => {
    const module = await import(
      '../../../src/backend/controllers/moodController.js'
    );
    moodController = module.default;
  });

  beforeEach(() => {
    jest.clearAllMocks();

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

  describe('getAllMoods', () => {
    it('should return all moods successfully', () => {
      const mockResult = {
        success: true,
        moods: [
          { id: 1, name: 'happy' },
          { id: 2, name: 'sad' },
        ],
        count: 2,
      };

      moodService.getAllMoods.mockReturnValue(mockResult);

      moodController.getAllMoods(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          moods: mockResult.moods,
        })
      );
    });

    it('should return 400 on service error', () => {
      const mockResult = {
        success: false,
        message: 'Failed to retrieve moods',
      };

      moodService.getAllMoods.mockReturnValue(mockResult);

      moodController.getAllMoods(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });

    it('should return 500 on exception', () => {
      moodService.getAllMoods.mockImplementation(() => {
        throw new Error('Database error');
      });

      moodController.getAllMoods(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Failed to fetch moods',
        })
      );
    });
  });

  describe('getMoodById', () => {
    it('should return mood if found', () => {
      const mockResult = {
        success: true,
        mood: { id: 2, name: 'sad' },
      };

      moodService.getMoodById.mockReturnValue(mockResult);

      mockReq.params = { id: '2' };

      moodController.getMoodById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          mood: mockResult.mood,
        })
      );
    });

    it('should return 404 if mood not found', () => {
      const mockResult = {
        success: false,
        message: 'Mood not found',
      };

      moodService.getMoodById.mockReturnValue(mockResult);

      mockReq.params = { id: '999' };

      moodController.getMoodById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });

    it('should return 400 for invalid mood ID', () => {
      mockReq.params = { id: 'invalid' };

      moodController.getMoodById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid mood ID',
        })
      );
    });

    it('should convert id param to number', () => {
      moodService.getMoodById.mockReturnValue({
        success: true,
        mood: { id: 5, name: 'test' },
      });

      mockReq.params = { id: '5' };

      moodController.getMoodById(mockReq, mockRes);

      expect(moodService.getMoodById).toHaveBeenCalledWith(5);
    });
  });

  describe('selectMood', () => {
    it('should select mood successfully', () => {
      const mockResult = {
        success: true,
        mood: { id: 2, name: 'sad' },
      };

      moodService.getMoodById.mockReturnValue(mockResult);

      mockReq.body = { user_id: 1, mood_id: 2 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Mood selected successfully',
        })
      );
    });

    it('should return 400 if user_id is missing', () => {
      mockReq.body = { mood_id: 2 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User ID and Mood ID are required',
        })
      );
    });

    it('should return 400 if mood_id is missing', () => {
      mockReq.body = { user_id: 1 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User ID and Mood ID are required',
        })
      );
    });

    it('should return 400 for invalid user_id', () => {
      mockReq.body = { user_id: 'invalid', mood_id: 2 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid User ID or Mood ID',
        })
      );
    });

    it('should return 400 for invalid mood_id', () => {
      mockReq.body = { user_id: 1, mood_id: 'invalid' };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid User ID or Mood ID',
        })
      );
    });

    it('should return 400 if mood does not exist', () => {
      const mockResult = {
        success: false,
        message: 'Mood not found',
      };

      moodService.getMoodById.mockReturnValue(mockResult);

      mockReq.body = { user_id: 1, mood_id: 999 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });

    it('should convert ids to numbers', () => {
      moodService.getMoodById.mockReturnValue({
        success: true,
        mood: { id: 5, name: 'test' },
      });

      mockReq.body = { user_id: '42', mood_id: '5' };

      moodController.selectMood(mockReq, mockRes);

      expect(moodService.getMoodById).toHaveBeenCalledWith(5);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 42,
        })
      );
    });

    it('should return 500 on exception', () => {
      moodService.getMoodById.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.body = { user_id: 1, mood_id: 2 };

      moodController.selectMood(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Failed to select mood',
        })
      );
    });
  });
});
