"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleModuleCompletion = exports.getCourseById = exports.getCourses = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const getCourses = async (req, res) => {
    try {
        const courses = await client_1.default.course.findMany({
            include: {
                modules: {
                    select: {
                        id: true,
                    },
                },
            },
        });
        return res.status(200).json(courses);
    }
    catch (error) {
        console.error('Get courses error:', error);
        return res.status(500).json({ error: 'Internal server error while fetching courses.' });
    }
};
exports.getCourses = getCourses;
const getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized.' });
        }
        const course = await client_1.default.course.findUnique({
            where: { id },
            include: {
                modules: {
                    orderBy: {
                        order: 'asc',
                    },
                },
            },
        });
        if (!course) {
            return res.status(404).json({ error: 'Course not found.' });
        }
        // Get the user's progress for modules in this course
        const completedProgress = await client_1.default.userProgress.findMany({
            where: {
                userId,
                completed: true,
                moduleId: {
                    in: course.modules.map((m) => m.id),
                },
            },
        });
        const completedModuleIds = new Set(completedProgress.map((p) => p.moduleId));
        const modulesWithProgress = course.modules.map((mod) => ({
            ...mod,
            completed: completedModuleIds.has(mod.id),
        }));
        // Calculate percentage
        const completedCount = completedProgress.length;
        const totalCount = course.modules.length;
        const percentComplete = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
        return res.status(200).json({
            ...course,
            modules: modulesWithProgress,
            progressPercentage: percentComplete,
        });
    }
    catch (error) {
        console.error('Get course by id error:', error);
        return res.status(500).json({ error: 'Internal server error while fetching course details.' });
    }
};
exports.getCourseById = getCourseById;
const toggleModuleCompletion = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'RETURNER') {
            return res.status(403).json({ error: 'Only Returners can track module progress.' });
        }
        const userId = req.user.id;
        const { moduleId, completed } = req.body;
        if (!moduleId || typeof completed !== 'boolean') {
            return res.status(400).json({ error: 'moduleId and completed (boolean) are required.' });
        }
        // Check if module exists
        const moduleItem = await client_1.default.module.findUnique({
            where: { id: moduleId },
        });
        if (!moduleItem) {
            return res.status(404).json({ error: 'Module not found.' });
        }
        const userProgress = await client_1.default.userProgress.upsert({
            where: {
                userId_moduleId: {
                    userId,
                    moduleId,
                },
            },
            update: {
                completed,
                completedAt: new Date(),
            },
            create: {
                userId,
                moduleId,
                completed,
                completedAt: new Date(),
            },
        });
        // Compute updated percentage for the course
        const courseModules = await client_1.default.module.findMany({
            where: { courseId: moduleItem.courseId },
            select: { id: true },
        });
        const completedProgress = await client_1.default.userProgress.findMany({
            where: {
                userId,
                completed: true,
                moduleId: {
                    in: courseModules.map((m) => m.id),
                },
            },
        });
        const percentComplete = courseModules.length > 0
            ? Math.round((completedProgress.length / courseModules.length) * 100)
            : 0;
        return res.status(200).json({
            message: 'Module completion updated.',
            progress: userProgress,
            progressPercentage: percentComplete,
        });
    }
    catch (error) {
        console.error('Toggle module completion error:', error);
        return res.status(500).json({ error: 'Internal server error while toggling progress.' });
    }
};
exports.toggleModuleCompletion = toggleModuleCompletion;
