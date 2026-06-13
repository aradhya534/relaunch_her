import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authMiddleware';

export const roleGuard = (allowedRoles: ('RETURNER' | 'EMPLOYER')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized. User details not found.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }

    next();
  };
};
