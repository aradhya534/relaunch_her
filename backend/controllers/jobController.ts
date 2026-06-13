import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../prisma/client';
import { WorkType } from '@prisma/client';

export const getJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const { title, skills, company, workType } = req.query;

    // Build query filters
    const whereClause: any = { isActive: true };

    if (title) {
      whereClause.title = { contains: title as string, mode: 'insensitive' };
    }

    if (workType) {
      whereClause.workType = workType as WorkType;
    }

    if (company) {
      whereClause.employer = {
        name: { contains: company as string, mode: 'insensitive' },
      };
    }

    if (skills) {
      const skillsArray = typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim())
        : (skills as string[]);
      
      whereClause.skills = {
        hasSome: skillsArray,
      };
    }

    // Fetch jobs
    const jobs = await prisma.job.findMany({
      where: whereClause,
      include: {
        employer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          where: {
            userId: req.user.id,
          },
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Get returner profile to calculate match score
    const userProfile = await prisma.returnProfile.findUnique({
      where: { userId: req.user.id },
    });

    const userSkills = userProfile?.skills || [];

    // Map jobs and calculate dynamic match score
    const jobsWithMatchScore = jobs.map((job) => {
      let matchScore = 60; // Base baseline score for encouragement

      if (job.skills.length > 0 && userSkills.length > 0) {
        const matchingSkills = job.skills.filter((skill) =>
          userSkills.some((us) => us.toLowerCase() === skill.toLowerCase())
        );
        // Base 60% + remaining 38% scaled by matching skills ratio
        const ratio = matchingSkills.length / job.skills.length;
        matchScore = 60 + Math.round(ratio * 38);
      }

      // Check if user has already applied
      const appliedInfo = job.applications[0] || null;

      return {
        id: job.id,
        employerId: job.employerId,
        companyName: job.employer.name.replace(' Hiring Manager', '').replace(' Careers', '').replace(' Global Recruiter', '').replace(' Recruiting', '').replace(' HR', ''),
        title: job.title,
        description: job.description,
        skills: job.skills,
        workType: job.workType,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        matchScore,
        hasApplied: !!appliedInfo,
        applicationStatus: appliedInfo ? appliedInfo.status : null,
      };
    });

    // Sort by match score descending
    jobsWithMatchScore.sort((a, b) => b.matchScore - a.matchScore);

    return res.status(200).json(jobsWithMatchScore);
  } catch (error) {
    console.error('Get jobs error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching jobs.' });
  }
};

export const getEmployerJobs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only Employers can fetch listed jobs.' });
    }

    const jobs = await prisma.job.findMany({
      where: { employerId: req.user.id },
      include: {
        applications: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      skills: job.skills,
      workType: job.workType,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      isActive: job.isActive,
      applicantCount: job.applications.length,
    }));

    return res.status(200).json(formattedJobs);
  } catch (error) {
    console.error('Get employer jobs error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching employer jobs.' });
  }
};

export const postJob = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only Employers can post jobs.' });
    }

    const { title, description, skills, workType, salaryMin, salaryMax } = req.body;

    if (!title || !description || !skills || !workType || !salaryMin || !salaryMax) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!['REMOTE', 'HYBRID', 'ONSITE'].includes(workType)) {
      return res.status(400).json({ error: 'Work type must be REMOTE, HYBRID, or ONSITE.' });
    }

    let skillsArray = skills;
    if (typeof skills === 'string') {
      try {
        skillsArray = JSON.parse(skills);
      } catch (e) {
        skillsArray = skills.split(',').map((s: string) => s.trim());
      }
    }

    const salaryMinInt = parseInt(salaryMin, 10);
    const salaryMaxInt = parseInt(salaryMax, 10);

    const job = await prisma.job.create({
      data: {
        employerId: req.user.id,
        title,
        description,
        skills: skillsArray,
        workType: workType as WorkType,
        salaryMin: salaryMinInt,
        salaryMax: salaryMaxInt,
        isActive: true,
      },
    });

    return res.status(201).json({
      message: 'Job posted successfully.',
      job,
    });
  } catch (error) {
    console.error('Post job error:', error);
    return res.status(500).json({ error: 'Internal server error while creating job post.' });
  }
};

export const toggleJobStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only Employers can toggle job status.' });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive status is required and must be a boolean.' });
    }

    // Check ownership
    const existingJob = await prisma.job.findUnique({
      where: { id },
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found.' });
    }

    if (existingJob.employerId !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this job listing.' });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: { isActive },
    });

    return res.status(200).json({
      message: `Job listing successfully ${isActive ? 'activated' : 'paused'}.`,
      job: updatedJob,
    });
  } catch (error) {
    console.error('Toggle job status error:', error);
    return res.status(500).json({ error: 'Internal server error while updating job status.' });
  }
};

export const getEmployerStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'EMPLOYER') {
      return res.status(403).json({ error: 'Only Employers can access dashboard stats.' });
    }

    const employerId = req.user.id;

    const activeListings = await prisma.job.count({
      where: {
        employerId,
        isActive: true,
      },
    });

    const jobs = await prisma.job.findMany({
      where: { employerId },
      select: { id: true },
    });

    const jobIds = jobs.map((j) => j.id);

    const totalApplicants = await prisma.application.count({
      where: {
        jobId: { in: jobIds },
      },
    });

    const placementsMade = await prisma.application.count({
      where: {
        jobId: { in: jobIds },
        status: 'SHORTLISTED', // In context of Relaunch Her placement, shortlisted indicates advanced placement status
      },
    });

    return res.status(200).json({
      activeListings,
      totalApplicants,
      placementsMade,
    });
  } catch (error) {
    console.error('Get employer stats error:', error);
    return res.status(500).json({ error: 'Internal server error while fetching stats.' });
  }
};
