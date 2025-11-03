# סקריפטים מהירים להפעלת הפרויקט

# הפעלת MongoDB מקומי (אם מותקן)
Write-Host "בודק אם MongoDB פועל..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB כבר פועל" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB לא פועל. מנסה להפעיל..." -ForegroundColor Yellow
    try {
        Start-Service MongoDB -ErrorAction Stop
        Write-Host "✅ MongoDB הופעל בהצלחה" -ForegroundColor Green
    } catch {
        Write-Host "❌ לא ניתן להפעיל MongoDB אוטומטית." -ForegroundColor Red
        Write-Host "אנא הפעל את MongoDB ידנית או השתמש ב-MongoDB Atlas" -ForegroundColor Yellow
    }
}

Write-Host "`n🚀 מפעיל את השרת ואת הקליינט..." -ForegroundColor Cyan

# פתיחת טרמינל חדש עבור השרת
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; Write-Host '🔧 מפעיל Backend Server...' -ForegroundColor Green; npm run dev"

# המתנה קצרה
Start-Sleep -Seconds 3

# פתיחת טרמינל חדש עבור הקליינט
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; Write-Host '⚛️  מפעיל React Frontend...' -ForegroundColor Blue; npm run dev"

Write-Host "`n✨ הפרויקט מופעל!" -ForegroundColor Green
Write-Host "📍 Backend: http://localhost:5000" -ForegroundColor Yellow
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "`nלסגירה: סגור את החלונות או לחץ Ctrl+C בכל חלון" -ForegroundColor Gray
