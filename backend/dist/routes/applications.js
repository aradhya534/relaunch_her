"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const applicationController_1 = require("../controllers/applicationController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const roleGuard_1 = require("../middleware/roleGuard");
const router = (0, express_1.Router)();
// Returner applies for a job
router.post('/', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['RETURNER']), applicationController_1.applyToJob);
// Employer reviews applicants and updates status
router.get('/', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), applicationController_1.getJobApplicants);
router.patch('/:id', authMiddleware_1.authMiddleware, (0, roleGuard_1.roleGuard)(['EMPLOYER']), applicationController_1.updateApplicationStatus);
exports.default = router;
