@echo off
echo ========================================
echo   תרגום למען הלמידה - Translate For You
echo ========================================
echo.

echo בודק אם MongoDB פועל...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB פועל
) else (
    echo [!] MongoDB לא פועל - נדרש MongoDB להפעלת האפליקציה
    echo     הפעל MongoDB ידנית או השתמש ב-MongoDB Atlas
    echo.
    pause
)

echo.
echo מפעיל את השרת...
start "Backend Server" cmd /k "cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak >nul

echo מפעיל את הקליינט...
start "React Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================
echo הפרויקט מופעל!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo ========================================
echo.
pause
