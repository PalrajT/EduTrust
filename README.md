# 🎓 EduTrust - AI-Powered Certificate Verification System

<div align="center">

**Final Year Project (2024-2025)**  
**Department of Computer Science & Engineering**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.119+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

## 📋 Project Overview

### Abstract

EduTrust is an innovative AI-powered certificate verification platform developed to combat the growing problem of educational certificate fraud in India. The system employs a multi-layered verification approach combining advanced Optical Character Recognition (OCR), Computer Vision-based anomaly detection, watermark analysis, and blockchain technology to authenticate educational certificates across multiple Indian languages. This full-stack application provides a comprehensive solution for educational institutions, employers, and verification agencies to validate the authenticity of academic credentials with high accuracy and speed.

### Problem Statement

Certificate fraud has become a significant challenge in India's education sector, with fake degrees and manipulated marksheets undermining the credibility of genuine academic achievements. Traditional manual verification methods are time-consuming, error-prone, and cannot scale to meet the growing demand. There is a critical need for an automated, intelligent system that can:
- Verify certificates in multiple Indian languages
- Detect sophisticated forgeries and manipulations
- Provide instant verification results
- Maintain tamper-proof records of authentic certificates
- Scale to handle thousands of verifications daily

### Solution Approach

EduTrust addresses these challenges through an integrated technology stack leveraging AI, computer vision, and blockchain to provide comprehensive certificate verification capabilities.

### ✨ Key Features

- 🔍 **Advanced OCR**: Multi-language OCR support (English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi)
- 🤖 **AI-Powered Verification**: 6+ anomaly detection checks using computer vision and machine learning
- 🔐 **Blockchain Integration**: Immutable certificate storage and verification
- 💧 **Watermark Detection**: Visible and invisible watermark analysis
- 🌐 **Multi-Language Support**: UI available in English, Hindi, and Tamil
- 📱 **Cross-Platform**: Web and mobile applications
- ⚡ **High Performance**: <60 second verification with parallel processing
- 📊 **Admin Dashboard**: Comprehensive analytics and monitoring

## 🏗️ Architecture

```
EduTrust/
├── backend/          # FastAPI REST API
├── frontend/         # React web application
├── mobile/          # React Native mobile app
└── models/          # Database models documentation
```

### Technology Stack

**Backend:**
- FastAPI 0.119+ (Python 3.10+)
- MongoDB (Motor async driver)
- Tesseract OCR 5.x
- OpenCV 4.9 + PIL 10.2
- PyTorch 2.2 + TensorFlow 2.15
- Web3.py (Blockchain integration)

**Frontend:**
- React 18.2
- Vite 5.0
- TailwindCSS 3.3
- Axios, i18next, Recharts

**Mobile:**
- React Native (Expo)
- TypeScript
- React Navigation

## 🚀 Quick Start

### Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** with npm
- **MongoDB 6.0+** running on `localhost:27017`
- **Tesseract OCR 5.x** installed
- **Poppler** (for PDF processing)

### Installation

1. **Clone the repository**
```powershell
git clone https://github.com/your-org/edutrust.git
cd edutrust
```

2. **Backend Setup**
```powershell
cd backend

# Create virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Run backend
uvicorn main:app --reload
```

Backend will be available at: `http://localhost:8000`
API Docs: `http://localhost:8000/api/docs`

3. **Frontend Setup**
```powershell
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

4. **Quick Start Scripts (Root Directory)**
```powershell
# Start all services
.\start.ps1

# Stop all services
.\stop.ps1
```

## 📖 Documentation

### Backend Documentation

See [backend/README.md](backend/README.md) for:
- API endpoints
- Configuration options
- Service architecture
- Performance optimization

### Frontend Documentation

See [frontend/README.md](frontend/README.md) for:
- Component structure
- Routing
- State management
- Internationalization

### Mobile Documentation

See [mobile/README.md](mobile/README.md) for:
- Setup instructions
- Build process
- Platform-specific configuration

## 🔧 Configuration

### Backend Environment Variables

Key configuration in `backend/.env`:

```env
# Server
HOST=0.0.0.0
PORT=8000

# Database
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB_NAME=edutrust

# Security
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OCR
TESSERACT_CMD=C:/Program Files/Tesseract-OCR/tesseract.exe
POPPLER_PATH=path/to/poppler/bin

# Performance (for <60s verification)
PDF_DPI=150
ENABLE_INVISIBLE_WATERMARK=false
VERIFICATION_TIMEOUT=55
```

### Frontend Configuration

Edit `frontend/src/services/api.js`:
```javascript
const BASE_URL = 'http://localhost:8000/api/v1'
```

## 📊 Database Schema

The system uses MongoDB with the following collections:

- **users**: User accounts and authentication
- **certificates**: Certificate records
- **verifications**: Verification history and results
- **blacklist**: Flagged certificates
- **institutions**: Educational institution registry
- **audit_log**: System activity tracking

See [backend/models/](backend/models/) for detailed schemas.

## 🔐 API Authentication

EduTrust uses JWT-based authentication:

1. **Register**: `POST /api/v1/auth/register`
2. **Login**: `POST /api/v1/auth/login` (returns access_token)
3. **Use token**: Include in headers: `Authorization: Bearer <token>`

## 📱 Mobile App

The mobile application provides on-the-go certificate verification:

```powershell
cd mobile
npm install
npx expo start
```

See [mobile/README.md](mobile/README.md) for detailed instructions.

## 🧪 Testing

**Backend Tests:**
```powershell
cd backend
pytest
```

**Frontend Tests:**
```powershell
cd frontend
npm run test
```

## 🎯 Use Cases

1. **Students**: Verify authenticity of received certificates
2. **Employers**: Validate candidate credentials during hiring
3. **Universities**: Detect fraudulent certificates
4. **Government**: Monitor certificate fraud trends
5. **Verifiers**: Quick and reliable certificate authentication

## ⚡ Performance

- **Verification Time**: < 60 seconds (typically 25-35s)
- **Accuracy**: 95%+ confidence on authentic certificates
- **Languages**: 10+ Indian languages supported
- **Formats**: JPEG, PNG, PDF supported

### Optimization Features

- Parallel processing (Image + OCR, AI + Watermark)
- Configurable PDF DPI (150 default)
- Optional heavy checks (invisible watermark, metadata)
- Hard timeout protection (55s limit)

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin, User, Institution)
- Blockchain certificate storage
- Audit logging
- Rate limiting

## 📈 Roadmap

- [ ] Integration with university APIs
- [ ] QR code verification
- [ ] Batch certificate processing
- [ ] Advanced analytics dashboard
- [ ] Mobile app v2 (iOS + Android)
- [ ] Real blockchain network integration

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 👥 Project Team

### Student Details
- **Project Guide**: Dr. [Guide Name]
- **Department**: Computer Science & Engineering
- **Institution**: [Your College/University Name]
- **Academic Year**: 2024-2025
- **Semester**: VII/VIII

### Team Members
1. **[Your Name]** - Team Lead & Backend Developer
   - Roll No: [Your Roll Number]
   - Email: [your.email@college.edu]
   - Responsibilities: System architecture, backend development, AI/ML integration

2. **[Team Member 2]** - Frontend Developer
   - Roll No: [Roll Number]
   - Email: [email@college.edu]
   - Responsibilities: React UI development, responsive design, i18n

3. **[Team Member 3]** - Mobile Developer
   - Roll No: [Roll Number]
   - Email: [email@college.edu]
   - Responsibilities: React Native app, mobile UI/UX

4. **[Team Member 4]** - AI/ML Engineer
   - Roll No: [Roll Number]
   - Email: [email@college.edu]
   - Responsibilities: OCR optimization, anomaly detection algorithms

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

We express our sincere gratitude to:

- **Dr. [Guide Name]**, our project guide, for invaluable guidance and support throughout the project
- **[Head of Department Name]**, HOD, Department of CSE, for providing necessary resources and facilities
- **[College/University Name]** for providing the infrastructure and research environment
- The faculty members of the Department of Computer Science & Engineering for their continuous support
- Our families and friends for their encouragement and support
- The open-source community for providing excellent tools and libraries

## 📞 Contact

For academic queries and collaboration:
- **Project Repository**: https://github.com/PalrajT/SIH-2025-COSMOS
- **Email**: [your.email@college.edu]
- **Institution**: [Your College/University Name]
- **Department**: Computer Science & Engineering

## 📚 Project Documentation

Complete project documentation including:
- Project Report (PDF)
- System Design Document
- API Documentation
- User Manual
- Testing Reports
- Presentation Slides

Available in the `docs/` directory.

---

<div align="center">

**Final Year Project (2024-2025)**  
**Department of Computer Science & Engineering**  
**[Your College/University Name]**

*Developed with dedication for combating educational certificate fraud in India*

</div>
