import { Router } from 'express';
import { applyToJob, getJobApplicants, updateApplicationStatus } from '../controllers/applicationController';
import { authMiddleware } from '../middleware/authMiddleware';
import { roleGuard } from '../middleware/roleGuard';

const router = Router();

// Returner applies for a job
router.post('/', authMiddleware, roleGuard(['RETURNER']), applyToJob);

// Employer reviews applicants and updates status
router.get('/', authMiddleware, roleGuard(['EMPLOYER']), getJobApplicants);
router.patch('/:id', authMiddleware, roleGuard(['EMPLOYER']), updateApplicationStatus);

export default router;
