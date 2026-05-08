# EduTrust Complete Setup Script
# Sets up backend and frontend for first-time installation

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  EduTrust - Complete Setup                  ║" -ForegroundColor Cyan
Write-Host "║  Smart India Hackathon 2025 - Team COSMOS   ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$rootDir = $PSScriptRoot

# Function to check if command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) { return $true }
    } catch { return $false }
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$allPrereqsMet = $true

# Check Python
if (Test-Command python) {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✅ Python: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Python not found" -ForegroundColor Red
    $allPrereqsMet = $false
}

# Check Node.js
if (Test-Command node) {
    $nodeVersion = node --version
    Write-Host "  ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "  ❌ Node.js not found" -ForegroundColor Red
    $allPrereqsMet = $false
}

# Check MongoDB
if (Test-Command mongod) {
    Write-Host "  ✅ MongoDB installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  MongoDB not found (optional for initial setup)" -ForegroundColor Yellow
}

# Check Git
if (Test-Command git) {
    Write-Host "  ✅ Git installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Git not found" -ForegroundColor Yellow
}

Write-Host ""

if (-not $allPrereqsMet) {
    Write-Host "❌ Missing required prerequisites. Please install:" -ForegroundColor Red
    Write-Host "  - Python 3.10+ from https://www.python.org/downloads/" -ForegroundColor White
    Write-Host "  - Node.js 18+ from https://nodejs.org/" -ForegroundColor White
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "✅ All prerequisites met!" -ForegroundColor Green
Write-Host ""

# Setup Backend
Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

Set-Location (Join-Path $rootDir "backend")

# Create virtual environment
if (-not (Test-Path ".venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
    Write-Host "  ✅ Virtual environment created" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  Virtual environment already exists" -ForegroundColor Gray
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\.venv\Scripts\Activate.ps1"

# Install Python dependencies
Write-Host "Installing Python dependencies (this may take a few minutes)..." -ForegroundColor Yellow
pip install --upgrade pip | Out-Null
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Python dependencies installed" -ForegroundColor Green
} else {
    Write-Host "  ❌ Failed to install Python dependencies" -ForegroundColor Red
}

# Create necessary directories
$dirs = @("uploads", "logs", "models")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
        Write-Host "  ✅ Created $dir directory" -ForegroundColor Green
    }
}

# Setup .env if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "⚙️  Setting up environment configuration..." -ForegroundColor Yellow
    Set-Location $rootDir
    & ".\setup-env.ps1"
    Set-Location (Join-Path $rootDir "backend")
} else {
    Write-Host "  ℹ️  .env file already exists" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Setup Frontend
Set-Location (Join-Path $rootDir "frontend")

Write-Host "📦 Setting up Frontend..." -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies (this may take a few minutes)..." -ForegroundColor Yellow
    npm install
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Node.js dependencies installed" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Failed to install Node.js dependencies" -ForegroundColor Red
    }
} else {
    Write-Host "  ℹ️  Node modules already installed" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to root directory
Set-Location $rootDir

# Final summary
Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  Setup Complete! 🎉                         ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start MongoDB:" -ForegroundColor White
Write-Host "   net start MongoDB" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the application:" -ForegroundColor White
Write-Host "   .\start.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Access the application:" -ForegroundColor White
Write-Host "   - Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host "   - Backend:  http://localhost:8000" -ForegroundColor Gray
Write-Host "   - API Docs: http://localhost:8000/api/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - Quick Start: QUICKSTART.md" -ForegroundColor Gray
Write-Host "   - API Docs:    API_DOCUMENTATION.md" -ForegroundColor Gray
Write-Host "   - Backend:     backend\README.md" -ForegroundColor Gray
Write-Host "   - Frontend:    frontend\README.md" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
