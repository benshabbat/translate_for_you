import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const router = Router();

// Register
router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('שם משתמש חייב להכיל לפחות 3 תווים'),
    body('password').isLength({ min: 6 }).withMessage('סיסמה חייבת להכיל לפחות 6 תווים')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'שם המשתמש כבר קיים' });
      }

      // Create new user
      const user = new User({ username, password });
      await user.save();

      // Create token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'שגיאה בהרשמה' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('שם משתמש נדרש'),
    body('password').notEmpty().withMessage('סיסמה נדרשת')
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      // Find user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'שם משתמש או סיסמה שגויים' });
      }

      // Create token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'default_secret',
        { expiresIn: '7d' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'שגיאה בהתחברות' });
    }
  }
);

export default router;
