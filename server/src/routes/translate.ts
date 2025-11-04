import { Router, Response } from 'express';
import { Word } from '../models/Word';
import { Dictionary } from '../models/Dictionary';
import { optionalAuth, AuthRequest } from '../middleware/auth';

const router = Router();

if (typeof fetch === 'undefined') {
  const nodeFetch = require('node-fetch');
  (global as any).fetch = nodeFetch;
}

router.post('/translate', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const lowerText = text.toLowerCase().trim();
    
    if (req.userId) {
      try {
        const existingWord = await Word.findOne({ 
          userId: req.userId, 
          english: new RegExp(`^${lowerText}$`, 'i')
        });
        
        if (existingWord && existingWord.hebrew) {
          return res.json({ 
            translation: existingWord.hebrew, 
            source: 'user-collection'
          });
        }
      } catch (dbError) {
        console.log('DB error');
      }
    }
    
    try {
      const dictionaryWord = await Dictionary.findOne({
        english: new RegExp(`^${lowerText}$`, 'i')
      });
      
      if (dictionaryWord) {
        return res.json({ 
          translation: dictionaryWord.hebrew, 
          source: 'dictionary',
          isProgramming: dictionaryWord.isProgramming || false
        });
      }
    } catch (dbError) {
      console.log('Dict error');
    }

    try {
      console.log(`🌐 Attempting free translation API for: "${text}"`);
      
      // Using MyMemory Translation API - Free, no API key required
      // Limit: 1000 words/day
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|he`
      );

      const data: any = await response.json();
      console.log('📥 Translation API response:', data);
      
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        const translation = data.responseData.translatedText;
        console.log(`✅ Translation found: "${translation}"`);
        return res.json({ translation, source: 'api' });
      } else {
        console.log('⚠️  No translation in response:', data);
      }
    } catch (apiError) {
      console.error('❌ API Error:', apiError);
    }

    return res.status(404).json({ 
      error: 'Translation not found',
      message: 'לא נמצא תרגום.'
    });

  } catch (error) {
    res.status(500).json({ error: 'Translation service error' });
  }
});

export default router;
