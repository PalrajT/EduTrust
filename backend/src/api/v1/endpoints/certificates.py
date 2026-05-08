from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from datetime import datetime, date
from bson import ObjectId

from src.core.database import get_database
from src.core.security import get_current_user, get_current_admin
from src.core.logging import logger
from src.schemas.certificate import (
    CertificateCreate, CertificateUpdate, CertificateResponse,
    BlacklistEntry, BlacklistResponse
)

router = APIRouter()


@router.post("/", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
async def create_certificate(
    certificate: CertificateCreate,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Create a new certificate (Admin only)"""
    
    # Check if certificate already exists
    existing = await db.certificates.find_one({
        "certificate_id": certificate.certificate_id
    })
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate with this ID already exists"
        )
    
    cert_dict = certificate.dict()
    cert_dict["is_active"] = True
    cert_dict["verification_count"] = 0
    cert_dict["created_at"] = datetime.utcnow()
    cert_dict["created_by"] = current_user["user_id"]
    
    result = await db.certificates.insert_one(cert_dict)
    cert_dict["_id"] = str(result.inserted_id)
    
    logger.info(f"Certificate created: {certificate.certificate_id}")
    
    return cert_dict


@router.get("/{certificate_id}", response_model=CertificateResponse)
async def get_certificate(
    certificate_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get certificate by ID"""
    
    certificate = await db.certificates.find_one({
        "certificate_id": certificate_id
    })
    
    if not certificate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    certificate["_id"] = str(certificate["_id"])
    return certificate


@router.get("/")
async def list_certificates(
    skip: int = 0,
    limit: int = 20,
    institution: Optional[str] = None,
    student_name: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """List certificates with filters"""
    
    query = {}
    
    if institution:
        query["institution"] = {"$regex": institution, "$options": "i"}
    
    if student_name:
        query["student_name"] = {"$regex": student_name, "$options": "i"}
    
    certificates = await db.certificates.find(query)\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(length=limit)
    
    for cert in certificates:
        cert["_id"] = str(cert["_id"])
    
    total = await db.certificates.count_documents(query)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "certificates": certificates
    }


@router.put("/{certificate_id}", response_model=CertificateResponse)
async def update_certificate(
    certificate_id: str,
    certificate_update: CertificateUpdate,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Update certificate (Admin only)"""
    
    update_data = certificate_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.certificates.update_one(
        {"certificate_id": certificate_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    certificate = await db.certificates.find_one({"certificate_id": certificate_id})
    certificate["_id"] = str(certificate["_id"])
    
    logger.info(f"Certificate updated: {certificate_id}")
    
    return certificate


@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_certificate(
    certificate_id: str,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Delete certificate (Admin only)"""
    
    result = await db.certificates.delete_one({"certificate_id": certificate_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found"
        )
    
    logger.info(f"Certificate deleted: {certificate_id}")
    
    return None


# Blacklist endpoints
@router.post("/blacklist/", response_model=BlacklistResponse, status_code=status.HTTP_201_CREATED)
async def add_to_blacklist(
    entry: BlacklistEntry,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Add certificate to blacklist (Admin only)"""
    
    # Check if already blacklisted
    existing = await db.blacklist.find_one({"certificate_id": entry.certificate_id})
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Certificate already in blacklist"
        )
    
    entry_dict = entry.dict()
    entry_dict["created_at"] = datetime.utcnow()
    entry_dict["added_by"] = current_user["user_id"]
    
    result = await db.blacklist.insert_one(entry_dict)
    entry_dict["_id"] = str(result.inserted_id)
    
    logger.info(f"Certificate blacklisted: {entry.certificate_id}")
    
    return entry_dict


@router.get("/blacklist/")
async def list_blacklist(
    skip: int = 0,
    limit: int = 20,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """List blacklisted certificates (Admin only)"""
    
    entries = await db.blacklist.find()\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(length=limit)
    
    for entry in entries:
        entry["_id"] = str(entry["_id"])
    
    total = await db.blacklist.count_documents({})
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "blacklist": entries
    }


@router.delete("/blacklist/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_blacklist(
    certificate_id: str,
    current_user: dict = Depends(get_current_admin),
    db=Depends(get_database)
):
    """Remove certificate from blacklist (Admin only)"""
    
    result = await db.blacklist.delete_one({"certificate_id": certificate_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found in blacklist"
        )
    
    logger.info(f"Certificate removed from blacklist: {certificate_id}")
    
    return None
