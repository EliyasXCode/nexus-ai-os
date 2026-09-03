import { Router } from 'express';
import { register, login, logout, getMe, updateSettings } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protectRoute, getMe);
router.patch('/settings', protectRoute, updateSettings);

export default router;
