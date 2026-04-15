import db from '../../../src/backend/database/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../../../src/backend/database/db.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateLogin', () => {
    it('should return success message and token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: '$2b$10$hash',
        createdAt: new Date(),
      };

      bcrypt.compareSync.mockReturnValue(true);
      jwt.sign.mockReturnValue('mock-jwt-token');

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockUser),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.validateLogin('testuser', 'password123');

      expect(result.success).toBe(true);
      expect(result.user.username).toBe('testuser');
      expect(result.token).toBe('mock-jwt-token');
      expect(result.message).toBe('Login successful');
    });

    it('should return error for missing username', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.validateLogin('', 'password123');

      expect(result.success).toBe(false);
      expect(result.user).toBeNull();
      expect(result.token).toBeNull();
      expect(result.message).toContain('required');
    });

    it('should return error for missing password', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.validateLogin('testuser', '');

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should return error for non-existing user', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.validateLogin('nonexistent', 'password123');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });

    it('should return error for invalid password', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: '$2b$10$hash',
        createdAt: new Date(),
      };

      bcrypt.compareSync.mockReturnValue(false);

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockUser),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.validateLogin('testuser', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Invalid username or password');
    });
  });

  describe('registerUser', () => {
    it('should successfully register a new user', async () => {
      const mockUser = {
        id: 1,
        username: 'newuser',
        passwordHash: '$2b$10$hash',
        createdAt: new Date(),
      };

      bcrypt.hashSync.mockReturnValue('$2b$10$hash');
      jwt.sign.mockReturnValue('mock-jwt-token');

      const mockStmt = {
        get: jest.fn().mockReturnValue(null), // username doesn't exist
        run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.registerUser('newuser', 'password123');

      expect(result.success).toBe(true);
      expect(result.user.username).toBe('newuser');
      expect(result.token).toBe('mock-jwt-token');
      expect(result.message).toBe('User registered successfully');
    });

    it('should return error for missing username or password', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.registerUser('', 'password123');

      expect(result.success).toBe(false);
      expect(result.message).toContain('required');
    });

    it('should return error for username too short', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.registerUser('ab', 'password123');

      expect(result.success).toBe(false);
      expect(result.message).toContain('at least 3 characters');
    });

    it('should return error for password too short', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.registerUser('validuser', 'pass');

      expect(result.success).toBe(false);
      expect(result.message).toContain('at least 6 characters');
    });

    it('should return error if username already exists', async () => {
      const mockExistingUser = {
        id: 1,
        username: 'existinguser',
        passwordHash: '$2b$10$hash',
        createdAt: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockExistingUser), // username exists
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.registerUser('existinguser', 'password123');

      expect(result.success).toBe(false);
      expect(result.message).toBe('Username already exists');
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', async () => {
      jwt.sign.mockReturnValue('valid-jwt-token');

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const token = authService.generateToken(1, 'testuser');

      expect(token).toBe('valid-jwt-token');
      expect(jwt.sign).toHaveBeenCalled();
    });

    it('should include user id and username in token payload', async () => {
      jwt.sign.mockReturnValue('token');

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      authService.generateToken(42, 'testuser');

      expect(jwt.sign).toHaveBeenCalledWith(
        expect.objectContaining({ id: 42, username: 'testuser' }),
        expect.any(String),
        expect.any(Object)
      );
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', async () => {
      const payload = { id: 1, username: 'testuser' };
      jwt.verify.mockReturnValue(payload);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.verifyToken('valid-token');

      expect(result).toEqual(payload);
      expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    });

    it('should throw error for invalid token', async () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const result = authService.verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('usernameExists', () => {
    it('should return true for existing username', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        passwordHash: '$2b$10$hash',
        createdAt: new Date(),
      };

      const mockStmt = {
        get: jest.fn().mockReturnValue(mockUser),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const exists = authService.usernameExists('testuser');

      expect(exists).toBe(true);
    });

    it('should return false for non-existing username', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };
      db.prepare.mockReturnValue(mockStmt);

      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const exists = authService.usernameExists('nonexistent');

      expect(exists).toBe(false);
    });

    it('should return false for empty username', async () => {
      const { default: authService } = await import(
        '../../../src/backend/services/authService.js'
      );

      const exists = authService.usernameExists('');

      expect(exists).toBe(false);
    });
  });
});
