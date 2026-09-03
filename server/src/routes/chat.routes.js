import { Router } from 'express';
import { sendMessage } from '../controllers/chat.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protectRoute, sendMessage);

export default router;
