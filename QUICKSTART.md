# 🚀 EduTrust - Quick Start Guide

This guide will help you set up and run the complete EduTrust application stack.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

### Required Software

- [ ] **Python 3.10+** - [Download](https://www.python.org/downloads/)
- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
- [ ] **MongoDB 6.0+** - [Download](https://www.mongodb.com/try/download/community)
- [ ] **Tesseract OCR 5.x** - [Download](https://github.com/UB-Mannheim/tesseract/wiki)
- [ ] **Git** - [Download](https://git-scm.com/downloads)

### Optional (for Mobile)

- [ ] **Expo CLI** - `npm install -g expo-cli`
- [ ] **Android Studio** (for Android development)
- [ ] **Xcode** (for iOS development, macOS only)

### System Requirements

- **OS**: Windows 10/11, macOS 12+, or Ubuntu 20.04+
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 5GB free space
- **Internet**: Required for initial setup

## 🎯 Quick Setup (5 Minutes)

### Step 1: Clone Repository

```powershell
git clone https://github.com/your-org/edutrust.git
cd edutrust
```

### Step 2: Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Create .env file
Copy-Item .env.example .env
# Edit .env with your settings (see below)
```

**Important .env settings:**
```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=edutrust

# Security
SECRET_KEY=your-secret-key-here-change-this

# OCR
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
POPPLER_PATH=E:\SIH-2025 COSMOS\EduTrust\backend\poppler\poppler-24.08.0\Library\bin

# Performance
PDF_DPI=150
ENABLE_INVISIBLE_WATERMARK=false
VERIFICATION_TIMEOUT=55
```

**Start backend:**
```powershell
uvicorn main:app --reload
```

✅ Backend running at: `http://localhost:8000`

### Step 3: Frontend Setup

Open a **new terminal** window:

```powershell
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### Step 4: MongoDB Setup

**Windows:**
```powershell
# Start MongoDB service
net start MongoDB

# Verify connection
mongosh mongodb://localhost:27017
```

**macOS:**
```bash
# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh mongodb://localhost:27017
```

**Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod

# Verify connection
mongosh mongodb://localhost:27017
```

## 🎮 Using Quick Start Scripts

The root directory contains PowerShell scripts for easy management:

### Start All Services

```powershell
.\start.ps1
```

This will:
- ✅ Start MongoDB service
- ✅ Activate Python virtual environment
- ✅ Start backend server
- ✅ Start frontend development server

### Stop All Services

```powershell
.\stop.ps1
```

This will:
- ⏹️ Stop backend server
- ⏹️ Stop frontend server
- ⏹️ Stop MongoDB service (optional)

### Test Frontend Connection

```powershell
.\test_frontend_connection.ps1
```

Tests API connectivity and endpoints.

## 🔧 Detailed Configuration

### Backend Configuration (.env)

```env
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
SECRET_KEY=02b6dbfb8104cb4b3301869d0dfb35d9ed29cc54694c88b101f1140f8dd20cc5
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# ============================================
# DATABASE - MongoDB
# ============================================
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=edutrust

# ============================================
# CORS (Frontend URLs)
# ============================================
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173

# ============================================
# FILE UPLOAD
# ============================================
MAX_FILE_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=.jpg,.jpeg,.png,.pdf
UPLOAD_DIR=./uploads

# ============================================
# OCR CONFIGURATION
# ============================================
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
OCR_LANGUAGES=eng,hin,tam,tel,ben,mar,guj,kan,mal,pan

# ============================================
# PDF PROCESSING
# ============================================
POPPLER_PATH=E:\SIH-2025 COSMOS\EduTrust\backend\poppler\poppler-24.08.0\Library\bin
PDF_DPI=150  # 150=fast, 200=balanced, 300=quality

# ============================================
# PERFORMANCE OPTIMIZATION (<60s verification)
# ============================================
ENABLE_INVISIBLE_WATERMARK=false  # Saves 5-8 seconds
ENABLE_SIGNATURE_ANALYSIS=true
ENABLE_METADATA_ANALYSIS=true
VERIFICATION_TIMEOUT=55

# ============================================
# LOGGING
# ============================================
LOG_LEVEL=INFO
LOG_FILE=logs/app.log

# ============================================
# AI MODEL CONFIGURATION
# ============================================
MODEL_PATH=./models
CONFIDENCE_THRESHOLD=0.85

# ============================================
# RATE LIMITING
# ============================================
RATE_LIMIT_PER_MINUTE=60
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:

```javascript
// Development
const BASE_URL = 'http://localhost:8000/api/v1'

// Production
// const BASE_URL = 'https://api.edutrust.com/api/v1'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,  // 60 seconds
  headers: {
    'Content-Type': 'application/json'
  }
})
```

## 🧪 Testing the Setup

### 1. Test Backend Health

```powershell
# Using PowerShell
Invoke-RestMethod http://localhost:8000/health

# Using curl
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "healthy",
  "environment": "development",
  "database": "connected"
}
```

### 2. Test Frontend

1. Open browser: `http://localhost:5173`
2. Click "Register" to create account
3. Login with credentials
4. Navigate to "Verify Certificate"
5. Upload a sample certificate

### 3. Test API Endpoints

Visit: `http://localhost:8000/api/docs` for interactive API documentation

### 4. Create Test User

```powershell
# Using PowerShell
$body = @{
    email = "test@example.com"
    username = "testuser"
    full_name = "Test User"
    password = "TestPass123"
    role = "user"
} | ConvertTo-Json

Invoke-RestMethod -Method Post `
    -Uri "http://localhost:8000/api/v1/auth/register" `
    -Body $body `
    -ContentType "application/json"
```

## 📱 Mobile Setup (Optional)

```powershell
cd mobile

# Install dependencies
npm install

# Fix Expo CLI issues (if any)
.\fix-mobile.ps1

# Start Expo
npx expo start
```

Scan QR code with Expo Go app on your phone.

## 🔍 Verification Example

### Using cURL

```bash
# 1. Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "SecurePass123",
    "full_name": "John Doe"
  }'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'

# Save the access_token from response

# 3. Verify certificate
curl -X POST http://localhost:8000/api/v1/verify/analyze-report \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@/path/to/certificate.pdf" \
  -F "certificate_type=degree"
```

### Using Python

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Login
response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user@example.com",
    "password": "SecurePass123"
})
token = response.json()["access_token"]

# Verify certificate
headers = {"Authorization": f"Bearer {token}"}
files = {"file": open("certificate.pdf", "rb")}
data = {"certificate_type": "degree"}

response = requests.post(
    f"{BASE_URL}/verify/analyze-report",
    headers=headers,
    files=files,
    data=data
)

print(response.json())
```

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
```powershell
# Check if MongoDB is running
Get-Service MongoDB

# Start if stopped
net start MongoDB

# Test connection
mongosh mongodb://localhost:27017
```

### Issue: Tesseract Not Found

**Solution:**
```powershell
# Install Tesseract
# Download from: https://github.com/UB-Mannheim/tesseract/wiki

# Update .env
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
```

### Issue: Port Already in Use

**Backend (Port 8000):**
```powershell
# Find process
Get-NetTCPConnection -LocalPort 8000

# Kill process
Stop-Process -Id <PID> -Force
```

**Frontend (Port 5173):**
```powershell
# Kill process on port 5173
Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### Issue: PDF Processing Errors

**Solution:**
```env
# Verify Poppler path in .env
POPPLER_PATH=E:\SIH-2025 COSMOS\EduTrust\backend\poppler\poppler-24.08.0\Library\bin

# Test
python -c "from pdf2image import convert_from_path; print('OK')"
```

### Issue: Slow Verification (>60s)

**Solution:**
```env
# Optimize .env settings
PDF_DPI=150
ENABLE_INVISIBLE_WATERMARK=false
VERIFICATION_TIMEOUT=55
```

### Issue: Frontend API Connection Error

**Solution:**
1. Check backend is running: `http://localhost:8000/health`
2. Check CORS settings in backend `.env`
3. Verify API URL in `frontend/src/services/api.js`

## 📊 Performance Benchmarks

Expected performance on recommended hardware:

| Operation | Time | Notes |
|-----------|------|-------|
| User Registration | < 1s | Includes password hashing |
| User Login | < 500ms | JWT token generation |
| Certificate Upload | 1-3s | Depends on file size |
| OCR Processing | 3-8s | Depends on PDF_DPI |
| AI Anomaly Detection | 5-10s | 6-8 parallel checks |
| Watermark Detection | 2-4s | Visible only |
| Full Verification | 25-35s | All checks enabled |

## 🎯 Next Steps

1. **Explore API Documentation**: Visit `http://localhost:8000/api/docs`
2. **Test Verification**: Upload sample certificates
3. **Check Admin Dashboard**: Login as admin user
4. **Review Logs**: Check `backend/logs/app.log`
5. **Customize Configuration**: Adjust settings in `.env`
6. **Deploy to Production**: See deployment guides in respective README files

## 📚 Additional Resources

- **Main README**: [README.md](README.md)
- **Backend Guide**: [backend/README.md](backend/README.md)
- **Frontend Guide**: [frontend/README.md](frontend/README.md)
- **Mobile Guide**: [mobile/README.md](mobile/README.md)
- **API Documentation**: http://localhost:8000/api/docs
- **Database Models**: [backend/models/](backend/models/)

## 💡 Tips for Development

1. **Use API Docs**: Interactive testing at `/api/docs`
2. **Check Logs**: Monitor `backend/logs/app.log` for errors
3. **Hot Reload**: Both backend and frontend support hot reload
4. **MongoDB Compass**: Use GUI to inspect database
5. **React DevTools**: Install browser extension for debugging

## 🆘 Getting Help

- **Check Logs**: `backend/logs/app.log`
- **API Health**: `http://localhost:8000/health`
- **GitHub Issues**: [Create an issue](https://github.com/your-org/edutrust/issues)
- **Team Contact**: support@edutrust.com

---

**Setup guide maintained by Team COSMOS**

Last updated: November 2025
