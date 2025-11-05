import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { TranslationReport } from '../models/TranslationReport';
import { Dictionary } from '../models/Dictionary';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(auth);

// Report incorrect translation
router.post(
  '/report',
  [
    body('english').notEmpty().trim().withMessage('מילה באנגלית נדרשת'),
    body('currentHebrew').notEmpty().trim().withMessage('התרגום הנוכחי נדרש'),
    body('suggestedHebrew').notEmpty().trim().withMessage('התרגום המוצע נדרש'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { english, currentHebrew, suggestedHebrew, reason } = req.body;

      // Check if this word exists in dictionary
      const dictionaryWord = await Dictionary.findOne({
        english: english.toLowerCase()
      });

      if (!dictionaryWord) {
        return res.status(404).json({ message: 'המילה לא נמצאה במאגר' });
      }

      // Check if user already reported this word
      const existingReport = await TranslationReport.findOne({
        userId: req.userId,
        english: english.toLowerCase(),
        status: 'pending'
      });

      if (existingReport) {
        return res.status(400).json({ message: 'כבר דיווחת על מילה זו' });
      }

      const report = new TranslationReport({
        userId: req.userId,
        english: english.toLowerCase(),
        currentHebrew,
        suggestedHebrew,
        reason
      });

      await report.save();

      res.status(201).json({
        message: 'תודה על הדיווח! נבדוק אותו בקרוב',
        report
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({ message: 'שגיאה בשליחת הדיווח' });
    }
  }
);

// Get user's reports
router.get('/reports', async (req: AuthRequest, res: Response) => {
  try {
    const reports = await TranslationReport.find({ userId: req.userId })
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'שגיאה בטעינת הדיווחים' });
  }
});

// Get random words from global dictionary for practice
router.get('/practice/:count', async (req: AuthRequest, res: Response) => {
  try {
    const count = Math.min(parseInt(req.params.count) || 10, 50); // Max 50 words
    
    const words = await Dictionary.aggregate([
      { $sample: { size: count } },
      {
        $project: {
          english: 1,
          hebrew: 1,
          category: 1,
          isProgramming: 1
        }
      }
    ]);

    res.json(words);
  } catch (error) {
    console.error('Error fetching practice words:', error);
    res.status(500).json({ message: 'שגיאה בטעינת מילים לתרגול' });
  }
});

// Get words by category for practice
router.get('/practice/category/:category', async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.params;
    const count = Math.min(parseInt(req.query.count as string) || 10, 50);
    
    const words = await Dictionary.aggregate([
      { $match: { category } },
      { $sample: { size: count } },
      {
        $project: {
          english: 1,
          hebrew: 1,
          category: 1,
          isProgramming: 1
        }
      }
    ]);

    res.json(words);
  } catch (error) {
    console.error('Error fetching category words:', error);
    res.status(500).json({ message: 'שגיאה בטעינת מילים' });
  }
});

// Get all available categories
router.get('/categories', async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Dictionary.distinct('category');
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Dictionary.countDocuments({ category });
        return { category, count };
      })
    );
    
    res.json(categoriesWithCount);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'שגיאה בטעינת קטגוריות' });
  }
});

export default router;
