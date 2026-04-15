import express from 'express';
import authRouter from './routes/authRoutes.js';
import entryRouter from './routes/entryRoutes.js';
import suggestionsRouter from './routes/suggestionRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/', authRouter);
app.use('/entries', entryRouter);
app.use('/', suggestionsRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});