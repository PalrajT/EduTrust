# Quick Start Script for EduTrust Mobile App

Write-Host "🚀 EduTrust Mobile App - Quick Setup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
$currentDir = Get-Location
if ($currentDir.Path -notlike "*\mobile*") {
    Write-Host "⚠️  Please run this script from the mobile directory" -ForegroundColor Yellow
    Write-Host "   cd mobile" -ForegroundColor Yellow
    Write-Host "   .\setup.ps1" -ForegroundColor Yellow
    exit 1
}

# Check Node.js
Write-Host "📦 Checking Node.js installation..." -ForegroundColor Green
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js $nodeVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "📦 Checking npm installation..." -ForegroundColor Green
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm $npmVersion installed" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Green
Write-Host "   This may take a few minutes..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check for Expo CLI
Write-Host ""
Write-Host "🔍 Checking Expo CLI..." -ForegroundColor Green
try {
    $expoVersion = expo --version
    Write-Host "   ✅ Expo CLI installed" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Expo CLI not found globally" -ForegroundColor Yellow
    Write-Host "   Installing Expo CLI globally..." -ForegroundColor Yellow
    npm install -g expo-cli
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Expo CLI installed" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Setup Complete!" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 Next Steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. Start the development server:" -ForegroundColor White
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Run on your device:" -ForegroundColor White
Write-Host "   - iOS:     npm run ios" -ForegroundColor Yellow
Write-Host "   - Android: npm run android" -ForegroundColor Yellow
Write-Host "   - Web:     npm run web" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Or scan the QR code with Expo Go app" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation: See README.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Magenta
