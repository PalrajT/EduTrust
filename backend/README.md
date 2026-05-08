# 🔧 EduTrust Backend API

FastAPI-based REST API for AI-powered certificate verification.

## 📁 Project Structure

```
backend/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── .env                   # Environment configuration
├── models/                # Database models documentation
├── logs/                  # Application logs
├── uploads/               # Uploaded certificates
├── poppler/              # PDF processing library
└── src/
    ├── api/              # API endpoints
    │   └── v1/
    │       ├── router.py
    │       └── endpoints/
    │           ├── auth.py          # Authentication
    │           ├── certificates.py  # Certificate management
    │           ├── verify.py        # Verification logic
    │           ├── dashboard.py     # Analytics
    │           └── blockchain.py    # Blockchain operations
    ├── core/             # Core functionality
    │   ├── config.py     # Configuration
    │   ├── database.py   # MongoDB connection
    │   ├── security.py   # JWT & password hashing
    │   └── logging.py    # Logging setup
    ├── schemas/          # Pydantic models
    │   ├── user.py
    │   ├── certificate.py
    │   └── dashboard.py
    └── services/         # Business logic
        ├── ai_service.py              # AI anomaly detection
        ├── ocr_service.py             # Tesseract OCR (legacy)
        ├── ocr_analysis_service.py    # Enhanced OCR with analysis
        ├── verification_service.py    # Legacy AI verification
        ├── watermark_service.py       # Watermark detection
        └── blockchain_service.py      # Blockchain integration
```

## 🚀 Getting Started

### Prerequisites

1. **Python 3.10+**
2. **MongoDB 6.0+** - Running on localhost:27017
3. **Tesseract OCR 5.x** - [Download](https://github.com/UB-Mannheim/tesseract/wiki)
4. **Poppler** - For PDF processing (included in `poppler/` directory)

### Installation

1. **Create virtual environment**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. **Install dependencies**
```powershell
pip install -r requirements.txt
```

3. **Configure environment**
```powershell
# Copy example and edit
cp .env.example .env
```

Key settings in `.env`:
```env
# Server
HOST=0.0.0.0
PORT=8000

# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=edutrust

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OCR
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
OCR_LANGUAGES=eng,hin,tam,tel,ben,mar,guj,kan,mal,pan

# PDF Processing
POPPLER_PATH=E:\SIH-2025 COSMOS\EduTrust\backend\poppler\poppler-24.08.0\Library\bin
PDF_DPI=150

# Performance (<60s verification guarantee)
ENABLE_INVISIBLE_WATERMARK=false  # Saves 5-8 seconds
ENABLE_SIGNATURE_ANALYSIS=true
ENABLE_METADATA_ANALYSIS=true
VERIFICATION_TIMEOUT=55
```

4. **Run the server**
```powershell
uvicorn main:app --reload
```

Server starts at: `http://localhost:8000`
API Docs: `http://localhost:8000/api/docs`
ReDoc: `http://localhost:8000/api/redoc`

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login and get JWT token | No |
| POST | `/refresh` | Refresh access token | No |
| GET | `/me` | Get current user info | Yes |
| PUT | `/me` | Update user profile | Yes |

### Certificate Verification (`/api/v1/verify`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/upload` | Upload & verify certificate (basic) | Yes |
| POST | `/analyze-report` | Comprehensive verification report | Yes |
| GET | `/{verification_id}` | Get verification result | Yes |
| GET | `/` | List user verifications | Yes |

### Certificate Management (`/api/v1/certificates`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create certificate record | Yes |
| GET | `/{certificate_id}` | Get certificate details | Yes |
| GET | `/` | List certificates (with filters) | Yes |
| PUT | `/{certificate_id}` | Update certificate | Yes (Admin) |
| DELETE | `/{certificate_id}` | Delete certificate | Yes (Admin) |

### Blockchain (`/api/v1/blockchain`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Blockchain statistics | Yes |
| POST | `/store` | Store certificate on blockchain | Yes (Admin) |
| POST | `/verify` | Verify against blockchain | Yes |
| POST | `/revoke` | Revoke certificate | Yes (Admin) |
| GET | `/certificate/{cert_number}` | Get blockchain info | Yes |

### Dashboard (`/api/v1/dashboard`)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Overall statistics | Yes |
| GET | `/user-stats` | User-specific stats | Yes |
| GET | `/recent-verifications` | Recent verification list | Yes |
| GET | `/trends` | Verification trends | Yes (Admin) |

## 🔐 Authentication

EduTrust uses JWT (JSON Web Tokens) for authentication.

**Login Flow:**
1. POST `/api/v1/auth/login` with email & password
2. Receive `access_token` and `refresh_token`
3. Include in headers: `Authorization: Bearer <access_token>`

**Example:**
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/v1/auth/login', json={
    'email': 'user@example.com',
    'password': 'SecurePass123'
})
tokens = response.json()

# Use token
headers = {'Authorization': f"Bearer {tokens['access_token']}"}
response = requests.get('http://localhost:8000/api/v1/auth/me', headers=headers)
```

## 🔍 Verification Process

### Basic Verification (`/verify/upload`)

1. **Upload** certificate (JPEG, PNG, PDF)
2. **OCR** extracts text in multiple languages
3. **AI Analysis** runs 6+ anomaly checks
4. **Watermark** detection (visible + optional invisible)
5. **Blockchain** verification (if certificate number exists)
6. **Database** check against known certificates
7. **Blacklist** check
8. Returns **confidence score** and **recommendations**

### Comprehensive Report (`/verify/analyze-report`)

Provides detailed analysis including:
- Image quality metrics (resolution, compression, format)
- OCR analysis (confidence, detected fonts, text regions)
- Extracted fields (student, institution, dates, etc.)
- Multiple anomaly checks with detailed results
- Risk assessment (low/medium/high/critical)
- Actionable recommendations

**Processing Time:** < 60 seconds (typically 25-35s)

## 🤖 AI Services

### 1. OCR Analysis Service
- **Language Detection**: Auto-detect from 10+ languages
- **Text Extraction**: Tesseract 5.x with confidence scoring
- **Data Parsing**: Extract structured data (names, dates, numbers)

### 2. AI Anomaly Detection Service
- **Edge Detection**: Analyzes document borders
- **Logo Detection**: Identifies institutional logos
- **Seal Detection**: Finds circular seals/stamps
- **Signature Detection**: Locates signature regions
- **Font Consistency**: Checks for uniform typography
- **Layout Analysis**: Validates document structure
- **Metadata Analysis**: Examines EXIF data (optional)
- **Signature Analysis**: Digital signature verification (optional)

### 3. Watermark Detection Service
- **Visible Watermark**: OCR-based text watermark detection
- **Invisible Watermark**: Frequency domain analysis (optional, slow)

### 4. Blockchain Service
- **Storage**: Immutable certificate hashing
- **Verification**: Compare against blockchain records
- **Revocation**: Mark certificates as invalid
- **Simulation Mode**: For development without real blockchain

## ⚡ Performance Optimization

The backend is optimized for <60 second verification:

### Parallel Processing
```python
# Step 1-2: Image + OCR in parallel
image_task, ocr_task = await asyncio.gather(
    analyze_image(file_path),
    perform_ocr(file_path)
)

# Step 4-5: AI + Watermark in parallel
ai_task, watermark_task = await asyncio.gather(
    ai_anomaly_detection(file_path),
    watermark_detection(file_path)
)
```

### Configuration Toggles

Speed vs Quality trade-offs in `.env`:

```env
# Fast (20-25s) - Recommended for production
PDF_DPI=150
ENABLE_INVISIBLE_WATERMARK=false

# Balanced (30-40s)
PDF_DPI=200
ENABLE_INVISIBLE_WATERMARK=false

# Highest Quality (40-60s)
PDF_DPI=300
ENABLE_INVISIBLE_WATERMARK=true
ENABLE_SIGNATURE_ANALYSIS=true
ENABLE_METADATA_ANALYSIS=true
```

### Hard Timeout Protection

```python
# Enforces 55-second maximum
result = await asyncio.wait_for(
    verify_certificate(file),
    timeout=settings.VERIFICATION_TIMEOUT
)
```

## 🗃️ Database

### MongoDB Collections

- **users**: User accounts
- **certificates**: Certificate records
- **verifications**: Verification history
- **blacklist**: Fraudulent certificates
- **institutions**: University/college registry
- **audit_log**: System activity tracking

See [models/](models/) for detailed schemas.

### Indexes

Optimized for performance:
```python
# users
users.create_index("email", unique=True)
users.create_index("username", unique=True)

# certificates
certificates.create_index("certificate_id", unique=True)
certificates.create_index([("student_name", "text"), ("institution", "text")])

# verifications
verifications.create_index("verification_id", unique=True)
verifications.create_index("user_id")
verifications.create_index("created_at")
```

## 🧪 Testing

Run tests:
```powershell
pytest
```

Test specific endpoint:
```powershell
pytest tests/test_auth.py -v
```

Test with coverage:
```powershell
pytest --cov=src --cov-report=html
```

## 📊 Logging

Logs are stored in `logs/app.log` with rotation:

```python
from src.core.logging import logger

logger.info("User registered successfully")
logger.warning("High verification processing time")
logger.error("Database connection failed")
```

Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## 🔧 Troubleshooting

### MongoDB Connection Failed
```powershell
# Check MongoDB is running
net start MongoDB

# Test connection
mongosh mongodb://localhost:27017
```

### Tesseract Not Found
```powershell
# Install Tesseract
choco install tesseract

# Update .env
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
```

### PDF Processing Errors
```powershell
# Verify Poppler path in .env
POPPLER_PATH=path/to/poppler/bin

# Test PDF conversion
python -c "from pdf2image import convert_from_path; print('OK')"
```

### Slow Verification
```powershell
# Optimize settings in .env
PDF_DPI=150
ENABLE_INVISIBLE_WATERMARK=false
```

## 🚢 Deployment

### Production Settings

```env
ENV=production
DEBUG=False
RELOAD=False
LOG_LEVEL=INFO
ALLOWED_ORIGINS=https://yourdomain.com
```

### Using Docker

```dockerfile
# Dockerfile included
docker build -t edutrust-backend .
docker run -p 8000:8000 edutrust-backend
```

### Using systemd

```ini
[Unit]
Description=EduTrust API
After=network.target

[Service]
User=www-data
WorkingDirectory=/opt/edutrust/backend
ExecStart=/opt/edutrust/backend/.venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [MongoDB Motor Driver](https://motor.readthedocs.io/)
- [Tesseract OCR](https://github.com/tesseract-ocr/tesseract)
- [OpenCV Python](https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html)

## 👥 Team

**Backend maintained by Palraj T and Aswin Raj**

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
