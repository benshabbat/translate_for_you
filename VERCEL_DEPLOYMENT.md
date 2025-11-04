# Environment Variables for Vercel

עליך להוסיף את המשתנים הבאים ב-Vercel Dashboard:

## Server Environment Variables
```
MONGODB_URI=mongodb+srv://benshabbat:benshabbat@cluster0.2ajsqio.mongodb.net/
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=production
LIBRETRANSLATE_API_KEY=
```

## Client Environment Variables
```
VITE_API_URL=https://your-vercel-domain.vercel.app/api
```

## הוראות העלאה ל-Vercel:

### דרך 1: Vercel CLI (מומלץ)

1. התקן את Vercel CLI:
```bash
npm install -g vercel
```

2. התחבר ל-Vercel:
```bash
vercel login
```

3. פרוס את הפרויקט:
```bash
vercel
```

4. הוסף משתני סביבה:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

### דרך 2: Vercel Dashboard (קל יותר)

1. לך ל-https://vercel.com
2. לחץ על "Add New" -> "Project"
3. חבר את ה-GitHub repository שלך
4. הוסף את משתני הסביבה ב-Settings -> Environment Variables
5. לחץ Deploy!

## לאחר הפריסה:

1. עדכן את `VITE_API_URL` ב-client לכתובת של ה-backend ב-Vercel
2. הרץ build מחדש של ה-client

## הערות חשובות:

⚠️ **שנה את JWT_SECRET למשהו חזק ואקראי בפרודקשן!**
⚠️ **אל תשכח להוסיף את כל משתני הסביבה ב-Vercel Dashboard**
