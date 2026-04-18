import express from 'express';
import authRouter from './routes/authRoutes.js';
import entryRouter from './routes/entryRoutes.js';
import moodRouter from './routes/moodRoutes.js';
import suggestionsRouter from './routes/suggestionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware - handles cross-origin requests from frontend (localhost:3000)
// Must be registered FIRST, before other middleware and routes
app.use((req, res, next) => {
  // Allow requests from frontend
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
app.use('/auth', authRouter);
app.use('/entries', entryRouter);
app.use('/moods', moodRouter);
app.use('/suggestions', suggestionsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});