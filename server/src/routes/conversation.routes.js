import { Router } from 'express';
import {
  getConversations,
  getConversationById,
  updateConversation,
  deleteConversation,
} from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', protectRoute, getConversations);
router.get('/:id', protectRoute, getConversationById);
router.patch('/:id', protectRoute, updateConversation);
router.delete('/:id', protectRoute, deleteConversation);

export default router;
