import dotenv from 'dotenv';
import path from 'path';

// Get the project root directory
const projectRoot = process.cwd();
const envTestPath = path.join(projectRoot, '.env.test');

// Load test environment variables
dotenv.config({ path: envTestPath });

// Set test environment
process.env.NODE_ENV = 'test';
