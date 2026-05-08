from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from typing import Optional, Any, Dict
import os
import aiofiles
import uuid
from datetime import datetime
import time
from enum import Enum
import asyncio

from src.core.database import get_database
from src.core.security import get_current_user
from src.core.logging import logger
from src.core.config import settings
from src.schemas.certificate import (
    VerificationRequest, VerificationResponse, VerificationStatus,
    CertificateType, AnomalyCheck, VerificationReport, ImageAnalysis,
    OCRAnalysis, ExtractedFields
)
from src.services.ocr_service import ocr_service
from src.services.verification_service import ai_verification_service
from src.services.blockchain_service import blockchain_service
from src.services.ai_service import enhanced_ai_service
from src.services.watermark_service import watermark_service
from src.services.ocr_analysis_service import ocr_analysis_service

router = APIRouter()


def serialize_for_mongodb(data: Any) -> Any:
    """
    Recursively serialize data for MongoDB compatibility.
    Converts enums to strings, datetime objects to datetime, and ensures all dict keys are strings.
    """
    if isinstance(data, dict):
        return {str(k): serialize_for_mongodb(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [serialize_for_mongodb(item) for item in data]
    elif isinstance(data, Enum):
        return data.value
    elif isinstance(data, datetime):
        return data
    else:
        return data


@router.post("/upload", response_model=VerificationResponse)
async def verify_certificate(
    file: UploadFile = File(...),
    certificate_type: Optional[str] = Form("other"),
    language: Optional[str] = Form("auto"),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Upload and verify a certificate
    """
    start_time = time.time()
    verification_id = str(uuid.uuid4())
    
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.allowed_extensions_list:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not allowed. Allowed: {settings.allowed_extensions_list}"
            )
        
        # Check file size
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds {settings.MAX_FILE_SIZE / 1024 / 1024}MB limit"
            )
        
        # Save file
        file_path = os.path.join(
            settings.UPLOAD_DIR,
            f"{verification_id}_{file.filename}"
        )
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        logger.info(f"File saved: {file_path}")
        
        # Perform OCR
        ocr_text, ocr_confidence = await ocr_service.extract_text(file_path, language)
        extracted_data = await ocr_service.extract_structured_data(ocr_text)
        detected_language = await ocr_service.detect_language(ocr_text)
        
        logger.info(f"OCR completed: {len(ocr_text)} characters extracted")
        
        # Perform Enhanced AI anomaly detection
        anomaly_checks, ai_confidence = await enhanced_ai_service.detect_anomalies(
            file_path, ocr_text, extracted_data
        )
        
        logger.info(f"AI Analysis completed: {len(anomaly_checks)} checks, confidence: {ai_confidence:.2f}")
        
        # Perform watermark detection
        watermark_result = await watermark_service.detect_watermark(
            file_path,
            detect_visible=True,
            detect_invisible=True
        )
        
        logger.info(f"Watermark detection completed: {watermark_result['watermark_type'] or 'none'} detected")
        
        # Add watermark detection as an anomaly check
        watermark_check = AnomalyCheck(
            check_name="Watermark Detection",
            passed=watermark_result['has_watermark'],
            confidence=watermark_result['confidence'],
            details=f"Type: {watermark_result['watermark_type'] or 'none'}, Confidence: {watermark_result['confidence']:.2%}"
        )
        
        # Perform legacy AI verification (kept for compatibility)
        is_authentic_legacy, legacy_checks, legacy_confidence = await ai_verification_service.verify_certificate(
            file_path, ocr_text, extracted_data
        )
        
        # Combine checks from both AI services and watermark detection
        all_anomaly_checks = anomaly_checks + legacy_checks + [watermark_check]
        
        # Calculate weighted confidence score with watermark boost
        base_confidence = (ai_confidence * 0.5 + legacy_confidence * 0.15 + ocr_confidence * 0.15)
        watermark_bonus = watermark_result['confidence'] * 0.2  # 20% weight for watermark
        confidence_score = base_confidence + watermark_bonus
        
        # Check blockchain for existing certificate
        blockchain_verified = False
        blockchain_details = {}
        
        if extracted_data.get("certificate_number"):
            try:
                blockchain_verified, blockchain_details = await blockchain_service.verify_certificate(
                    extracted_data
                )
                logger.info(f"Blockchain verification: {blockchain_verified}")
                
                # Add blockchain verification as an anomaly check
                blockchain_check = AnomalyCheck(
                    check_name="Blockchain Verification",
                    passed=blockchain_verified,
                    confidence=0.95 if blockchain_verified else 0.3,
                    details=str(blockchain_details)
                )
                all_anomaly_checks.append(blockchain_check)
                
                # Adjust confidence based on blockchain verification
                if blockchain_verified:
                    confidence_score = min(confidence_score * 1.2, 0.99)
                elif blockchain_details.get("status") == "not_found":
                    # Not found is not necessarily bad (might be new certificate)
                    pass
                else:
                    # Tamper detected or other issues
                    confidence_score *= 0.5
                    
            except Exception as e:
                logger.error(f"Blockchain verification error: {str(e)}")
                blockchain_check = AnomalyCheck(
                    check_name="Blockchain Verification",
                    passed=False,
                    confidence=0.5,
                    details=f"Error: {str(e)}"
                )
                all_anomaly_checks.append(blockchain_check)
        
        # Check against database
        database_match = None
        if extracted_data.get("certificate_number"):
            existing_cert = await db.certificates.find_one({
                "certificate_number": extracted_data["certificate_number"]
            })
            database_match = existing_cert is not None
        
        # Check blacklist
        blacklist_match = False
        if extracted_data.get("certificate_number"):
            blacklisted = await db.blacklist.find_one({
                "certificate_id": extracted_data["certificate_number"]
            })
            blacklist_match = blacklisted is not None
        
        # Determine authenticity based on all checks
        passed_checks = sum(1 for check in all_anomaly_checks if check.passed)
        total_checks = len(all_anomaly_checks)
        check_pass_rate = passed_checks / total_checks if total_checks > 0 else 0
        
        is_authentic = (
            confidence_score >= 0.7 and
            check_pass_rate >= 0.7 and
            not blacklist_match
        )
        
        # Determine final status
        if blacklist_match:
            final_status = VerificationStatus.FAILED
            is_authentic = False
        elif confidence_score < 0.5:
            final_status = VerificationStatus.FAILED
        elif confidence_score < 0.7:
            final_status = VerificationStatus.SUSPICIOUS
        else:
            final_status = VerificationStatus.VERIFIED
        
        # Generate warnings and recommendations
        warnings = []
        recommendations = []
        
        if blacklist_match:
            warnings.append("⚠️ Certificate found in blacklist database")
        if confidence_score < 0.7:
            warnings.append("⚠️ Low confidence score detected")
        if not database_match and extracted_data.get("certificate_number"):
            warnings.append("⚠️ Certificate not found in institution database")
        if not blockchain_verified and blockchain_details.get("status") != "not_found":
            warnings.append("⚠️ Blockchain verification failed")
        if not watermark_result['has_watermark']:
            warnings.append("⚠️ No watermark detected on certificate")
        
        failed_checks = [check for check in all_anomaly_checks if not check.passed]
        if failed_checks:
            warnings.append(f"⚠️ {len(failed_checks)} verification checks failed")
            for check in failed_checks[:3]:  # Show top 3 failed checks
                warnings.append(f"  - {check.check_name}: {check.details[:50]}")
        
        if not is_authentic:
            recommendations.append("🔍 Manual verification highly recommended")
            recommendations.append("📞 Contact issuing institution directly")
            recommendations.append("🚨 Do not accept this certificate without verification")
        elif confidence_score < 0.85:
            recommendations.append("🔍 Additional verification recommended")
            recommendations.append("📧 Verify with institution's official records")
        
        if blockchain_verified:
            recommendations.append("✅ Certificate verified on blockchain - authenticity confirmed")
        
        if watermark_result['has_watermark']:
            recommendations.append(f"✅ {watermark_result['watermark_type'].title()} watermark detected - good sign of authenticity")
        
        processing_time = time.time() - start_time
        
        # Store certificate on blockchain if authentic and has certificate number
        blockchain_tx_hash = None
        blockchain_cert_hash = None
        
        if is_authentic and extracted_data.get("certificate_number") and not blockchain_verified:
            try:
                tx_hash, cert_hash, block_info = await blockchain_service.store_certificate(
                    extracted_data,
                    issuer_id=extracted_data.get("institution", "unknown"),
                    recipient_id=extracted_data.get("student_name", "unknown")
                )
                blockchain_tx_hash = tx_hash
                blockchain_cert_hash = cert_hash
                logger.info(f"Certificate stored on blockchain: {cert_hash[:16]}...")
            except Exception as e:
                logger.error(f"Failed to store on blockchain: {str(e)}")
        
        # Create verification record
        verification_record = {
            "verification_id": verification_id,
            "user_id": current_user["user_id"],
            "file_path": file_path,
            "file_name": file.filename,
            "certificate_type": certificate_type,
            "status": final_status,
            "confidence_score": confidence_score,
            "processing_time": processing_time,
            "ocr_text": ocr_text,
            "ocr_confidence": ocr_confidence,
            "detected_language": detected_language,
            "extracted_data": extracted_data,
            "is_authentic": is_authentic,
            "anomaly_checks": [check.dict() for check in all_anomaly_checks],
            "database_match": database_match,
            "blacklist_match": blacklist_match,
            "blockchain_verified": blockchain_verified,
            "blockchain_details": blockchain_details,
            "blockchain_tx_hash": blockchain_tx_hash,
            "blockchain_cert_hash": blockchain_cert_hash,
            "watermark_detected": watermark_result['has_watermark'],
            "watermark_type": watermark_result['watermark_type'],
            "watermark_confidence": watermark_result['confidence'],
            "watermark_details": watermark_result,
            "warnings": warnings,
            "recommendations": recommendations,
            "created_at": datetime.utcnow()
        }
        
        await db.verifications.insert_one(verification_record)
        logger.info(f"Verification completed: {verification_id}")
        
        # Update certificate verification count if found
        if database_match and extracted_data.get("certificate_number"):
            await db.certificates.update_one(
                {"certificate_number": extracted_data["certificate_number"]},
                {"$inc": {"verification_count": 1}}
            )
        
        # Prepare response
        response = VerificationResponse(
            verification_id=verification_id,
            status=final_status,
            confidence_score=confidence_score,
            processing_time=processing_time,
            ocr_text=ocr_text[:500],  # Truncate for response
            detected_language=detected_language,
            student_name=extracted_data.get("student_name"),
            institution=extracted_data.get("institution"),
            course=extracted_data.get("course"),
            issue_date=extracted_data.get("issue_date"),
            certificate_number=extracted_data.get("certificate_number"),
            grade=extracted_data.get("grade"),
            is_authentic=is_authentic,
            anomaly_checks=all_anomaly_checks,
            database_match=database_match,
            blacklist_match=blacklist_match,
            warnings=warnings,
            recommendations=recommendations,
            created_at=datetime.utcnow()
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error verifying certificate: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}"
        )


@router.get("/{verification_id}", response_model=VerificationResponse)
async def get_verification(
    verification_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Get verification result by ID
    """
    verification = await db.verifications.find_one({"verification_id": verification_id})
    
    if not verification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verification not found"
        )
    
    # Check ownership (users can only see their own verifications, admins can see all)
    if current_user["role"] != "admin" and verification["user_id"] != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this verification"
        )
    
    return verification


@router.get("/")
async def list_verifications(
    skip: int = 0,
    limit: int = 10,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    List user's verifications
    """
    query = {}
    if current_user["role"] != "admin":
        query["user_id"] = current_user["user_id"]
    
    verifications = await db.verifications.find(query)\
        .sort("created_at", -1)\
        .skip(skip)\
        .limit(limit)\
        .to_list(length=limit)
    
    total = await db.verifications.count_documents(query)
    
    return {
        "total": total,
        "skip": skip,
        "limit": limit,
        "verifications": verifications
    }


@router.post("/analyze-report", response_model=VerificationReport)
async def generate_comprehensive_report(
    file: UploadFile = File(...),
    certificate_type: Optional[str] = Form("other"),
    language: Optional[str] = Form("auto"),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Generate comprehensive OCR-based verification report with detailed image analysis
    Optimized to complete within 60 seconds
    """
    start_time = time.time()
    verification_id = str(uuid.uuid4())
    timeout_seconds = getattr(settings, 'VERIFICATION_TIMEOUT', 55)
    
    try:
        # Wrap entire verification in timeout
        async def _verification_with_timeout():
            return await _perform_verification(file, verification_id, certificate_type, language, current_user, db, start_time)
        
        try:
            return await asyncio.wait_for(_verification_with_timeout(), timeout=timeout_seconds)
        except asyncio.TimeoutError:
            logger.error(f"Verification timeout after {timeout_seconds}s")
            raise HTTPException(
                status_code=status.HTTP_408_REQUEST_TIMEOUT,
                detail=f"Verification process exceeded {timeout_seconds} seconds timeout. Please try with a smaller image or PDF."
            )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Verification failed: {str(e)}"
        )


async def _perform_verification(
    file: UploadFile,
    verification_id: str,
    certificate_type: str,
    language: str,
    current_user: dict,
    db,
    start_time: float
) -> VerificationReport:
    """Internal verification logic with timeout protection"""
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No file provided"
            )
        
        # Check file extension
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in settings.allowed_extensions_list:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type {file_ext} not allowed"
            )
        
        # Check file size
        content = await file.read()
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds {settings.MAX_FILE_SIZE / 1024 / 1024}MB limit"
            )
        
        # Save file
        file_path = os.path.join(
            settings.UPLOAD_DIR,
            f"{verification_id}_{file.filename}"
        )
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(content)
        
        logger.info(f"File saved for comprehensive analysis: {file_path}")
        
        # OPTIMIZATION: Run independent analyses in parallel
        # Step 1 & 2: Image Analysis and OCR can run in parallel
        logger.info("Steps 1-2/6: Running image and OCR analysis in parallel...")
        step_start = time.time()
        
        image_analysis_task = ocr_analysis_service.analyze_image(file_path)
        ocr_analysis_task = ocr_analysis_service.perform_comprehensive_ocr(
            file_path,
            language if language != "auto" else "eng"
        )
        
        image_analysis_data, ocr_analysis_data = await asyncio.gather(
            image_analysis_task,
            ocr_analysis_task
        )
        
        logger.info(f"Parallel analysis completed in {time.time() - step_start:.2f}s")
        image_analysis = ImageAnalysis(**image_analysis_data)
        ocr_analysis = OCRAnalysis(**ocr_analysis_data)
        
        # Step 3: Extract Advanced Fields (depends on OCR)
        logger.info("Step 3/6: Extracting certificate fields...")
        step_start = time.time()
        ocr_data_dict = {
            "text": [],
            "conf": [],
            "left": [],
            "top": [],
            "width": [],
            "height": [],
            "block_num": [],
            "line_num": []
        }
        extracted_fields_data = await ocr_analysis_service.extract_advanced_fields(
            ocr_analysis.cleaned_text,
            ocr_data_dict
        )
        extracted_fields = ExtractedFields(**extracted_fields_data)
        logger.info(f"Field extraction completed in {time.time() - step_start:.2f}s")
        
        # OPTIMIZATION: Run AI anomaly detection and watermark detection in parallel
        # Step 4 & 5: AI checks and watermark detection can run in parallel
        logger.info("Steps 4-5/6: Running AI and watermark analysis in parallel...")
        step_start = time.time()
        
        basic_extracted = {
            "student_name": extracted_fields.student_name,
            "institution": extracted_fields.institution,
            "course": extracted_fields.course,
            "issue_date": extracted_fields.issue_date,
            "certificate_number": extracted_fields.certificate_number,
            "grade": extracted_fields.grade
        }
        
        ai_task = enhanced_ai_service.detect_anomalies(
            file_path, ocr_analysis.cleaned_text, basic_extracted
        )
        
        # OPTIMIZATION: Make invisible watermark detection optional (saves 5-8 seconds)
        enable_invisible = getattr(settings, 'ENABLE_INVISIBLE_WATERMARK', False)
        watermark_task = watermark_service.detect_watermark(
            file_path,
            detect_visible=True,
            detect_invisible=enable_invisible
        )
        
        (anomaly_checks, ai_confidence), watermark_result = await asyncio.gather(
            ai_task,
            watermark_task
        )
        
        logger.info(f"Parallel AI/watermark analysis completed in {time.time() - step_start:.2f}s")
        
        # Step 6: Blockchain Verification (fast, keep sequential)
        logger.info("Step 6/6: Blockchain verification...")
        step_start = time.time()
        blockchain_verified = False
        if extracted_fields.certificate_number:
            try:
                blockchain_verified, _ = await blockchain_service.verify_certificate(basic_extracted)
            except Exception as e:
                logger.error(f"Blockchain verification error: {e}")
        logger.info(f"Blockchain verification completed in {time.time() - step_start:.2f}s")
        
        # Calculate various scores
        ocr_quality_score = ocr_analysis.confidence
        image_quality_score = image_analysis.quality_score
        
        # Tampering score (from AI checks)
        tampering_checks = [c for c in anomaly_checks if 'tamper' in c.check_name.lower()]
        if tampering_checks:
            tampering_score = sum(c.confidence for c in tampering_checks) / len(tampering_checks)
        else:
            tampering_score = 0.0
        
        # Overall authenticity score
        base_confidence = (ai_confidence * 0.4 + ocr_quality_score * 0.2 + image_quality_score * 0.2)
        watermark_bonus = watermark_result['confidence'] * 0.2
        authenticity_score = base_confidence + watermark_bonus
        
        # Blockchain boost
        if blockchain_verified:
            authenticity_score = min(authenticity_score * 1.15, 0.99)
        
        # Determine status
        passed_checks = sum(1 for check in anomaly_checks if check.passed)
        total_checks = len(anomaly_checks)
        check_pass_rate = passed_checks / total_checks if total_checks > 0 else 0
        
        is_authentic = (authenticity_score >= 0.7 and check_pass_rate >= 0.7)
        
        if authenticity_score >= 0.85:
            final_status = VerificationStatus.VERIFIED
        elif authenticity_score >= 0.6:
            final_status = VerificationStatus.SUSPICIOUS
        else:
            final_status = VerificationStatus.FAILED
        
        # Generate warnings and recommendations
        warnings = []
        recommendations = []
        detected_issues = []
        
        if image_quality_score < 0.6:
            warnings.append("⚠️ Low image quality detected")
            detected_issues.append({"type": "quality", "severity": "medium", "message": "Image quality below recommended threshold"})
        
        if ocr_quality_score < 0.7:
            warnings.append("⚠️ Low OCR confidence")
            detected_issues.append({"type": "ocr", "severity": "medium", "message": "Text extraction confidence is low"})
        
        if not watermark_result['has_watermark']:
            warnings.append("⚠️ No watermark detected")
            detected_issues.append({"type": "watermark", "severity": "high", "message": "Missing watermark - potential counterfeit"})
        
        failed_checks = [check for check in anomaly_checks if not check.passed]
        if failed_checks:
            warnings.append(f"⚠️ {len(failed_checks)} verification checks failed")
            for check in failed_checks[:5]:
                detected_issues.append({
                    "type": "anomaly",
                    "severity": "high" if check.confidence < 0.5 else "medium",
                    "message": f"{check.check_name}: {check.details[:100]}"
                })
        
        if not extracted_fields.student_name:
            warnings.append("⚠️ Student name not detected")
            detected_issues.append({"type": "extraction", "severity": "high", "message": "Failed to extract student name"})
        
        if not extracted_fields.institution:
            warnings.append("⚠️ Institution name not detected")
            detected_issues.append({"type": "extraction", "severity": "high", "message": "Failed to extract institution name"})
        
        # Recommendations
        if authenticity_score < 0.7:
            recommendations.append("🔍 Manual verification required")
            recommendations.append("📞 Contact issuing institution directly")
        
        if image_quality_score < 0.7:
            recommendations.append("📷 Request higher quality scan")
        
        if blockchain_verified:
            recommendations.append("✅ Certificate verified on blockchain")
        else:
            recommendations.append("🔗 Consider blockchain registration")
        
        if watermark_result['has_watermark']:
            recommendations.append(f"✅ {watermark_result['watermark_type'].title()} watermark detected")
        
        # Determine risk level
        if authenticity_score >= 0.85 and len(warnings) == 0:
            risk_level = "low"
        elif authenticity_score >= 0.7 and len(warnings) <= 2:
            risk_level = "medium"
        elif authenticity_score >= 0.5:
            risk_level = "high"
        else:
            risk_level = "critical"
        
        processing_time = time.time() - start_time
        
        # Create verification details
        verification_details = {
            "file_path": file_path,
            "user_id": current_user["user_id"],
            "certificate_type": certificate_type,
            "language_used": language,
            "checks_performed": total_checks,
            "checks_passed": passed_checks,
            "blockchain_verified": blockchain_verified,
            "watermark_type": watermark_result['watermark_type'],
            "ai_confidence": ai_confidence,
            "ocr_word_count": ocr_analysis.word_count,
            "ocr_line_count": ocr_analysis.line_count,
            "detected_language": ocr_analysis.detected_language
        }
        
        # Create comprehensive report
        report = VerificationReport(
            verification_id=verification_id,
            timestamp=datetime.utcnow(),
            processing_time=processing_time,
            image_analysis=image_analysis,
            ocr_analysis=ocr_analysis,
            extracted_fields=extracted_fields,
            status=final_status,
            confidence_score=authenticity_score,
            is_authentic=is_authentic,
            anomaly_checks=anomaly_checks,
            database_match=None,  # Can be added if needed
            blacklist_match=False,  # Can be added if needed
            blockchain_verified=blockchain_verified,
            watermark_detected=watermark_result['has_watermark'],
            watermark_type=watermark_result['watermark_type'],
            ocr_quality_score=ocr_quality_score,
            image_quality_score=image_quality_score,
            tampering_score=tampering_score,
            authenticity_score=authenticity_score,
            warnings=warnings,
            recommendations=recommendations,
            risk_level=risk_level,
            detected_issues=detected_issues,
            verification_details=verification_details
        )
        
        # Store report in database
        # Use model_dump() instead of dict() for proper serialization (Pydantic v2)
        # Or dict(by_alias=True, exclude_none=False) for Pydantic v1
        try:
            report_dict = report.model_dump()  # Pydantic v2
        except AttributeError:
            report_dict = report.dict()  # Pydantic v1
        
        # Serialize for MongoDB (convert enums, ensure string keys, etc.)
        report_dict = serialize_for_mongodb(report_dict)
        report_dict["user_id"] = current_user["user_id"]
        report_dict["created_at"] = datetime.utcnow()
        
        await db.verification_reports.insert_one(report_dict)
        
        logger.info(f"Comprehensive report generated: {verification_id}")
        
        return report
        
    except Exception as e:
        logger.error(f"Error generating comprehensive report: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}"
        )


@router.get("/report/{verification_id}", response_model=VerificationReport)
async def get_verification_report(
    verification_id: str,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """
    Get comprehensive verification report by ID
    """
    report = await db.verification_reports.find_one({"verification_id": verification_id})
    
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
    
    # Check ownership
    if current_user["role"] != "admin" and report.get("user_id") != current_user["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to view this report"
        )
    
    return report
