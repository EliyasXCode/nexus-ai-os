import { Router } from 'express';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  summarizeNote,
} from '../controllers/note.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getNotes);
router.post('/', protectRoute, createNote);
router.patch('/:id', protectRoute, updateNote);
router.delete('/:id', protectRoute, deleteNote);
router.post('/:id/summarize', protectRoute, summarizeNote);

export default router;
