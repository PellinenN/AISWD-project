import express from 'express';
import moodController from '../controllers/moodController.js';

const router = express.Router();

router.get('/', (req, res) => moodController.getAllMoods(req, res));
router.get('/:id', (req, res) => moodController.getMoodById(req, res));
router.post('/select', (req, res) => moodController.selectMood(req, res));

export default router;
