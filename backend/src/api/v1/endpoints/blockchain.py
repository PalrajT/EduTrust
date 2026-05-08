"""
Blockchain API Endpoints
Provides blockchain-related operations and queries
"""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional, Dict
from datetime import datetime

from src.core.database import get_database
from src.core.security import get_current_user
from src.core.logging import logger
from src.services.blockchain_service import blockchain_service

router = APIRouter()


@router.get("/stats")
async def get_blockchain_stats(
    current_user: dict = Depends(get_current_user)
):
    """
    Get blockchain statistics
    """
    try:
        stats = blockchain_service.get_blockchain_stats()
        return {
            "success": True,
            "stats": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error getting blockchain stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get blockchain stats: {str(e)}"
        )


@router.post("/store")
async def store_certificate_on_blockchain(
    certificate_data: Dict,
    issuer_id: str,
    recipient_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Manually store a certificate on blockchain
    (Admin only)
    """
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can manually store certificates on blockchain"
        )
    
    try:
        tx_hash, cert_hash, block_info = await blockchain_service.store_certificate(
            certificate_data,
            issuer_id,
            recipient_id
        )
        
        return {
            "success": True,
            "transaction_hash": tx_hash,
            "certificate_hash": cert_hash,
            "block_info": block_info,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error storing certificate on blockchain: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to store certificate: {str(e)}"
        )


@router.post("/verify")
async def verify_certificate_on_blockchain(
    certificate_data: Dict,
    stored_hash: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Verify a certificate against blockchain
    """
    try:
        is_valid, verification_details = await blockchain_service.verify_certificate(
            certificate_data,
            stored_hash
        )
        
        return {
            "success": True,
            "is_valid": is_valid,
            "verification_details": verification_details,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Error verifying certificate on blockchain: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to verify certificate: {str(e)}"
        )


@router.post("/revoke")
async def revoke_certificate(
    certificate_hash: str,
    reason: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Revoke a certificate on blockchain
    (Admin only)
    """
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can revoke certificates"
        )
    
    try:
        success = await blockchain_service.revoke_certificate(
            certificate_hash,
            reason,
            current_user["user_id"]
        )
        
        if success:
            return {
                "success": True,
                "message": "Certificate revoked successfully",
                "certificate_hash": certificate_hash,
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to revoke certificate"
            )
    except Exception as e:
        logger.error(f"Error revoking certificate: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to revoke certificate: {str(e)}"
        )


@router.get("/certificate/{certificate_number}")
async def get_certificate_blockchain_info(
    certificate_number: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Get blockchain information for a specific certificate
    """
    try:
        # Find certificate in database
        verification = await db.verifications.find_one({
            "extracted_data.certificate_number": certificate_number
        })
        
        if not verification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Certificate not found"
            )
        
        # Check ownership (users can only see their own certificates, admins can see all)
        if current_user["role"] != "admin" and verification["user_id"] != current_user["user_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to view this certificate"
            )
        
        blockchain_info = {
            "certificate_number": certificate_number,
            "blockchain_verified": verification.get("blockchain_verified", False),
            "blockchain_tx_hash": verification.get("blockchain_tx_hash"),
            "blockchain_cert_hash": verification.get("blockchain_cert_hash"),
            "blockchain_details": verification.get("blockchain_details", {}),
            "verification_date": verification.get("created_at"),
        }
        
        return {
            "success": True,
            "blockchain_info": blockchain_info
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting certificate blockchain info: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get blockchain info: {str(e)}"
        )
