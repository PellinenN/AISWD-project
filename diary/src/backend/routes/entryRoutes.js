import express from 'express';
import entryController from '../controllers/entryController.js';

const router = express.Router();

router.get('/', (req, res) => entryController.getEntries(req, res));
router.get('/:id', (req, res) => entryController.getEntryById(req, res));
router.post('/', (req, res) => entryController.createEntry(req, res));
router.put('/:id', (req, res) => entryController.updateEntry(req, res));
router.delete('/:id', (req, res) => entryController.deleteEntry(req, res));

export default router;
