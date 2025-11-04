import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'אין הרשאה - נדרש טוקן' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'טוקן לא תקין' });
  }
};

// Optional auth - if token exists, verify it, otherwise continue without userId
export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { userId: string };
        req.userId = decoded.userId;
      } catch (error) {
        // Token is invalid, but we continue without userId
        console.log('Invalid token provided, continuing without auth');
      }
    }
    
    next();
  } catch (error) {
    // Any error, just continue
    next();
  }
};
