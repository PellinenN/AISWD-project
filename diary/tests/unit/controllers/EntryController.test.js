import db from '../../../src/backend/database/db.js';
import entryService from '../../../src/backend/services/entryService.js';
import entryController from '../../../src/backend/controllers/entryController.js';

jest.mock('../../../src/backend/database/db.js');
jest.mock('../../../src/backend/services/entryService.js');

describe('EntryController', () => {
  let mockReq;
  let mockRes;

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

  describe('getEntries', () => {
    it('should return entries from service', () => {
      const mockEntries = [
        {
          id: 1,
          user_id: 1,
          content: 'Entry 1',
          mood_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];

      const mockResult = {
        success: true,
        entries: mockEntries,
      };

      entryService.getEntries.mockReturnValue(mockResult);

      mockReq.query = { user_id: '1' };

      entryController.getEntries(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          entries: mockEntries,
        })
      );
    });

    it('should return 400 on service error', () => {
      const mockResult = {
        success: false,
        message: 'Invalid parameters',
      };

      entryService.getEntries.mockReturnValue(mockResult);

      entryController.getEntries(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid parameters',
        })
      );
    });

    it('should handle query parameters correctly', () => {
      mockReq.query = { user_id: '1', mood_id: '2', keyword: 'test' };

      entryService.getEntries.mockReturnValue({ success: true, entries: [] });

      entryController.getEntries(mockReq, mockRes);

      expect(entryService.getEntries).toHaveBeenCalledWith(1, 2, 'test');
    });
  });

  describe('getEntryById', () => {
    it('should return entry if found', () => {
      const mockEntry = {
        id: 1,
        user_id: 1,
        content: 'Test entry',
        mood_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const mockResult = {
        success: true,
        entry: mockEntry,
      };

      entryService.getEntryById.mockReturnValue(mockResult);

      mockReq.params = { id: '1' };

      entryController.getEntryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          entry: mockEntry,
        })
      );
    });

    it('should return 404 if entry not found', () => {
      const mockResult = {
        success: false,
        message: 'Entry not found',
      };

      entryService.getEntryById.mockReturnValue(mockResult);

      mockReq.params = { id: '999' };

      entryController.getEntryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Entry not found',
        })
      );
    });

    it('should convert id param to number', () => {
      entryService.getEntryById.mockReturnValue({ success: true, entry: {} });

      mockReq.params = { id: '42' };

      entryController.getEntryById(mockReq, mockRes);

      expect(entryService.getEntryById).toHaveBeenCalledWith(42);
    });

    it('should return 500 on service error', () => {
      entryService.getEntryById.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.params = { id: '1' };

      entryController.getEntryById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Failed to fetch journal entry',
        })
      );
    });
  });

  describe('createEntry', () => {
    it('should create entry and return 201', () => {
      const mockResult = {
        success: true,
        entry: { id: 1, user_id: 1, content: 'New entry', mood_id: 2 },
        message: 'Entry created successfully',
      };

      entryService.createEntry.mockReturnValue(mockResult);

      mockReq.body = { user_id: 1, content: 'New entry', mood_id: 2 };

      entryController.createEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 on validation error', () => {
      const mockResult = {
        success: false,
        message: 'Content cannot be empty',
      };

      entryService.createEntry.mockReturnValue(mockResult);

      mockReq.body = { user_id: 1, content: '', mood_id: 2 };

      entryController.createEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 on service error', () => {
      entryService.createEntry.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.body = { user_id: 1, content: 'entry', mood_id: 2 };

      entryController.createEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Failed to create journal entry',
        })
      );
    });
  });

  describe('updateEntry', () => {
    it('should update entry and return 200', () => {
      const mockResult = {
        success: true,
        entry: { id: 1, user_id: 1, content: 'Updated entry', mood_id: 3 },
        message: 'Entry updated successfully',
      };

      entryService.updateEntry.mockReturnValue(mockResult);

      mockReq.params = { id: '1' };
      mockReq.body = { user_id: 1, content: 'Updated entry', mood_id: 3 };

      entryController.updateEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 on unauthorized update', () => {
      const mockResult = {
        success: false,
        message: 'Unauthorized: You can only update your own entries',
      };

      entryService.updateEntry.mockReturnValue(mockResult);

      mockReq.params = { id: '1' };
      mockReq.body = { user_id: 2, content: 'Trying to update', mood_id: 1 };

      entryController.updateEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should convert id param to number', () => {
      entryService.updateEntry.mockReturnValue({ success: true, entry: {} });

      mockReq.params = { id: '42' };
      mockReq.body = { user_id: 1, content: 'content', mood_id: 1 };

      entryController.updateEntry(mockReq, mockRes);

      expect(entryService.updateEntry).toHaveBeenCalledWith(42, 1, 'content', 1);
    });
  });

  describe('deleteEntry', () => {
    it('should delete entry and return 200', () => {
      const mockResult = {
        success: true,
        message: 'Entry deleted successfully',
      };

      entryService.deleteEntry.mockReturnValue(mockResult);

      mockReq.params = { id: '1' };
      mockReq.body = { user_id: 1 };

      entryController.deleteEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 on unauthorized delete', () => {
      const mockResult = {
        success: false,
        message: 'Unauthorized: You can only delete your own entries',
      };

      entryService.deleteEntry.mockReturnValue(mockResult);

      mockReq.params = { id: '1' };
      mockReq.body = { user_id: 2 };

      entryController.deleteEntry(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it('should convert id param to number', () => {
      entryService.deleteEntry.mockReturnValue({ success: true });

      mockReq.params = { id: '42' };
      mockReq.body = { user_id: 1 };

      entryController.deleteEntry(mockReq, mockRes);

      expect(entryService.deleteEntry).toHaveBeenCalledWith(42, 1);
    });
  });
});
