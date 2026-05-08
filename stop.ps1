# Stop EduTrust Application
# Stops all running backend and frontend processes

Write-Host "🛑 Stopping EduTrust Application..." -ForegroundColor Red
Write-Host ""

# Stop Python/Uvicorn processes (Backend)
Write-Host "Stopping Backend Server..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "python" -or $_.ProcessName -eq "uvicorn"} | ForEach-Object {
    Write-Host "   Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force
}

# Stop Node processes (Frontend)
Write-Host "Stopping Frontend Server..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -eq "node"} | ForEach-Object {
    Write-Host "   Stopping process: $($_.ProcessName) (PID: $($_.Id))" -ForegroundColor Gray
    Stop-Process -Id $_.Id -Force
}

Write-Host ""
Write-Host "✅ All processes stopped!" -ForegroundColor Green
Write-Host ""
