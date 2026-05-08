from fastapi import APIRouter, Depends
from datetime import datetime, timedelta, date
from typing import List
from collections import defaultdict

from src.core.database import get_database
from src.core.security import get_current_user, get_current_admin
from src.core.logging import logger
from src.schemas.dashboard import (
    DashboardResponse, StatsResponse, VerificationTrend,
    LanguageDistribution, InstitutionStats, HealthCheckResponse
)

router = APIRouter()


@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get dashboard statistics (Admin only)"""
    
    # Total verifications
    total_verifications = await db.verifications.count_documents({})
    
    # Successful verifications
    successful = await db.verifications.count_documents({
        "status": "verified"
    })
    
    # Failed verifications
    failed = await db.verifications.count_documents({
        "status": "failed"
    })
    
    # Suspicious cases
    suspicious = await db.verifications.count_documents({
        "status": "suspicious"
    })
    
    # Success rate
    success_rate = (successful / total_verifications * 100) if total_verifications > 0 else 0
    
    # Total certificates
    total_certificates = await db.certificates.count_documents({})
    
    # Blacklisted certificates
    blacklisted = await db.blacklist.count_documents({})
    
    # Active users
    active_users = await db.users.count_documents({"is_active": True})
    
    return StatsResponse(
        total_verifications=total_verifications,
        successful_verifications=successful,
        failed_verifications=failed,
        suspicious_cases=suspicious,
        success_rate=round(success_rate, 2),
        total_certificates=total_certificates,
        blacklisted_certificates=blacklisted,
        active_users=active_users
    )


@router.get("/trends")
async def get_verification_trends(
    days: int = 30,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get verification trends over time (Admin only)"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Aggregate verifications by date
    pipeline = [
        {
            "$match": {
                "created_at": {"$gte": start_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "$dateToString": {
                        "format": "%Y-%m-%d",
                        "date": "$created_at"
                    }
                },
                "count": {"$sum": 1},
                "success_count": {
                    "$sum": {
                        "$cond": [{"$eq": ["$status", "verified"]}, 1, 0]
                    }
                },
                "failed_count": {
                    "$sum": {
                        "$cond": [{"$eq": ["$status", "failed"]}, 1, 0]
                    }
                }
            }
        },
        {
            "$sort": {"_id": 1}
        }
    ]
    
    results = await db.verifications.aggregate(pipeline).to_list(None)
    
    trends = []
    for item in results:
        trends.append(VerificationTrend(
            date=item["_id"],
            count=item["count"],
            success_count=item["success_count"],
            failed_count=item["failed_count"]
        ))
    
    return trends


@router.get("/language-distribution")
async def get_language_distribution(
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get language-wise verification distribution (Admin only)"""
    
    pipeline = [
        {
            "$group": {
                "_id": "$detected_language",
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"count": -1}
        }
    ]
    
    results = await db.verifications.aggregate(pipeline).to_list(None)
    
    total = sum(item["count"] for item in results)
    
    distribution = []
    for item in results:
        language = item["_id"] or "unknown"
        count = item["count"]
        percentage = (count / total * 100) if total > 0 else 0
        
        distribution.append(LanguageDistribution(
            language=language,
            count=count,
            percentage=round(percentage, 2)
        ))
    
    return distribution


@router.get("/institutions")
async def get_top_institutions(
    limit: int = 10,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get top institutions by verification count (Admin only)"""
    
    pipeline = [
        {
            "$match": {
                "extracted_data.institution": {"$exists": True, "$ne": None}
            }
        },
        {
            "$group": {
                "_id": "$extracted_data.institution",
                "verification_count": {"$sum": 1},
                "success_count": {
                    "$sum": {
                        "$cond": [{"$eq": ["$status", "verified"]}, 1, 0]
                    }
                }
            }
        },
        {
            "$sort": {"verification_count": -1}
        },
        {
            "$limit": limit
        }
    ]
    
    results = await db.verifications.aggregate(pipeline).to_list(None)
    
    institutions = []
    for item in results:
        success_rate = (item["success_count"] / item["verification_count"] * 100) \
            if item["verification_count"] > 0 else 0
        
        institutions.append(InstitutionStats(
            institution=item["_id"],
            verification_count=item["verification_count"],
            success_rate=round(success_rate, 2)
        ))
    
    return institutions


@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get recent verification activity"""
    
    query = {}
    if current_user["role"] != "admin":
        query["user_id"] = current_user["user_id"]
    
    verifications = await db.verifications.find(query)\
        .sort("created_at", -1)\
        .limit(limit)\
        .to_list(length=limit)
    
    # Format for response
    activity = []
    for v in verifications:
        activity.append({
            "verification_id": v["verification_id"],
            "file_name": v.get("file_name", "Unknown"),
            "status": v["status"],
            "confidence_score": v.get("confidence_score", 0),
            "student_name": v.get("extracted_data", {}).get("student_name"),
            "institution": v.get("extracted_data", {}).get("institution"),
            "created_at": v["created_at"]
        })
    
    return activity


@router.get("/", response_model=DashboardResponse)
async def get_dashboard(
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Get complete dashboard data (Admin only)"""
    
    # Get all dashboard components
    stats = await get_stats(current_user, db)
    trends = await get_verification_trends(30, current_user, db)
    language_dist = await get_language_distribution(current_user, db)
    top_institutions = await get_top_institutions(10, current_user, db)
    recent_activity = await get_recent_activity(10, current_user, db)
    
    # Get recent verifications with full details
    recent_verifications = await db.verifications.find()\
        .sort("created_at", -1)\
        .limit(5)\
        .to_list(length=5)
    
    for v in recent_verifications:
        v["_id"] = str(v["_id"])
    
    return DashboardResponse(
        stats=stats,
        recent_verifications=recent_verifications,
        verification_trends=trends,
        language_distribution=language_dist,
        top_institutions=top_institutions,
        recent_activity=recent_activity
    )


@router.get("/health", response_model=HealthCheckResponse)
async def health_check(db=Depends(get_database)):
    """Health check endpoint"""
    
    try:
        # Check database
        await db.command("ping")
        database_status = "healthy"
    except Exception as e:
        database_status = f"unhealthy: {str(e)}"
    
    return HealthCheckResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        database=database_status,
        ocr_service="operational",
        ai_model="operational",
        version="1.0.0"
    )
