import { Router } from 'express';
import { getCourses, getCourseById, toggleModuleCompletion } from '../controllers/courseController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getCourses);
router.get('/:id', authMiddleware, getCourseById);
router.post('/toggle', authMiddleware, toggleModuleCompletion);

export default router;
