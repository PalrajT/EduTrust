# EduTrust Environment Setup Script
# Creates .env file with all required configuration

Write-Host "🚀 EduTrust Backend Environment Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$envPath = Join-Path $PSScriptRoot "backend\.env"

# Check if .env already exists
if (Test-Path $envPath) {
    $response = Read-Host ".env file already exists. Overwrite? (y/N)"
    if ($response -ne 'y') {
        Write-Host "Setup cancelled." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Configuring environment variables..." -ForegroundColor Green
Write-Host ""

# Generate secret key
function New-SecretKey {
    $bytes = New-Object byte[] 32
    [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    return [System.BitConverter]::ToString($bytes).Replace('-', '').ToLower()
}

# Get user inputs
Write-Host "📝 Database Configuration" -ForegroundColor Yellow
$mongoUrl = Read-Host "MongoDB URL (default: mongodb://localhost:27017)"
if ([string]::IsNullOrWhiteSpace($mongoUrl)) { $mongoUrl = "mongodb://localhost:27017" }

$mongoDb = Read-Host "MongoDB Database Name (default: edutrust)"
if ([string]::IsNullOrWhiteSpace($mongoDb)) { $mongoDb = "edutrust" }

Write-Host ""
Write-Host "🔒 Security Configuration" -ForegroundColor Yellow
$secretKey = New-SecretKey
Write-Host "Generated SECRET_KEY: $secretKey" -ForegroundColor Gray

Write-Host ""
Write-Host "📄 OCR Configuration" -ForegroundColor Yellow
$tesseractPath = Read-Host "Tesseract executable path (default: C:/Program Files/Tesseract-OCR/tesseract.exe)"
if ([string]::IsNullOrWhiteSpace($tesseractPath)) { $tesseractPath = "C:/Program Files/Tesseract-OCR/tesseract.exe" }

Write-Host ""
Write-Host "📑 PDF Processing" -ForegroundColor Yellow
$popplerPath = Join-Path $PSScriptRoot "backend\poppler\poppler-24.08.0\Library\bin"
Write-Host "Using Poppler path: $popplerPath" -ForegroundColor Gray

Write-Host ""
Write-Host "⚡ Performance Settings" -ForegroundColor Yellow
$pdfDpi = Read-Host "PDF DPI (150=fast, 200=balanced, 300=quality) [default: 150]"
if ([string]::IsNullOrWhiteSpace($pdfDpi)) { $pdfDpi = "150" }

$enableInvisibleWatermark = Read-Host "Enable invisible watermark detection (slower)? (y/N)"
$watermarkValue = if ($enableInvisibleWatermark -eq 'y') { "true" } else { "false" }

# Create .env content
$envContent = @"
# ============================================
# EDUTRUST BACKEND CONFIGURATION
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================

# ============================================
# SERVER CONFIGURATION
# ============================================
ENV=development
HOST=0.0.0.0
PORT=8000
RELOAD=True

# ============================================
# SECURITY
# ============================================
SECRET_KEY=$secretKey
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ============================================
# DATABASE - MongoDB
# ============================================
MONGODB_URL=$mongoUrl
MONGODB_DB_NAME=$mongoDb

# ============================================
# DATABASE - PostgreSQL (Optional)
# ============================================
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=edutrust
POSTGRES_USER=postgres
POSTGRES_PASSWORD=yourpassword

# ============================================
# CORS (Frontend URLs)
# ============================================
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# ============================================
# FILE UPLOAD
# ============================================
MAX_FILE_SIZE=10485760  # 10MB in bytes
ALLOWED_EXTENSIONS=.jpg,.jpeg,.png,.pdf
UPLOAD_DIR=./uploads

# ============================================
# OCR CONFIGURATION
# ============================================
TESSERACT_CMD=$tesseractPath
OCR_LANGUAGES=eng,hin,tam,tel,ben,mar,guj,kan,mal,pan

# ============================================
# AI MODEL CONFIGURATION
# ============================================
MODEL_PATH=./models
CONFIDENCE_THRESHOLD=0.85

# ============================================
# REDIS (for Celery/Caching)
# ============================================
REDIS_URL=redis://localhost:6379/0

# ============================================
# EMAIL CONFIGURATION (Optional)
# ============================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@edutrust.com

# ============================================
# CLOUD STORAGE (Optional)
# ============================================
# AWS
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=edutrust-certificates

# Azure
AZURE_STORAGE_CONNECTION_STRING=your-azure-connection-string
AZURE_CONTAINER_NAME=certificates

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_PER_MINUTE=60

# ============================================
# API KEYS (Optional)
# ============================================
GOOGLE_CLOUD_VISION_KEY=your-google-api-key

# ============================================
# PDF PROCESSING
# ============================================
POPPLER_PATH=$popplerPath
PDF_DPI=$pdfDpi  # Lower = faster processing (150), Higher = better quality (200-300)

# ============================================
# PERFORMANCE OPTIMIZATION (for <60s verification)
# ============================================
ENABLE_INVISIBLE_WATERMARK=$watermarkValue  # false saves 5-8 seconds
ENABLE_SIGNATURE_ANALYSIS=true
ENABLE_METADATA_ANALYSIS=true
VERIFICATION_TIMEOUT=55  # Maximum seconds for verification
"@

# Write to file
$envContent | Out-File -FilePath $envPath -Encoding UTF8

Write-Host ""
Write-Host "✅ Environment file created successfully!" -ForegroundColor Green
Write-Host "Location: $envPath" -ForegroundColor Gray
Write-Host ""
Write-Host "📋 Configuration Summary:" -ForegroundColor Cyan
Write-Host "  - MongoDB: $mongoUrl" -ForegroundColor Gray
Write-Host "  - Database: $mongoDb" -ForegroundColor Gray
Write-Host "  - PDF DPI: $pdfDpi" -ForegroundColor Gray
Write-Host "  - Invisible Watermark: $watermarkValue" -ForegroundColor Gray
Write-Host ""
Write-Host "⚠️  Important Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Review and edit $envPath" -ForegroundColor White
Write-Host "  2. Update Tesseract path if needed" -ForegroundColor White
Write-Host "  3. Verify MongoDB is running" -ForegroundColor White
Write-Host "  4. Run: cd backend && uvicorn main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
