# EduTrust Quick Start Script
# Run both backend and frontend servers

Write-Host "🚀 Starting EduTrust Application..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoTest = Test-NetConnection -ComputerName localhost -Port 27017 -WarningAction SilentlyContinue
    if ($mongoTest.TcpTestSucceeded) {
        Write-Host "✅ MongoDB is running on port 27017" -ForegroundColor Green
    } else {
        Write-Host "❌ MongoDB is not running! Please start MongoDB first." -ForegroundColor Red
        Write-Host "   Start MongoDB: net start MongoDB" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Application Details:" -ForegroundColor Cyan
Write-Host "   Backend API: http://127.0.0.1:8000" -ForegroundColor White
Write-Host "   API Docs: http://127.0.0.1:8000/api/docs" -ForegroundColor White
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "👤 Demo Credentials:" -ForegroundColor Cyan
Write-Host "   User: testuser@edutrust.com | TestPass123" -ForegroundColor White
Write-Host "   Admin: admin@edutrust.com | AdminPass123" -ForegroundColor White
Write-Host ""

# Start Backend
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Yellow
$backendPath = "E:\SIH-2025 COSMOS\EduTrust\backend"
$pythonPath = "E:\SIH-2025 COSMOS\EduTrust\.venv\Scripts\python.exe"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🐍 Backend Server Starting...' -ForegroundColor Green; & '$pythonPath' -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "⏳ Waiting for backend to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Start Frontend
Write-Host "🎨 Starting Frontend Development Server..." -ForegroundColor Yellow
$frontendPath = "E:\SIH-2025 COSMOS\EduTrust\frontend"

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '⚛️  Frontend Server Starting...' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "✅ Application is starting..." -ForegroundColor Green
Write-Host ""
Write-Host "Please wait a few seconds for both servers to start." -ForegroundColor Yellow
Write-Host "Frontend will open at: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
