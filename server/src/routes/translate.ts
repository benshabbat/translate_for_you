import { Router, Request, Response } from 'express';

const router = Router();

// Polyfill for fetch if not available
if (typeof fetch === 'undefined') {
  const nodeFetch = require('node-fetch');
  (global as any).fetch = nodeFetch;
}

// Simple translation dictionary (can be expanded)
const dictionary: { [key: string]: string } = {
  // Common words
  'hello': 'שלום',
  'world': 'עולם',
  'cat': 'חתול',
  'dog': 'כלב',
  'house': 'בית',
  'car': 'מכונית',
  'book': 'ספר',
  'water': 'מים',
  'food': 'אוכל',
  'love': 'אהבה',
  'friend': 'חבר',
  'family': 'משפחה',
  'school': 'בית ספר',
  'teacher': 'מורה',
  'student': 'תלמיד',
  'computer': 'מחשב',
  'phone': 'טלפון',
  'table': 'שולחן',
  'chair': 'כיסא',
  'door': 'דלת',
  'window': 'חלון',
  'sun': 'שמש',
  'moon': 'ירח',
  'star': 'כוכב',
  'tree': 'עץ',
  'flower': 'פרח',
  'bird': 'ציפור',
  'fish': 'דג',
  'good': 'טוב',
  'bad': 'רע',
  'big': 'גדול',
  'small': 'קטן',
  'happy': 'שמח',
  'sad': 'עצוב',
  'beautiful': 'יפה',
  'ugly': 'מכוער',
  'hot': 'חם',
  'cold': 'קר',
  'old': 'זקן',
  'young': 'צעיר',
  'new': 'חדש',
  'easy': 'קל',
  'hard': 'קשה',
  'fast': 'מהיר',
  'slow': 'איטי',
  'strong': 'חזק',
  'weak': 'חלש',
  'yes': 'כן',
  'no': 'לא',
  'please': 'בבקשה',
  'thanks': 'תודה',
  'sorry': 'סליחה',
  'goodbye': 'להתראות',
  'morning': 'בוקר',
  'night': 'לילה',
  'day': 'יום',
  'week': 'שבוע',
  'month': 'חודש',
  'year': 'שנה',
  'time': 'זמן',
  'today': 'היום',
  'tomorrow': 'מחר',
  'yesterday': 'אתמול',
  'one': 'אחד',
  'two': 'שניים',
  'three': 'שלושה',
  'four': 'אַרְבַּעָה',
  'five': 'חמישה',
  'six': 'שישה',
  'seven': 'שבעה',
  'eight': 'שמונה',
  'nine': 'תשעה',
  'ten': 'עשרה',
  'red': 'אדום',
  'blue': 'כחול',
  'green': 'ירוק',
  'yellow': 'צהוב',
  'black': 'שחור',
  'white': 'לבן',
  'orange': 'כתום',
  'purple': 'סגול',
  'pink': 'ורוד',
  'brown': 'חום',
  'man': 'גבר',
  'woman': 'אישה',
  'boy': 'ילד',
  'girl': 'ילדה',
  'baby': 'תינוק',
  'mother': 'אמא',
  'father': 'אבא',
  'brother': 'אח',
  'sister': 'אחות',
  'eat': 'לאכול',
  'drink': 'לשתות',
  'sleep': 'לישון',
  'walk': 'ללכת',
  'run': 'לרוץ',
  'read': 'לקרוא',
  'write': 'לכתוב',
  'speak': 'לדבר',
  'listen': 'להקשיב',
  'see': 'לראות',
  'hear': 'לשמוע',
  'think': 'לחשוב',
  'know': 'לדעת',
  'understand': 'להבין',
  'want': 'לרצות',
  'need': 'להזדקק',
  'like': 'לאהוב',
  'come': 'לבוא',
  'go': 'ללכת',
  'give': 'לתת',
  'take': 'לקחת',
  'make': 'לעשות',
  'have': 'להחזיק',
};

// Translate endpoint
router.post('/translate', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    const lowerText = text.toLowerCase().trim();
    
    // Check local dictionary first
    if (dictionary[lowerText]) {
      return res.json({ translation: dictionary[lowerText], source: 'local' });
    }

    // If not in dictionary, try LibreTranslate API
    try {
      const response = await fetch('https://libretranslate.com/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'en',
          target: 'he',
          format: 'text'
        })
      });

      const data: any = await response.json();
      if (data.translatedText) {
        return res.json({ translation: data.translatedText, source: 'api' });
      }
    } catch (apiError) {
      console.log('External API not available, dictionary only');
    }

    // If no translation found
    return res.status(404).json({ 
      error: 'Translation not found',
      message: 'לא נמצא תרגום עבור מילה זו. אנא הזן את התרגום ידנית.'
    });

  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation service error' });
  }
});

export default router;
