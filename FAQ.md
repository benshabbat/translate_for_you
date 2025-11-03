# ❓ שאלות נפוצות (FAQ)

## כללי

### מה זה הפרויקט?
אפליקציה ללימוד אנגלית שמאפשרת לתלמידים ליצור מאגר מילים אישי ולתרגל אותן באמצעות חידונים.

### איזה טכנולוגיות משתמשים?
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express + TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

---

## התקנה והפעלה

### איך מתקינים את הפרויקט?
1. ודא שיש לך Node.js מותקן
2. הורד/שכפל את הפרויקט
3. הרץ `npm install` בתיקיות `server` ו-`client`
4. צור קובץ `.env` בתיקיית `server`
5. הפעל עם `npm run dev` בשני התיקיות

### איך מפעילים MongoDB?
**אפשרות 1 - MongoDB מקומי:**
- התקן MongoDB Community Edition
- הפעל את שירות MongoDB
- השאר את ה-URI בברירת המחדל ב-`.env`

**אפשרות 2 - MongoDB Atlas (בענן):**
1. צור חשבון ב-[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. צור Cluster חינמי
3. קבל את connection string
4. שים אותו ב-`MONGODB_URI` בקובץ `.env`

### איך משנים את הפורטים?
**Backend (ברירת מחדל: 5000):**
- ערוך `PORT=5001` בקובץ `server/.env`

**Frontend (ברירת מחדל: 3000):**
- ערוך את `vite.config.ts` בתיקיית `client`

### איך משתמשים בסקריפט ההפעלה המהיר?
**Windows:**
- לחץ פעמיים על `start.bat` או `start.ps1`
- או הרץ מ-PowerShell: `.\start.ps1`

---

## שימוש באפליקציה

### איך יוצרים משתמש?
1. פתח את האפליקציה
2. לחץ על "הירשם כאן"
3. הזן שם משתמש (לפחות 3 תווים) וסיסמה (לפחות 6 תווים)
4. לחץ "הירשם"

### איך מוסיפים מילים?
1. התחבר לאפליקציה
2. בלוח הבקרה, לחץ "+ הוסף מילה"
3. הזן מילה באנגלית ותרגום בעברית
4. לחץ "הוסף"

### איך מתרגלים?
1. לחץ על "התחל תרגול" בלוח הבקרה
2. האפליקציה תציג מילה באנגלית
3. לחץ "הצג תשובה" לראות את התרגום
4. סמן אם ידעת או לא ידעת את התשובה

### איך מוחקים מילים?
בלוח הבקרה, ליד כל מילה יש כפתור "מחק".

---

## פתרון בעיות

### השרת לא מתחבר ל-MongoDB
**שגיאה:** `MongoDB connection error`

**פתרונות:**
1. ודא ש-MongoDB פועל
2. בדוק את ה-connection string ב-`.env`
3. אם משתמש ב-Atlas, ודא שה-IP שלך מאושר
4. בדוק שאין טעויות כתיב ב-`MONGODB_URI`

### שגיאה "Cannot find module"
**פתרונות:**
1. מחק `node_modules` והרץ `npm install` שוב
2. ודא שאתה בתיקייה הנכונה
3. הרץ `npm install` גם ב-`server` וגם ב-`client`

### הפרונטאנד לא מתחבר לשרת
**שגיאה:** Network Error / CORS errors

**פתרונות:**
1. ודא שהשרת פועל על http://localhost:5000
2. בדוק את ה-proxy ב-`vite.config.ts`
3. נסה לנקות cache: `Ctrl+Shift+R` בדפדפן

### Token expired או Unauthorized
**פתרונות:**
1. התנתק והתחבר שוב
2. נקה localStorage בדפדפן
3. בדוק את `JWT_SECRET` ב-`.env`

### הדף לא נטען / שגיאת 404
**פתרונות:**
1. ודא ש-Vite dev server פועל
2. נווט ל-http://localhost:3000 (לא 5000)
3. נסה לבטל את ה-cache: `Ctrl+F5`

---

## פיתוח

### איך מוסיפים תכונות חדשות?
1. צור route חדש ב-`server/src/routes/`
2. הוסף controller functions
3. צור API calls ב-`client/src/services/api.ts`
4. צור/עדכן components ב-`client/src/components/`

### איך בודקים את ה-API?
השתמש ב:
- **Postman** או **Insomnia**
- **Thunder Client** (VS Code extension)
- **cURL** מהטרמינל
- דוגמאות ב-`API_DOCS.md`

### איך מוסיפים validation?
השתמש ב-`express-validator` בשרת:
```javascript
import { body } from 'express-validator';

router.post('/', [
  body('field').notEmpty().withMessage('Required')
], handler);
```

### איך משנים את עיצוב האפליקציה?
ערוך את הקובץ `client/src/index.css`

---

## Production

### איך מכינים לייצור?
**Backend:**
```powershell
cd server
npm run build
npm start
```

**Frontend:**
```powershell
cd client
npm run build
# הקבצים יהיו ב-dist/
```

### איך מעלים לשרת?
1. העלה את `server/dist/` לשרת Node.js
2. העלה את `client/dist/` לשרת סטטי או CDN
3. הגדר משתני סביבה:
   - `NODE_ENV=production`
   - `MONGODB_URI=<production-db>`
   - `JWT_SECRET=<strong-secret>`

### היכן ניתן לפרוס בחינם?
- **Backend**: Render, Railway, Fly.io
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Database**: MongoDB Atlas (חינם)

---

## אבטחה

### האם הסיסמאות מאובטחות?
כן! הסיסמאות מוצפנות עם bcrypt לפני השמירה.

### מה זה JWT?
JSON Web Token - טוקן מאובטח שמזהה את המשתמש בלי לשמור session בשרת.

### איך לשמור על האפליקציה בטוחה?
1. שנה את `JWT_SECRET` למשהו אקראי
2. לא תשתף את קובץ `.env`
3. השתמש ב-HTTPS בייצור
4. עדכן חבילות npm באופן קבוע

---

## תמיכה נוספת

### איפה הקוד?
כל הקוד זמין בתיקיות:
- `server/src/` - Backend
- `client/src/` - Frontend

### יש תיעוד נוסף?
- `README.md` - מבוא ותכונות
- `GETTING_STARTED.md` - התחלה מהירה
- `API_DOCS.md` - תיעוד API מלא

### איך מקבלים עזרה?
1. בדוק את שגיאות הקונסול
2. קרא את ה-FAQ הזה
3. חפש בגוגל את השגיאה
4. פתח issue בגיטהאב

---

💡 **טיפ:** רוב הבעיות נפתרות ע"י הפעלה מחדש של השרת/קליינט או הרצת `npm install` שוב.
