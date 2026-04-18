
import express from 'express';
import suggestionController from '../controllers/suggestionController.js';

const suggestionsRouter = express.Router();

suggestionsRouter.get('/', suggestionController.getSuggestions);

export default suggestionsRouter;