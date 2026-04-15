import User from '../../../src/backend/models/User.js';
import db from '../../../src/backend/database/db.js';

jest.mock('../../../src/backend/database/db.js');

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user and return a User instance with correct properties', async () => {
      const beforeTime = Date.now();
      
      db.prepare.mockImplementation((sql) => {
        if (sql.includes('INSERT')) {
          return {
            run: jest.fn().mockReturnValue({ lastInsertRowid: 1 }),
          };
        } else {
          return {
            get: jest.fn().mockReturnValue({
              id: 1,
              username: 'testuser',
              passwordHash: '$2b$10$hash',
              created_at: new Date(),
            }),
          };
        }
      });

      // Dynamically import after mocking to ensure mocks are applied
      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      const user = userRepository.createUser('testuser', '$2b$10$hash');
      const afterTime = Date.now();

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(1);
      expect(user.username).toBe('testuser');
      expect(user.passwordHash).toBe('$2b$10$hash');
      // Check that createdAt is around the time of test execution (within 5 seconds)
      expect(user.createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime - 5000);
      expect(user.createdAt.getTime()).toBeLessThanOrEqual(afterTime + 5000);
    });

    it('should call db.prepare with INSERT statement', async () => {
      db.prepare.mockImplementation((sql) => {
        if (sql.includes('INSERT')) {
          return {
            run: jest.fn().mockReturnValue({ lastInsertRowid: 2 }),
          };
        } else {
          return {
            get: jest.fn().mockReturnValue({
              id: 2,
              username: 'newuser',
              passwordHash: '$2b$10$newhash',
              created_at: new Date(),
            }),
          };
        }
      });

      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      userRepository.createUser('newuser', '$2b$10$newhash');

      expect(db.prepare).toHaveBeenCalled();
    });
  });

  describe('getUserByUsername', () => {
    it('should return a User instance for existing username', async () => {
      const mockDate = new Date('2024-01-15');
      const mockStmt = {
        get: jest
          .fn()
          .mockReturnValue({
            id: 1,
            username: 'testuser',
            passwordHash: '$2b$10$hash',
            created_at: mockDate,
          }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      const user = userRepository.getUserByUsername('testuser');

      expect(user).toBeInstanceOf(User);
      expect(user.username).toBe('testuser');
    });

    it('should return null for non-existing username', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      const user = userRepository.getUserByUsername('nonexistent');

      expect(user).toBeNull();
    });
  });

  describe('getUserById', () => {
    it('should return a User instance for existing id', async () => {
      const mockDate = new Date('2024-01-15');
      const mockStmt = {
        get: jest.fn().mockReturnValue({
          id: 5,
          username: 'user5',
          passwordHash: '$2b$10$hash5',
          created_at: mockDate,
        }),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      const user = userRepository.getUserById(5);

      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(5);
      expect(user.username).toBe('user5');
    });

    it('should return null for non-existing id', async () => {
      const mockStmt = {
        get: jest.fn().mockReturnValue(null),
      };

      db.prepare.mockReturnValue(mockStmt);

      const { default: userRepository } = await import(
        '../../../src/backend/repositories/userRepository.js'
      );

      const user = userRepository.getUserById(999);

      expect(user).toBeNull();
    });
  });
});
