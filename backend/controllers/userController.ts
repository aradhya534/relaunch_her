import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authMiddleware';
import prisma from '../prisma/client';

export const submitAssessment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'RETURNER') {
      return res.status(403).json({ error: 'Only Returners can submit skills assessments.' });
    }

    const userId = req.user.id;
    const { gapYears, gapReason, availability } = req.body;
    let { skills } = req.body;

    // Parse skills (could be sent as a stringified array in form-data)
    if (typeof skills === 'string') {
      try {
        skills = JSON.parse(skills);
      } catch (e) {
        skills = skills.split(',').map((s: string) => s.trim());
      }
    }

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array of strings.' });
    }

    // Get CV file url if uploaded
    const cvUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const gapYearsInt = parseInt(gapYears, 10);
    if (isNaN(gapYearsInt)) {
      return res.status(400).json({ error: 'Gap years must be a valid number.' });
    }

    // Calculate Skill Gap Score for MVP
    // Formula: 35% baseline + 13% per selected skill, capped at 98%
    const calculatedScore = Math.min(35 + (skills.length * 13), 98);

    const updatedProfile = await prisma.returnProfile.upsert({
      where: { userId },
      update: {
        skills,
        gapYears: gapYearsInt,
        gapReason: gapReason || 'Family',
        availability: availability || 'Full-time',
        skillScore: calculatedScore,
        ...(cvUrl ? { cvUrl } : {}),
      },
      create: {
        userId,
        skills,
        gapYears: gapYearsInt,
        gapReason: gapReason || 'Family',
        availability: availability || 'Full-time',
        skillScore: calculatedScore,
        cvUrl: cvUrl || null,
      },
    });

    return res.status(200).json({
      message: 'Assessment submitted successfully.',
      profile: updatedProfile,
    });
  } catch (error: any) {
    console.error('Submit assessment error:', error);
    return res.status(500).json({ error: 'Internal server error while saving assessment.' });
  }
};

export const getProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const requesterRole = req.user.role;
    const requesterId = req.user.id;

    // If request contains userId query parameter and requester is an employer, fetch that user
    const { userId } = req.params;

    if (userId && requesterRole === 'EMPLOYER') {
      const returnerUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profile: true,
        },
      });

      if (!returnerUser || returnerUser.role !== 'RETURNER') {
        return res.status(404).json({ error: 'Returner profile not found.' });
      }

      return res.status(200).json(returnerUser);
    }

    // Otherwise, Returner fetches their own profile
    if (requesterRole === 'RETURNER') {
      const profile = await prisma.returnProfile.findUnique({
        where: { userId: requesterId },
      });

      const user = await prisma.user.findUnique({
        where: { id: requesterId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return res.status(200).json({
        ...user,
        profile,
      });
    }

    return res.status(403).json({ error: 'Access denied.' });
  } catch (error: any) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'Internal server error while retrieving profile.' });
  }
};
