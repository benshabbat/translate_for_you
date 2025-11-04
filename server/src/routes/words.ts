import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { Word } from '../models/Word';
import { Dictionary } from '../models/Dictionary';
import { auth, AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = Router();

// All routes require authentication
router.use(auth);

// Get all words for current user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const words = await Word.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ message: 'שגיאה בטעינת המילים' });
  }
});

// Add new word
router.post(
  '/',
  [
    body('english').notEmpty().trim().withMessage('מילה באנגלית נדרשת'),
    body('hebrew').notEmpty().trim().withMessage('תרגום בעברית נדרש')
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { english, hebrew } = req.body;

      // Check if word already exists for this user
      const existingWord = await Word.findOne({
        userId: req.userId,
        english: english.toLowerCase()
      });

      if (existingWord) {
        // Word already exists - increment search count and update last searched
        existingWord.searchCount = (existingWord.searchCount || 0) + 1;
        existingWord.lastSearched = new Date();
        await existingWord.save();
        
        return res.status(200).json({ 
          word: existingWord,
          message: 'המילה כבר קיימת במאגר שלך',
          alreadyExists: true,
          searchCount: existingWord.searchCount
        });
      }

      const word = new Word({
        userId: req.userId,
        english: english.toLowerCase(),
        hebrew,
        searchCount: 1,
        lastSearched: new Date()
      });

      await word.save();
      
      // Add to global dictionary if it doesn't exist
      try {
        const existingInDict = await Dictionary.findOne({
          english: english.toLowerCase()
        });
        
        if (!existingInDict) {
          await Dictionary.create({
            english: english.toLowerCase(),
            hebrew,
            category: 'user-contributed',
            frequency: 0,
            isProgramming: false
          });
          console.log(`✅ Added to global dictionary: ${english.toLowerCase()}`);
        }
      } catch (dictError) {
        // If dictionary insert fails, don't fail the word creation
        console.log('⚠️  Could not add to dictionary:', dictError);
      }
      
      res.status(201).json(word);
    } catch (error) {
      console.error('Error adding word:', error);
      res.status(500).json({ message: 'שגיאה בהוספת המילה' });
    }
  }
);

// Get random words for practice (weighted by search count)
router.get('/practice/:count', async (req: AuthRequest, res: Response) => {
  try {
    const count = parseInt(req.params.count) || 10;
    
    // Convert userId string to ObjectId for MongoDB query
    const userObjectId = new mongoose.Types.ObjectId(req.userId);
    
    // Get words with weighted random selection
    // Words with higher searchCount appear more frequently in practice
    const words = await Word.aggregate([
      { $match: { userId: userObjectId } },
      // Add weight field based on searchCount (minimum 1)
      { 
        $addFields: { 
          weight: { 
            $add: [
              { $ifNull: ['$searchCount', 1] },
              // Also consider words with low accuracy
              { 
                $cond: [
                  { $gt: [{ $add: ['$correctCount', '$incorrectCount'] }, 0] },
                  {
                    $multiply: [
                      2,
                      { 
                        $subtract: [
                          1,
                          { 
                            $divide: [
                              '$correctCount',
                              { $add: ['$correctCount', '$incorrectCount'] }
                            ]
                          }
                        ]
                      }
                    ]
                  },
                  0
                ]
              }
            ]
          }
        }
      },
      // Duplicate documents based on weight for weighted sampling
      { $sample: { size: count * 3 } }, // Sample more to ensure variety
      { $sort: { weight: -1, lastSearched: -1 } },
      { $limit: count }
    ]);

    res.json(words);
  } catch (error) {
    console.error('Error fetching practice words:', error);
    res.status(500).json({ message: 'שגיאה בטעינת מילים לתרגול' });
  }
});

// Update word practice result
router.put('/:id/practice', async (req: AuthRequest, res: Response) => {
  try {
    const { correct } = req.body;
    const word = await Word.findOne({ _id: req.params.id, userId: req.userId });

    if (!word) {
      return res.status(404).json({ message: 'המילה לא נמצאה' });
    }

    word.lastPracticed = new Date();
    if (correct) {
      word.correctCount += 1;
    } else {
      word.incorrectCount += 1;
    }

    await word.save();
    res.json(word);
  } catch (error) {
    console.error('Error updating practice result:', error);
    res.status(500).json({ message: 'שגיאה בעדכון תוצאת התרגול' });
  }
});

// Delete word
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const word = await Word.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!word) {
      return res.status(404).json({ message: 'המילה לא נמצאה' });
    }

    res.json({ message: 'המילה נמחקה בהצלחה' });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ message: 'שגיאה במחיקת המילה' });
  }
});

// Update word
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { english, hebrew } = req.body;
    const word = await Word.findOne({ _id: req.params.id, userId: req.userId });

    if (!word) {
      return res.status(404).json({ message: 'המילה לא נמצאה' });
    }

    if (english) word.english = english.toLowerCase();
    if (hebrew) word.hebrew = hebrew;

    await word.save();
    res.json(word);
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).json({ message: 'שגיאה בעדכון המילה' });
  }
});

export default router;
