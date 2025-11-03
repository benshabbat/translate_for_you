# 🚀 הפעלה מהירה - Quick Start

## אם זה הפעם הראשונה שלך:

### 1. התקן תלויות
```powershell
cd server
npm install

cd ../client
npm install
```

### 2. הגדר את קובץ .env
קובץ `.env` כבר קיים בתיקיית `server`.
**חשוב:** פתח אותו וערוך את `JWT_SECRET` למשהו אקראי!

### 3. ודא ש-MongoDB פועל
- אם מקומי: הפעל את MongoDB
- אם Atlas: עדכן את `MONGODB_URI` בקובץ `.env`

---

## הפעלה

### דרך קלה - סקריפט אוטומטי:
```powershell
.\start.bat
```
או
```powershell
.\start.ps1
```

### דרך ידנית:

**טרמינל 1 - Backend:**
```powershell
cd server
npm run dev
```

**טרמינל 2 - Frontend:**
```powershell
cd client
npm run dev
```

---

## גישה לאפליקציה

- 🌐 **Frontend:** http://localhost:3000
- 🔌 **Backend API:** http://localhost:5000/api
- ❤️ **Health Check:** http://localhost:5000/api/health

---

## מה עכשיו?

1. פתח http://localhost:3000 בדפדפן
2. לחץ "הירשם" ויצור משתמש
3. התחל להוסיף מילים
4. לחץ "התחל תרגול"
5. תהנה! 🎉

---

## עצירה

לחץ **Ctrl+C** בכל אחד מהטרמינלים.

---

## צריך עזרה?

- 📘 [מדריך מלא](GETTING_STARTED.md)
- 📙 [שאלות נפוצות](FAQ.md)
- 📕 [מדריך למורים](TEACHER_GUIDE.md)
- ✅ [Checklist](CHECKLIST.md)

---

**בהצלחה! 🌟**
