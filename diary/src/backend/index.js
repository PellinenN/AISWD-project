import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import './database/migrate.js';
import authRouter from './routes/authRoutes.js';
import entryRouter from './routes/entryRoutes.js';
import moodRouter from './routes/moodRoutes.js';
import suggestionsRouter from './routes/suggestionRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Determine CORS origin - use environment variable or default to localhost:3000 (development)
// In Docker, CORS_ORIGIN should be empty/undefined to allow same-origin requests
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// CORS middleware - handles cross-origin requests
// Must be registered FIRST, before other middleware and routes
app.use((req, res, next) => {
  // Allow requests from frontend
  if (CORS_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    return res.status(204).send();
  }
  
  next();
});

app.use(express.json());

// API routes
app.use('/auth', authRouter);
app.use('/entries', entryRouter);
app.use('/moods', moodRouter);
app.use('/suggestions', suggestionsRouter);

// Serve static files from the React build directory
const buildPath = path.join(__dirname, '../../build');
app.use(express.static(buildPath));

// SPA fallback - serve index.html for all non-API routes to support client-side routing
// Use regex pattern to match any path (Express 5 compatible)
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});