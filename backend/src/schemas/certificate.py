from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from enum import Enum


class VerificationStatus(str, Enum):
    """Verification status"""
    PENDING = "pending"
    VERIFIED = "verified"
    FAILED = "failed"
    SUSPICIOUS = "suspicious"


class CertificateType(str, Enum):
    """Certificate types"""
    DEGREE = "degree"
    DIPLOMA = "diploma"
    MARKSHEET = "marksheet"
    PROVISIONAL = "provisional"
    TRANSCRIPT = "transcript"
    OTHER = "other"


class OCRResult(BaseModel):
    """OCR extraction result"""
    text: str
    confidence: float
    language: str
    extracted_data: Dict[str, Any]


class AnomalyCheck(BaseModel):
    """Anomaly detection result"""
    check_name: str
    passed: bool = Field(alias="status")
    confidence: float
    details: Optional[str] = None
    
    class Config:
        populate_by_name = True


class ImageAnalysis(BaseModel):
    """Detailed image analysis result"""
    file_name: str
    file_size: int
    file_format: str
    dimensions: Dict[str, int]  # width, height
    resolution: Optional[Dict[str, float]] = None  # dpi
    color_mode: str
    quality_score: float
    has_transparency: bool
    compression_type: Optional[str] = None
    metadata: Dict[str, Any] = {}


class OCRAnalysis(BaseModel):
    """Comprehensive OCR analysis"""
    raw_text: str
    cleaned_text: str
    word_count: int
    line_count: int
    confidence: float
    detected_language: str
    language_confidence: float
    text_regions: List[Dict[str, Any]] = []
    fonts_detected: List[str] = []
    text_orientation: str
    reading_order_score: float


class ExtractedFields(BaseModel):
    """Structured extracted fields"""
    student_name: Optional[str] = None
    institution: Optional[str] = None
    course: Optional[str] = None
    issue_date: Optional[str] = None
    certificate_number: Optional[str] = None
    grade: Optional[str] = None
    degree_type: Optional[str] = None
    graduation_date: Optional[str] = None
    registration_number: Optional[str] = None
    university_seal: Optional[bool] = None
    signatures_detected: Optional[int] = None
    qr_code_detected: Optional[bool] = None
    barcode_detected: Optional[bool] = None


class VerificationReport(BaseModel):
    """Comprehensive verification report"""
    # Basic Info
    verification_id: str
    timestamp: datetime
    processing_time: float
    
    # Image Analysis
    image_analysis: ImageAnalysis
    
    # OCR Analysis
    ocr_analysis: OCRAnalysis
    
    # Extracted Information
    extracted_fields: ExtractedFields
    
    # Verification Results
    status: VerificationStatus
    confidence_score: float
    is_authentic: bool
    
    # Detailed Checks
    anomaly_checks: List[AnomalyCheck] = []
    database_match: Optional[bool] = None
    blacklist_match: bool = False
    blockchain_verified: Optional[bool] = None
    watermark_detected: Optional[bool] = None
    watermark_type: Optional[str] = None
    
    # Analysis Scores
    ocr_quality_score: float
    image_quality_score: float
    tampering_score: float
    authenticity_score: float
    
    # Recommendations
    warnings: List[str] = []
    recommendations: List[str] = []
    risk_level: str  # "low", "medium", "high", "critical"
    
    # Additional Data
    detected_issues: List[Dict[str, Any]] = []
    verification_details: Dict[str, Any] = {}


class VerificationRequest(BaseModel):
    """Verification request schema"""
    file_name: str
    certificate_type: Optional[CertificateType] = CertificateType.OTHER
    language: Optional[str] = "auto"


class VerificationResponse(BaseModel):
    """Verification response schema"""
    verification_id: str
    status: VerificationStatus
    confidence_score: float
    processing_time: float
    
    # OCR Results
    ocr_text: Optional[str] = None
    detected_language: Optional[str] = None
    
    # Extracted Information
    student_name: Optional[str] = None
    institution: Optional[str] = None
    course: Optional[str] = None
    issue_date: Optional[date] = None
    certificate_number: Optional[str] = None
    grade: Optional[str] = None
    
    # Verification Results
    is_authentic: bool
    anomaly_checks: List[AnomalyCheck] = []
    database_match: Optional[bool] = None
    blacklist_match: bool = False
    
    # Additional Info
    warnings: List[str] = []
    recommendations: List[str] = []
    
    created_at: datetime


class CertificateCreate(BaseModel):
    """Certificate creation schema"""
    certificate_id: str
    student_name: str
    institution: str
    course: str
    issue_date: date
    certificate_type: CertificateType
    grade: Optional[str] = None
    certificate_number: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = {}


class CertificateUpdate(BaseModel):
    """Certificate update schema"""
    student_name: Optional[str] = None
    institution: Optional[str] = None
    course: Optional[str] = None
    issue_date: Optional[date] = None
    grade: Optional[str] = None
    is_active: Optional[bool] = None


class CertificateResponse(BaseModel):
    """Certificate response schema"""
    id: str = Field(alias="_id")
    certificate_id: str
    student_name: str
    institution: str
    course: str
    issue_date: date
    certificate_type: CertificateType
    grade: Optional[str] = None
    certificate_number: Optional[str] = None
    is_active: bool
    verification_count: int = 0
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        populate_by_name = True


class BlacklistEntry(BaseModel):
    """Blacklist entry schema"""
    certificate_id: str
    reason: str
    reported_by: str
    evidence: Optional[str] = None
    notes: Optional[str] = None


class BlacklistResponse(BaseModel):
    """Blacklist response schema"""
    id: str = Field(alias="_id")
    certificate_id: str
    reason: str
    reported_by: str
    evidence: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    
    class Config:
        populate_by_name = True
