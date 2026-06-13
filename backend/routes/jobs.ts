import { Router } from 'express';
import { getJobs, getEmployerJobs, postJob, toggleJobStatus, getEmployerStats } from '../controllers/jobController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

// Returner jobs list
router.get('/', authMiddleware, getJobs);

// Employer job management (Enforced via roleGuard)
router.get('/employer', authMiddleware, roleGuard(['EMPLOYER']), getEmployerJobs);
router.get('/employer/stats', authMiddleware, roleGuard(['EMPLOYER']), getEmployerStats);
router.post('/', authMiddleware, roleGuard(['EMPLOYER']), postJob);
router.patch('/:id', authMiddleware, roleGuard(['EMPLOYER']), toggleJobStatus);

export default router;
