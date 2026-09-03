import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} from '../controllers/task.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getTasks);
router.get('/stats', protectRoute, getTaskStats);
router.post('/', protectRoute, createTask);
router.patch('/:id', protectRoute, updateTask);
router.delete('/:id', protectRoute, deleteTask);

export default router;
