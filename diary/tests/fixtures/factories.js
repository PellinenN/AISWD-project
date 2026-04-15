// Factory functions for creating mock model instances and test data

export const createMockUser = (overrides = {}) => {
  return {
    id: 1,
    username: 'testuser',
    passwordHash: '$2b$10$mockhashedpassword12345',
    createdAt: new Date('2024-01-15'),
    ...overrides,
  };
};

export const createMockEntry = (overrides = {}) => {
  return {
    id: 1,
    userId: 1,
    content: 'This is a test journal entry',
    moodId: 2,
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    ...overrides,
  };
};

export const createMockMood = (overrides = {}) => {
  return {
    id: 1,
    name: 'happy',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
};

export const createMockSuggestion = (overrides = {}) => {
  return {
    id: 1,
    triggerKeyword: 'stress',
    moodId: 3,
    text: 'Try taking a deep breath and relax',
    createdAt: new Date('2024-01-01'),
    ...overrides,
  };
};

// Helper to create multiple objects
export const createMultipleMockUsers = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) => 
    createMockUser({ id: i + 1, username: `testuser${i + 1}`, ...overrides })
  );
};

export const createMultipleMockEntries = (count, overrides = {}) => {
  return Array.from({ length: count }, (_, i) => 
    createMockEntry({ id: i + 1, ...overrides })
  );
};

export const createMultipleMockMoods = (count, overrides = {}) => {
  const moodNames = ['happy', 'sad', 'anxious', 'calm', 'excited', 'depressed', 'peaceful', 'angry'];
  return Array.from({ length: count }, (_, i) => 
    createMockMood({ id: i + 1, name: moodNames[i] || `mood${i + 1}`, ...overrides })
  );
};
