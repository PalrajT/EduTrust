from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime, date


class StatsResponse(BaseModel):
    """Dashboard statistics response"""
    total_verifications: int
    successful_verifications: int
    failed_verifications: int
    suspicious_cases: int
    success_rate: float
    total_certificates: int
    blacklisted_certificates: int
    active_users: int


class VerificationTrend(BaseModel):
    """Verification trend data"""
    date: date
    count: int
    success_count: int
    failed_count: int


class LanguageDistribution(BaseModel):
    """Language-wise distribution"""
    language: str
    count: int
    percentage: float


class InstitutionStats(BaseModel):
    """Institution-wise statistics"""
    institution: str
    verification_count: int
    success_rate: float


class DashboardResponse(BaseModel):
    """Complete dashboard response"""
    stats: StatsResponse
    recent_verifications: List[Dict[str, Any]]
    verification_trends: List[VerificationTrend]
    language_distribution: List[LanguageDistribution]
    top_institutions: List[InstitutionStats]
    recent_activity: List[Dict[str, Any]]


class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    timestamp: datetime
    database: str
    ocr_service: str
    ai_model: str
    version: str
