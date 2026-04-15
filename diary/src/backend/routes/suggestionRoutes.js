
import express from 'express';
import suggestionController from '../controllers/suggestionController.js';

const suggestionsRouter = express.Router();

suggestionsRouter.get('/suggestions', suggestionController.getSuggestions);

export default suggestionsRouter;