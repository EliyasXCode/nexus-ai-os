import { Router } from 'express';
import {
  getAgents,
  getAgentRuns,
  analyzeCode,
  studyAssist,
} from '../controllers/agent.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getAgents);
router.get('/runs', protectRoute, getAgentRuns);
router.post('/analyze-code', protectRoute, analyzeCode);
router.post('/study-assist', protectRoute, studyAssist);

export default router;
