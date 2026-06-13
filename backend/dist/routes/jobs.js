"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jobController_1 = require("../controllers/jobController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleGuard_1 = require("../middleware/roleGuard");
const router = (0, express_1.Router)();
// Returner jobs list
router.get('/', authMiddleware_1.authMiddleware, jobController_1.getJobs);
// Employer job management (Enforced via roleGuard)
router.get('/employer', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), jobController_1.getEmployerJobs);
router.get('/employer/stats', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), jobController_1.getEmployerStats);
router.post('/', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), jobController_1.postJob);
router.patch('/:id', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), jobController_1.toggleJobStatus);
exports.default = router;
