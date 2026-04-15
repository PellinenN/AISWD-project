import dotenv from 'dotenv';
import path from 'path';

// Get the project root directory
const projectRoot = process.cwd();
const envTestPath = path.join(projectRoot, '.env.test');

// Load test environment variables
dotenv.config({ path: envTestPath });

// Set test environment
process.env.NODE_ENV = 'test';

// Mock localStorage for tests
global.localStorage = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock fetch for tests
global.fetch = jest.fn();

// Reset mocks before each test
beforeEach(() => {
  localStorage.setItem.mockClear();
  localStorage.getItem.mockClear();
  localStorage.removeItem.mockClear();
  fetch.mockClear();
});
