# 📚 API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
כל ה-endpoints של Words דורשים Authentication. 
הוסף header:
```
Authorization: Bearer <token>
```

---

## 🔐 Auth Endpoints

### 1. הרשמה (Register)
**POST** `/auth/register`

**Body:**
```json
{
  "username": "student1",
  "password": "123456"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "student1"
  }
}
```

### 2. התחברות (Login)
**POST** `/auth/login`

**Body:**
```json
{
  "username": "student1",
  "password": "123456"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "username": "student1"
  }
}
```

---

## 📝 Words Endpoints (דורש Authentication)

### 3. קבלת כל המילים
**GET** `/words`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "english": "hello",
    "hebrew": "שלום",
    "correctCount": 5,
    "incorrectCount": 2,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastPracticed": "2024-01-20T14:20:00.000Z"
  }
]
```

### 4. הוספת מילה חדשה
**POST** `/words`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "english": "world",
  "hebrew": "עולם"
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "userId": "507f1f77bcf86cd799439011",
  "english": "world",
  "hebrew": "עולם",
  "correctCount": 0,
  "incorrectCount": 0,
  "createdAt": "2024-01-21T15:00:00.000Z"
}
```

### 5. עדכון מילה
**PUT** `/words/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "english": "world",
  "hebrew": "תבל"
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "english": "world",
  "hebrew": "תבל",
  "correctCount": 0,
  "incorrectCount": 0
}
```

### 6. מחיקת מילה
**DELETE** `/words/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "המילה נמחקה בהצלחה"
}
```

### 7. קבלת מילים לתרגול
**GET** `/words/practice/:count`

מחזיר מילים אקראיות לתרגול.

**Example:** `/words/practice/10` - מחזיר 10 מילים אקראיות

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "english": "hello",
    "hebrew": "שלום",
    "correctCount": 5,
    "incorrectCount": 2
  }
]
```

### 8. עדכון תוצאת תרגול
**PUT** `/words/:id/practice`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "correct": true
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "english": "hello",
  "hebrew": "שלום",
  "correctCount": 6,
  "incorrectCount": 2,
  "lastPracticed": "2024-01-21T16:00:00.000Z"
}
```

---

## ❌ Error Responses

### 400 - Bad Request
```json
{
  "message": "המילה כבר קיימת במאגר שלך"
}
```

או עם validation errors:
```json
{
  "errors": [
    {
      "msg": "שם משתמש חייב להכיל לפחות 3 תווים",
      "param": "username",
      "location": "body"
    }
  ]
}
```

### 401 - Unauthorized
```json
{
  "message": "אין הרשאה - נדרש טוקן"
}
```

### 404 - Not Found
```json
{
  "message": "המילה לא נמצאה"
}
```

### 500 - Internal Server Error
```json
{
  "message": "שגיאה בשרת"
}
```

---

## 💡 דוגמאות שימוש

### JavaScript (Axios)
```javascript
import axios from 'axios';

// Login
const login = async () => {
  const response = await axios.post('http://localhost:5000/api/auth/login', {
    username: 'student1',
    password: '123456'
  });
  
  const token = response.data.token;
  localStorage.setItem('token', token);
};

// Add word
const addWord = async () => {
  const token = localStorage.getItem('token');
  
  await axios.post(
    'http://localhost:5000/api/words',
    {
      english: 'cat',
      hebrew: 'חתול'
    },
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
};
```

### cURL
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"123456"}'

# Add word (replace TOKEN with actual token)
curl -X POST http://localhost:5000/api/words \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"english":"cat","hebrew":"חתול"}'
```

---

## 🔍 Health Check

**GET** `/health`

בדיקה שהשרת פועל.

**Response (200):**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```
