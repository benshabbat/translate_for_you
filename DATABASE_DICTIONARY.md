# 🎓 מערכת תרגום מתקדמת לתלמידי תכנות

## סקירה
מערכת תרגום אנגלית-עברית המותאמת במיוחד לתלמידי תכנות, עם מאגר מילים נרחב השמור ב-MongoDB.

---

## 🌟 תכונות עיקריות

### 1. 💾 מילון ב-Database (לא לוקאלי!)
- כל המילים שמורות ב-**MongoDB** במודל `Dictionary`
- קל לעדכן, למחוק ולהוסיף מילים ללא שינוי קוד
- שאילתות מהירות עם אינדקסים

### 2. 💻 מיוחד לתכנות
- מאות מילים מתחום התכנות: `variable`, `function`, `class`, `algorithm`, `database` וכו'
- מסומנות עם דגל `isProgramming: true`
- קטגוריות: `programming`, `common`, `greetings`, `family`, `food`, `verbs`, וכו'

### 3. 🌐 500 המילים הנפוצות באנגלית
- המילים הנפוצות ביותר בשפה האנגלית
- מדורגות לפי תדירות שימוש (`frequency`)

### 4. 🎯 מערכת תרגום 3-שכבתית
```
1️⃣ אוצר מילים אישי של המשתמש (User's Personal Collection)
       ↓ אם לא נמצא
2️⃣ מילון גלובלי ב-DB (500+ מילים תכנות + נפוצות)
       ↓ אם לא נמצא
3️⃣ LibreTranslate API (תרגום חינמי)
```

---

## 📊 סכמת Database

### Collection: `dictionaries`
```typescript
{
  english: string;        // המילה באנגלית (unique, lowercase)
  hebrew: string;         // התרגום לעברית
  category: string;       // קטגוריה (programming, common, verbs, etc.)
  frequency: number;      // דירוג תדירות (500-1)
  isProgramming: boolean; // האם זו מילת תכנות?
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection: `words`
```typescript
{
  userId: ObjectId;       // המשתמש שהוסיף
  english: string;        // המילה באנגלית
  hebrew: string;         // התרגום האישי
  correctCount: number;   // כמה פעמים ענה נכון
  incorrectCount: number; // כמה פעמים טעה
  lastPracticed: Date;
}
```

---

## 🔧 API Endpoint

### POST `/api/translate/translate`
**Headers:**
```
Authorization: Bearer <token>  (אופציונלי)
Content-Type: application/json
```

**Body:**
```json
{
  "text": "variable"
}
```

**Response Examples:**

#### מילה מאוצר המשתמש:
```json
{
  "translation": "משתנה",
  "source": "user-collection",
  "category": "personal"
}
```

#### מילה מהמילון:
```json
{
  "translation": "משתנה",
  "source": "dictionary",
  "category": "programming",
  "isProgramming": true
}
```

#### מילה מה-API:
```json
{
  "translation": "משתנה",
  "source": "api",
  "category": "external"
}
```

---

## 🚀 שימוש

### הוספת מילים חדשות למילון
אם אתה רוצה להוסיף מילים נוספות, תוכל:

#### אופציה 1: דרך MongoDB Compass / Shell
```javascript
db.dictionaries.insertOne({
  english: "typescript",
  hebrew: "טייפסקריפט",
  category: "programming",
  frequency: 150,
  isProgramming: true
})
```

#### אופציה 2: עריכת קובץ seed
ערוך את `server/src/scripts/seedDictionary.ts` והוסף למערך `programmingTerms` או `commonWords`.

ואז הרץ:
```bash
npm run seed
```

---

## 📈 יתרונות המערכת

### ✅ גמישות
- קל להוסיף/למחוק מילים ללא שינוי קוד
- ניתן לעדכן תרגומים בזמן אמת

### ✅ ביצועים
- שאילתות DB מהירות עם אינדקסים
- חיסכון בקריאות API (בודק קודם ב-DB)

### ✅ התאמה אישית
- כל משתמש שומר מילים משלו
- המערכת זוכרת את התרגומים האישיים

### ✅ למידה חכמה
- מילים מתחום התכנות סומנו במיוחד
- 500 המילים הנפוצות לבסיס חזק באנגלית

---

## 🎯 דוגמאות לקטגוריות

| קטגוריה | דוגמאות |
|----------|---------|
| `programming` | code, variable, function, class, algorithm |
| `common` | the, be, to, of, and, a, in, that |
| `verbs` | run, walk, eat, sleep, work |
| `adjectives` | good, bad, big, small, happy |
| `food` | bread, milk, cheese, apple, banana |
| `family` | mother, father, brother, sister |

---

## 🔍 חיפוש חכם

המערכת משתמשת ב-**case-insensitive regex** לחיפוש:
```typescript
english: new RegExp(`^${lowerText}$`, 'i')
```

זה אומר:
- `Hello` = `hello` = `HELLO` ✅
- רווחים נמחקים אוטומטית
- תואם בדיוק את המילה (לא חלק ממילה)

---

## 📝 לסיכום

המערכת החדשה מספקת:
1. 💾 **מילון ב-DB** - לא לוקאלי, גמיש ומהיר
2. 💻 **מיוחד לתכנות** - מאות מילים רלוונטיות
3. 🌐 **500 מילים נפוצות** - בסיס חזק באנגלית
4. 🎯 **3 שכבות תרגום** - חכם וחוסך API calls
5. ⚡ **ביצועים מעולים** - עם אינדקסים וקאשינג

**הכל מוכן לשימוש!** 🎉

---

**תאריך:** נובמבר 2025  
**גרסה:** 3.0  
**סטטוס:** ✅ פועל עם MongoDB Atlas
