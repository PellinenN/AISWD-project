import db from '../../../src/backend/database/db.js';
import authService from '../../../src/backend/services/authService.js';
import authController from '../../../src/backend/controllers/authController.js';

jest.mock('../../../src/backend/database/db.js');
jest.mock('../../../src/backend/services/authService.js');

describe('AuthController', () => {
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

  describe('login', () => {
    it('should return 200 with token on successful login', () => {
      const mockResult = {
        success: true,
        message: 'Login successful',
        user: { id: 1, username: 'testuser', created_at: new Date() },
        token: 'mock-jwt-token',
      };

      authService.validateLogin.mockReturnValue(mockResult);

      mockReq.body = { username: 'testuser', password: 'password123' };

      authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Login successful',
          token: 'mock-jwt-token',
        })
      );
    });

    it('should return 401 on failed login', () => {
      const mockResult = {
        success: false,
        message: 'Invalid username or password',
        user: null,
        token: null,
      };

      authService.validateLogin.mockReturnValue(mockResult);

      mockReq.body = { username: 'testuser', password: 'wrongpassword' };

      authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid username or password',
        })
      );
    });

    it('should return 500 on service error', () => {
      authService.validateLogin.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.body = { username: 'testuser', password: 'password123' };

      authController.login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Internal server error during login',
        })
      );
    });
  });

  describe('register', () => {
    it('should return 201 with token on successful registration', () => {
      const mockResult = {
        success: true,
        message: 'User registered successfully',
        user: { id: 1, username: 'newuser', created_at: new Date() },
        token: 'mock-jwt-token',
      };

      authService.registerUser.mockReturnValue(mockResult);

      mockReq.body = { username: 'newuser', password: 'password123' };

      authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'User registered successfully',
        })
      );
    });

    it('should return 400 on registration failure', () => {
      const mockResult = {
        success: false,
        message: 'Username already exists',
        user: null,
        token: null,
      };

      authService.registerUser.mockReturnValue(mockResult);

      mockReq.body = { username: 'existinguser', password: 'password123' };

      authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Username already exists',
        })
      );
    });

    it('should return 500 on service error', () => {
      authService.registerUser.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.body = { username: 'newuser', password: 'password123' };

      authController.register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Internal server error during registration',
        })
      );
    });
  });

  describe('checkUsername', () => {
    it('should return 200 with available true when username is free', () => {
      authService.usernameExists.mockReturnValue(false);

      mockReq.params = { username: 'newusername' };

      authController.checkUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          available: true,
          exists: false,
        })
      );
    });

    it('should return 200 with available false when username exists', () => {
      authService.usernameExists.mockReturnValue(true);

      mockReq.params = { username: 'existingusername' };

      authController.checkUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          available: false,
          exists: true,
        })
      );
    });

    it('should return 400 when username is not provided', () => {
      mockReq.params = { username: '' };

      authController.checkUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Username is required',
        })
      );
    });

    it('should return 500 on service error', () => {
      authService.usernameExists.mockImplementation(() => {
        throw new Error('Database error');
      });

      mockReq.params = { username: 'testuser' };

      authController.checkUsername(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Internal server error while checking username',
        })
      );
    });
  });
});
