# EduTrust Health Check Script
# Verifies all services are running and configured correctly

Write-Host ""
Write-Host "🏥 EduTrust Health Check" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

$rootDir = $PSScriptRoot
$allHealthy = $true

# Function to test URL
function Test-Url($url) {
    try {
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Check MongoDB
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
try {
    $mongoService = Get-Service MongoDB -ErrorAction Stop
    if ($mongoService.Status -eq 'Running') {
        Write-Host "  ✅ MongoDB service is running" -ForegroundColor Green
    } else {
        Write-Host "  ❌ MongoDB service is stopped" -ForegroundColor Red
        Write-Host "     Run: net start MongoDB" -ForegroundColor Gray
        $allHealthy = $false
    }
} catch {
    Write-Host "  ⚠️  MongoDB service not found" -ForegroundColor Yellow
    Write-Host "     Please install MongoDB" -ForegroundColor Gray
    $allHealthy = $false
}

Write-Host ""

# Check Backend
Write-Host "Checking Backend API..." -ForegroundColor Yellow
$backendUrl = "http://localhost:8000/health"

if (Test-Url $backendUrl) {
    try {
        $response = Invoke-RestMethod -Uri $backendUrl -Method Get
        if ($response.status -eq "healthy") {
            Write-Host "  ✅ Backend is healthy" -ForegroundColor Green
            Write-Host "     URL: http://localhost:8000" -ForegroundColor Gray
            Write-Host "     API Docs: http://localhost:8000/api/docs" -ForegroundColor Gray
            Write-Host "     Environment: $($response.environment)" -ForegroundColor Gray
        } else {
            Write-Host "  ⚠️  Backend returned unhealthy status" -ForegroundColor Yellow
            $allHealthy = $false
        }
    } catch {
        Write-Host "  ❌ Backend is not responding correctly" -ForegroundColor Red
        $allHealthy = $false
    }
} else {
    Write-Host "  ❌ Backend is not running" -ForegroundColor Red
    Write-Host "     Run: .\start.ps1" -ForegroundColor Gray
    $allHealthy = $false
}

Write-Host ""

# Check Frontend
Write-Host "Checking Frontend..." -ForegroundColor Yellow
$frontendUrl = "http://localhost:5173"

if (Test-Url $frontendUrl) {
    Write-Host "  ✅ Frontend is running" -ForegroundColor Green
    Write-Host "     URL: http://localhost:5173" -ForegroundColor Gray
} else {
    Write-Host "  ❌ Frontend is not running" -ForegroundColor Red
    Write-Host "     Run: .\start.ps1" -ForegroundColor Gray
    $allHealthy = $false
}

Write-Host ""

# Check Backend configuration
Write-Host "Checking Backend configuration..." -ForegroundColor Yellow
$envPath = Join-Path $rootDir "backend\.env"

if (Test-Path $envPath) {
    Write-Host "  ✅ .env file exists" -ForegroundColor Green
    
    # Check critical settings
    $envContent = Get-Content $envPath -Raw
    
    $checks = @{
        "MONGODB_URL" = "MongoDB connection"
        "SECRET_KEY" = "Security key"
        "TESSERACT_CMD" = "Tesseract OCR"
        "POPPLER_PATH" = "PDF processing"
    }
    
    foreach ($key in $checks.Keys) {
        if ($envContent -match "$key=(.+)") {
            $value = $matches[1].Trim()
            if ($value -and $value -ne "your-secret-key-here-change-this") {
                Write-Host "  ✅ $($checks[$key]) configured" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  $($checks[$key]) needs configuration" -ForegroundColor Yellow
                $allHealthy = $false
            }
        } else {
            Write-Host "  ❌ $($checks[$key]) not configured" -ForegroundColor Red
            $allHealthy = $false
        }
    }
} else {
    Write-Host "  ❌ .env file not found" -ForegroundColor Red
    Write-Host "     Run: .\setup-env.ps1" -ForegroundColor Gray
    $allHealthy = $false
}

Write-Host ""

# Check Tesseract installation
Write-Host "Checking Tesseract OCR..." -ForegroundColor Yellow
try {
    $tesseractPath = "C:\Program Files\Tesseract-OCR\tesseract.exe"
    if (Test-Path $tesseractPath) {
        Write-Host "  ✅ Tesseract is installed" -ForegroundColor Green
        Write-Host "     Path: $tesseractPath" -ForegroundColor Gray
    } else {
        Write-Host "  ⚠️  Tesseract not found at default location" -ForegroundColor Yellow
        Write-Host "     Update TESSERACT_CMD in .env" -ForegroundColor Gray
    }
} catch {
    Write-Host "  ⚠️  Could not verify Tesseract installation" -ForegroundColor Yellow
}

Write-Host ""

# Check Poppler
Write-Host "Checking Poppler (PDF processing)..." -ForegroundColor Yellow
$popplerPath = Join-Path $rootDir "backend\poppler\poppler-24.08.0\Library\bin"
if (Test-Path $popplerPath) {
    Write-Host "  ✅ Poppler is available" -ForegroundColor Green
    Write-Host "     Path: $popplerPath" -ForegroundColor Gray
} else {
    Write-Host "  ⚠️  Poppler not found" -ForegroundColor Yellow
    Write-Host "     PDF processing may not work" -ForegroundColor Gray
}

Write-Host ""

# Test API endpoints
if (Test-Url $backendUrl) {
    Write-Host "Testing API endpoints..." -ForegroundColor Yellow
    
    $endpoints = @{
        "/" = "Root"
        "/health" = "Health check"
        "/api/docs" = "API documentation"
    }
    
    foreach ($endpoint in $endpoints.Keys) {
        $url = "http://localhost:8000$endpoint"
        if (Test-Url $url) {
            Write-Host "  ✅ $($endpoints[$endpoint]): $endpoint" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $($endpoints[$endpoint]): $endpoint" -ForegroundColor Red
            $allHealthy = $false
        }
    }
}

Write-Host ""

# Final summary
Write-Host "═══════════════════════════════════" -ForegroundColor Cyan
if ($allHealthy) {
    Write-Host "✅ All systems healthy!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 You're ready to use EduTrust!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access points:" -ForegroundColor Cyan
    Write-Host "  - Frontend:  http://localhost:5173" -ForegroundColor White
    Write-Host "  - Backend:   http://localhost:8000" -ForegroundColor White
    Write-Host "  - API Docs:  http://localhost:8000/api/docs" -ForegroundColor White
} else {
    Write-Host "⚠️  Some issues detected" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please review the issues above and:" -ForegroundColor White
    Write-Host "  1. Fix configuration issues" -ForegroundColor Gray
    Write-Host "  2. Start missing services" -ForegroundColor Gray
    Write-Host "  3. Run this health check again" -ForegroundColor Gray
}
Write-Host "═══════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
