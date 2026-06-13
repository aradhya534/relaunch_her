"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatus = exports.getJobApplicants = exports.applyToJob = void 0;
const client_1 = __importDefault(require("../prisma/client"));
const client_2 = require("@prisma/client");
const applyToJob = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'RETURNER') {
            return res.status(403).json({ error: 'Only Returners can apply for jobs.' });
        }
        const userId = req.user.id;
        const { jobId } = req.body;
        if (!jobId) {
            return res.status(400).json({ error: 'jobId is required.' });
        }
        // Check if job exists
        const job = await client_1.default.job.findUnique({
            where: { id: jobId },
        });
        if (!job) {
            return res.status(404).json({ error: 'Job not found.' });
        }
        // Check if already applied
        const existingApplication = await client_1.default.application.findUnique({
            where: {
                jobId_userId: {
                    jobId,
                    userId,
                },
            },
        });
        if (existingApplication) {
            return res.status(409).json({ error: 'You have already applied for this job.' });
        }
        // Get user skills to compute match score
        const userProfile = await client_1.default.returnProfile.findUnique({
            where: { userId },
        });
        if (!userProfile) {
            return res.status(400).json({ error: 'Please complete your skills assessment before applying.' });
        }
        const userSkills = userProfile.skills || [];
        // Calculate match score
        let matchScore = 60; // Baseline
        if (job.skills.length > 0 && userSkills.length > 0) {
            const matchingSkills = job.skills.filter((skill) => userSkills.some((us) => us.toLowerCase() === skill.toLowerCase()));
            const ratio = matchingSkills.length / job.skills.length;
            matchScore = 60 + Math.round(ratio * 38);
        }
        const application = await client_1.default.application.create({
            data: {
                jobId,
                userId,
                matchScore,
                status: client_2.ApplicationStatus.APPLIED,
            },
        });
        return res.status(201).json({
            message: 'Application submitted successfully.',
            application,
        });
    }
    catch (error) {
        console.error('Apply to job error:', error);
        return res.status(500).json({ error: 'Internal server error while submitting application.' });
    }
};
exports.applyToJob = applyToJob;
const getJobApplicants = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'EMPLOYER') {
            return res.status(403).json({ error: 'Only Employers can view job applicants.' });
        }
        const employerId = req.user.id;
        // Fetch applications for jobs owned by this employer
        const applications = await client_1.default.application.findMany({
            where: {
                job: {
                    employerId,
                },
            },
            include: {
                job: {
                    select: {
                        title: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profile: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        // Format output
        const formattedApplicants = applications.map((app) => ({
            id: app.id,
            jobId: app.jobId,
            jobTitle: app.job.title,
            userId: app.userId,
            applicantName: app.user.name,
            applicantEmail: app.user.email,
            gapYears: app.user.profile?.gapYears || 0,
            gapReason: app.user.profile?.gapReason || 'Family',
            skills: app.user.profile?.skills || [],
            skillsMatchScore: app.matchScore,
            cvUrl: app.user.profile?.cvUrl || null,
            status: app.status,
            appliedAt: app.createdAt,
        }));
        return res.status(200).json(formattedApplicants);
    }
    catch (error) {
        console.error('Get applicants error:', error);
        return res.status(500).json({ error: 'Internal server error while retrieving applicants.' });
    }
};
exports.getJobApplicants = getJobApplicants;
const updateApplicationStatus = async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'EMPLOYER') {
            return res.status(403).json({ error: 'Only Employers can update application status.' });
        }
        const { id } = req.params;
        const { status } = req.body;
        if (!status || !['APPLIED', 'REVIEWING', 'SHORTLISTED'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (APPLIED, REVIEWING, SHORTLISTED).' });
        }
        // Verify ownership
        const application = await client_1.default.application.findUnique({
            where: { id },
            include: {
                job: {
                    select: {
                        employerId: true,
                    },
                },
            },
        });
        if (!application) {
            return res.status(404).json({ error: 'Application not found.' });
        }
        if (application.job.employerId !== req.user.id) {
            return res.status(403).json({ error: 'You do not have permission to update this application.' });
        }
        const updatedApp = await client_1.default.application.update({
            where: { id },
            data: {
                status: status,
            },
        });
        return res.status(200).json({
            message: 'Application status updated.',
            application: updatedApp,
        });
    }
    catch (error) {
        console.error('Update status error:', error);
        return res.status(500).json({ error: 'Internal server error while updating status.' });
    }
};
exports.updateApplicationStatus = updateApplicationStatus;
