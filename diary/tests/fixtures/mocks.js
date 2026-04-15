// Mock utilities for database and other modules

export const createMockDatabase = () => {
  return {
    prepare: jest.fn(() => ({
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    })),
    exec: jest.fn(),
    close: jest.fn(),
  };
};

export const createMockStatement = () => {
  return {
    run: jest.fn().mockReturnValue({ lastInsertRowid: 1, changes: 1 }),
    get: jest.fn(),
    all: jest.fn().mockReturnValue([]),
  };
};

// Create a mock database with predefined responses
export const createMockDatabaseWithData = (data = {}) => {
  const mockDb = {
    prepare: jest.fn(),
    exec: jest.fn(),
    close: jest.fn(),
  };

  mockDb.prepare.mockImplementation((sql) => {
    const mockStmt = createMockStatement();

    // Handle different SQL queries
    if (sql.includes('INSERT INTO users')) {
      mockStmt.run.mockReturnValue({ lastInsertRowid: data.userId || 1, changes: 1 });
    } else if (sql.includes('SELECT * FROM users WHERE username')) {
      mockStmt.get.mockReturnValue(data.userByUsername || null);
    } else if (sql.includes('SELECT * FROM users WHERE id')) {
      mockStmt.get.mockReturnValue(data.userById || null);
    } else if (sql.includes('INSERT INTO journal_entries')) {
      mockStmt.run.mockReturnValue({ lastInsertRowid: data.entryId || 1, changes: 1 });
    } else if (sql.includes('SELECT * FROM journal_entries WHERE id')) {
      mockStmt.get.mockReturnValue(data.entryById || null);
    } else if (sql.includes('SELECT * FROM journal_entries WHERE user_id')) {
      mockStmt.all.mockReturnValue(data.entriesByUserId || []);
    } else if (sql.includes('SELECT * FROM journal_entries WHERE mood_id')) {
      mockStmt.all.mockReturnValue(data.entriesByMoodId || []);
    } else if (sql.includes('SELECT * FROM moods')) {
      mockStmt.all.mockReturnValue(data.allMoods || []);
    } else if (sql.includes('SELECT * FROM suggestions WHERE mood_id')) {
      mockStmt.all.mockReturnValue(data.suggestionsByMoodId || []);
    }

    return mockStmt;
  });

  return mockDb;
};

// Mock JWT functionality
export const createMockJwt = () => {
  return {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn().mockReturnValue({ id: 1, username: 'testuser' }),
  };
};

// Mock bcrypt
export const createMockBcrypt = () => {
  return {
    hashSync: jest.fn().mockReturnValue('$2b$10$mockhashedpassword12345'),
    compareSync: jest.fn().mockReturnValue(true),
    hash: jest.fn().mockResolvedValue('$2b$10$mockhashedpassword12345'),
    compare: jest.fn().mockResolvedValue(true),
  };
};
