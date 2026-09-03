import { Router } from 'express';
import {
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  clearAllMemory,
} from '../controllers/memory.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getMemories);
router.post('/', protectRoute, createMemory);
router.patch('/:id', protectRoute, updateMemory);
router.delete('/:id', protectRoute, deleteMemory);
router.post('/clear-all', protectRoute, clearAllMemory);

export default router;
