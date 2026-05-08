"""
Enhanced AI Service for Certificate Verification
Implements advanced anomaly detection, tampering identification, and authenticity verification
"""

import os
from typing import List, Dict, Tuple, Optional
from datetime import datetime
import re
import asyncio

try:
    import cv2
except ImportError:
    cv2 = None

try:
    import numpy as np
except ImportError:
    np = None

try:
    from PIL import Image, ImageStat
except ImportError:
    Image = None
    ImageStat = None

try:
    import torch
    import torch.nn as nn
except ImportError:
    torch = None
    nn = None

# PDF handling
try:
    import pdf2image
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False

from src.core.config import settings
from src.core.logging import logger
from src.schemas.certificate import AnomalyCheck


class EnhancedAIService:
    """
    Enhanced AI-powered verification service with multiple detection methods
    """
    
    def __init__(self):
        self.confidence_threshold = settings.CONFIDENCE_THRESHOLD if hasattr(settings, 'CONFIDENCE_THRESHOLD') else 0.7
        
        # Font patterns for common certificate fonts
        self.legitimate_fonts = [
            "Times New Roman", "Arial", "Calibri", "Georgia",
            "Cambria", "Book Antiqua", "Garamond"
        ]
    
    def _convert_pdf_to_image(self, pdf_path: str):
        """
        Convert PDF to image (first page only).
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            PIL Image object or None if conversion fails
        """
        if not PDF_SUPPORT:
            logger.error("PDF support not available - install pdf2image")
            return None
        
        try:
            from pdf2image import convert_from_path
            
            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                return None
            
            abs_path = os.path.abspath(pdf_path)
            poppler_path = getattr(settings, 'POPPLER_PATH', None)
            pdf_dpi = getattr(settings, 'PDF_DPI', 150)  # Default 150 for speed
            
            if poppler_path and not os.path.exists(poppler_path):
                poppler_path = None
            
            images = convert_from_path(
                abs_path,
                first_page=1,
                last_page=1,
                dpi=pdf_dpi,
                fmt='png',
                poppler_path=poppler_path if poppler_path else None
            )
            
            if images:
                return images[0]
            return None
                
        except Exception as e:
            logger.error(f"Error converting PDF in AI service: {e}")
            return None
    
    def _load_image(self, image_path: str):
        """
        Load image from file, handling both images and PDFs.
        
        Args:
            image_path: Path to image or PDF file
            
        Returns:
            PIL Image object or None if loading fails
        """
        if Image is None:
            return None
        
        try:
            file_ext = os.path.splitext(image_path)[1].lower()
            
            if file_ext == '.pdf':
                return self._convert_pdf_to_image(image_path)
            else:
                return Image.open(image_path)
                
        except Exception as e:
            logger.error(f"Error loading image in AI service: {e}")
            return None
    
    def _load_image_cv2(self, image_path: str, flags=cv2.IMREAD_COLOR):
        """
        Load image with OpenCV, handling both images and PDFs.
        
        Args:
            image_path: Path to image or PDF file
            flags: OpenCV imread flags (IMREAD_COLOR, IMREAD_GRAYSCALE, etc.)
            
        Returns:
            NumPy array or None if loading fails
        """
        if cv2 is None:
            return None
        
        try:
            file_ext = os.path.splitext(image_path)[1].lower()
            
            if file_ext == '.pdf':
                # Convert PDF to PIL Image first
                pil_img = self._convert_pdf_to_image(image_path)
                if pil_img is None:
                    return None
                # Convert PIL to cv2
                img_array = np.array(pil_img)
                if flags == cv2.IMREAD_GRAYSCALE:
                    return cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                else:
                    return cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            else:
                return cv2.imread(image_path, flags)
                
        except Exception as e:
            logger.error(f"Error loading image with cv2: {e}")
            return None
        
        # Seal patterns (to be expanded with actual patterns)
        self.known_seals = {}
        
        logger.info("Enhanced AI Service initialized")
    
    async def detect_anomalies(
        self,
        image_path: str,
        ocr_text: str,
        extracted_data: Dict
    ) -> Tuple[List[AnomalyCheck], float]:
        """
        Perform comprehensive anomaly detection with parallel execution and optional checks
        
        Args:
            image_path: Path to certificate image
            ocr_text: Extracted OCR text
            extracted_data: Structured data from OCR
            
        Returns:
            Tuple of (anomaly_checks, overall_confidence)
        """
        # OPTIMIZATION: Run checks in parallel with optional signature/metadata analysis
        logger.info("Running AI anomaly checks in parallel...")
        
        # Core checks (always run)
        core_tasks = [
            self._check_image_quality(image_path),
            self._detect_tampering(image_path),
            self._verify_seals(image_path),
            self._analyze_font_consistency(image_path, ocr_text),
            self._check_date_consistency(extracted_data),
            self._validate_format(ocr_text, extracted_data),
        ]
        
        # Optional checks (can be disabled for speed)
        if getattr(settings, 'ENABLE_SIGNATURE_ANALYSIS', True):
            core_tasks.append(self._analyze_signatures(image_path))
        
        if getattr(settings, 'ENABLE_METADATA_ANALYSIS', True):
            core_tasks.append(self._analyze_metadata(image_path))
        
        checks = await asyncio.gather(*core_tasks, return_exceptions=True)
        
        # Filter out any exceptions and convert to failed checks
        anomaly_checks = []
        check_names = [
            "Image Quality", "Tamper Detection", "Seal Verification",
            "Font Consistency", "Date Consistency", "Format Validation"
        ]
        if getattr(settings, 'ENABLE_SIGNATURE_ANALYSIS', True):
            check_names.append("Signature Analysis")
        if getattr(settings, 'ENABLE_METADATA_ANALYSIS', True):
            check_names.append("Metadata Analysis")
        
        for i, check in enumerate(checks):
            if isinstance(check, Exception):
                logger.error(f"AI check {check_names[i] if i < len(check_names) else i+1} failed: {check}")
                anomaly_checks.append(AnomalyCheck(
                    check_name=check_names[i] if i < len(check_names) else f"Check {i+1}",
                    passed=False,
                    confidence=0.0,
                    details=f"Check failed: {str(check)}"
                ))
            else:
                anomaly_checks.append(check)
        
        # Calculate overall confidence
        passed_checks = sum(1 for check in anomaly_checks if check.passed)
        overall_confidence = passed_checks / len(anomaly_checks) if anomaly_checks else 0.0
        
        logger.info(f"AI checks completed: {passed_checks}/{len(anomaly_checks)} passed")
        return anomaly_checks, overall_confidence
    
    async def _check_image_quality(self, image_path: str) -> AnomalyCheck:
        """Check image quality metrics"""
        try:
            if Image is None or ImageStat is None:
                return AnomalyCheck(
                    check_name="Image Quality",
                    passed=True,
                    confidence=0.5,
                    details="PIL not available for quality check"
                )
            
            img = self._load_image(image_path)
            if img is None:
                raise ValueError("Failed to load image")
            
            # Check resolution
            width, height = img.size
            min_resolution = 300  # Minimum acceptable resolution
            resolution_adequate = min(width, height) >= min_resolution
            
            # Check sharpness using image statistics
            stat = ImageStat.Stat(img.convert('L'))
            sharpness = stat.stddev[0]  # Standard deviation as sharpness measure
            is_sharp = sharpness > 30  # Threshold for acceptable sharpness
            
            # Check brightness
            brightness = stat.mean[0]
            brightness_ok = 50 < brightness < 200
            
            passed = resolution_adequate and is_sharp and brightness_ok
            confidence = 0.8 if passed else 0.4
            
            details = {
                "resolution": f"{width}x{height}",
                "sharpness_score": round(sharpness, 2),
                "brightness": round(brightness, 2),
                "resolution_adequate": resolution_adequate,
                "is_sharp": is_sharp,
                "brightness_ok": brightness_ok
            }
            
            return AnomalyCheck(
                check_name="Image Quality",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Image quality check error: {str(e)}")
            return AnomalyCheck(
                check_name="Image Quality",
                passed=False,
                confidence=0.3,
                details=f"Error: {str(e)}"
            )
    
    async def _detect_tampering(self, image_path: str) -> AnomalyCheck:
        """Detect image tampering using Error Level Analysis (ELA)"""
        try:
            if cv2 is None or np is None:
                return AnomalyCheck(
                    check_name="Tamper Detection",
                    passed=True,
                    confidence=0.5,
                    details="OpenCV not available for tamper detection"
                )
            
            # Read image
            img = self._load_image_cv2(image_path)
            if img is None:
                raise ValueError("Failed to load image")
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Detect edges (tampered areas often have inconsistent edges)
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / edges.size
            
            # Check for copy-paste artifacts using template matching
            # Split image into regions and check for duplicates
            h, w = gray.shape
            region_size = 50
            duplicate_score = 0
            
            for i in range(0, h - region_size, region_size):
                for j in range(0, w - region_size, region_size):
                    template = gray[i:i+region_size, j:j+region_size]
                    if template.size == 0:
                        continue
                    
                    # Search for duplicates in other regions
                    result = cv2.matchTemplate(gray, template, cv2.TM_CCOEFF_NORMED)
                    threshold = 0.95
                    locations = np.where(result >= threshold)
                    
                    # If more than one match (excluding self), suspicious
                    if len(locations[0]) > 1:
                        duplicate_score += 1
            
            # Analyze JPEG compression artifacts
            # Recompress and compare (JPEG double compression detection)
            temp_path = image_path + ".temp.jpg"
            cv2.imwrite(temp_path, img, [cv2.IMWRITE_JPEG_QUALITY, 90])
            recompressed = cv2.imread(temp_path)
            
            # Calculate difference
            if recompressed is not None:
                diff = cv2.absdiff(img, recompressed)
                compression_anomaly = np.mean(diff)
            else:
                compression_anomaly = 0
            
            # Determine if tampering detected
            tamper_detected = (
                edge_density > 0.3 or  # Too many edges (inconsistent)
                duplicate_score > 5 or  # Too many duplicate regions
                compression_anomaly > 15  # High compression anomaly
            )
            
            passed = not tamper_detected
            confidence = 0.75 if passed else 0.3
            
            details = {
                "edge_density": round(edge_density, 4),
                "duplicate_regions": duplicate_score,
                "compression_anomaly": round(compression_anomaly, 2),
                "tamper_detected": tamper_detected
            }
            
            return AnomalyCheck(
                check_name="Tamper Detection",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Tamper detection error: {str(e)}")
            return AnomalyCheck(
                check_name="Tamper Detection",
                passed=False,
                confidence=0.3,
                details=f"Error: {str(e)}"
            )
    
    async def _analyze_font_consistency(self, image_path: str, ocr_text: str) -> AnomalyCheck:
        """Analyze font consistency across the document"""
        try:
            # This is a simplified check - production would use proper font detection
            
            # Check for common forgery patterns in text
            suspicious_patterns = [
                r'[A-Z]{2,}[a-z]{2,}[A-Z]{2,}',  # Inconsistent capitalization
                r'\d{1,2}[a-zA-Z]+\d{1,2}',  # Mixed numbers and letters
                r'[^\w\s]{3,}',  # Multiple special characters
            ]
            
            pattern_violations = 0
            for pattern in suspicious_patterns:
                if re.search(pattern, ocr_text):
                    pattern_violations += 1
            
            # Check for font size variations (simplified)
            # In production, this would analyze actual font rendering
            lines = ocr_text.split('\n')
            line_lengths = [len(line) for line in lines if line.strip()]
            
            if line_lengths:
                avg_length = sum(line_lengths) / len(line_lengths)
                variance = sum((l - avg_length) ** 2 for l in line_lengths) / len(line_lengths)
                inconsistent_formatting = variance > 500
            else:
                inconsistent_formatting = False
            
            passed = (pattern_violations == 0) and (not inconsistent_formatting)
            confidence = 0.7 if passed else 0.4
            
            details = {
                "pattern_violations": pattern_violations,
                "inconsistent_formatting": inconsistent_formatting,
                "text_lines": len(lines)
            }
            
            return AnomalyCheck(
                check_name="Font Consistency",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Font consistency check error: {str(e)}")
            return AnomalyCheck(
                check_name="Font Consistency",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )
    
    async def _verify_seals(self, image_path: str) -> AnomalyCheck:
        """Verify institutional seals and logos"""
        try:
            if cv2 is None or np is None:
                return AnomalyCheck(
                    check_name="Seal Verification",
                    passed=True,
                    confidence=0.5,
                    details="OpenCV not available for seal verification"
                )
            
            img = self._load_image_cv2(image_path)
            if img is None:
                raise ValueError("Failed to load image")
            
            # Convert to HSV for better color detection
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Detect circular shapes (common in seals)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (9, 9), 2)
            
            circles = cv2.HoughCircles(
                blurred,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=50,
                param1=100,
                param2=30,
                minRadius=20,
                maxRadius=200
            )
            
            seals_found = circles is not None and len(circles[0]) > 0
            seal_count = len(circles[0]) if seals_found else 0
            
            # Check for red/blue colors common in official seals
            # Red range in HSV
            lower_red1 = np.array([0, 50, 50])
            upper_red1 = np.array([10, 255, 255])
            lower_red2 = np.array([170, 50, 50])
            upper_red2 = np.array([180, 255, 255])
            
            mask_red1 = cv2.inRange(hsv, lower_red1, upper_red1)
            mask_red2 = cv2.inRange(hsv, lower_red2, upper_red2)
            red_mask = mask_red1 + mask_red2
            
            red_percentage = (np.sum(red_mask > 0) / red_mask.size) * 100
            has_seal_colors = red_percentage > 0.5
            
            passed = seals_found and has_seal_colors
            confidence = 0.65 if passed else 0.5
            
            details = {
                "seals_detected": seal_count,
                "red_color_percentage": round(red_percentage, 2),
                "has_seal_colors": has_seal_colors
            }
            
            return AnomalyCheck(
                check_name="Seal Verification",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Seal verification error: {str(e)}")
            return AnomalyCheck(
                check_name="Seal Verification",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )
    
    async def _check_date_consistency(self, extracted_data: Dict) -> AnomalyCheck:
        """Check for date consistency and validity"""
        try:
            issue_date = extracted_data.get("issue_date")
            
            if not issue_date:
                return AnomalyCheck(
                    check_name="Date Consistency",
                    passed=True,
                    confidence=0.5,
                    details="No date found to verify"
                )
            
            # Parse date (assuming various formats)
            date_formats = [
                "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y",
                "%d-%m-%Y", "%Y/%m/%d", "%B %d, %Y"
            ]
            
            parsed_date = None
            for fmt in date_formats:
                try:
                    parsed_date = datetime.strptime(str(issue_date), fmt)
                    break
                except:
                    continue
            
            if not parsed_date:
                return AnomalyCheck(
                    check_name="Date Consistency",
                    passed=False,
                    confidence=0.3,
                    details="Could not parse date"
                )
            
            # Check if date is reasonable (not in future, not too old)
            now = datetime.now()
            is_future = parsed_date > now
            is_too_old = (now.year - parsed_date.year) > 50
            
            passed = not is_future and not is_too_old
            confidence = 0.9 if passed else 0.2
            
            details = {
                "issue_date": issue_date,
                "parsed_date": parsed_date.strftime("%Y-%m-%d"),
                "is_future": is_future,
                "is_too_old": is_too_old,
                "years_ago": now.year - parsed_date.year
            }
            
            return AnomalyCheck(
                check_name="Date Consistency",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Date consistency check error: {str(e)}")
            return AnomalyCheck(
                check_name="Date Consistency",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )
    
    async def _validate_format(self, ocr_text: str, extracted_data: Dict) -> AnomalyCheck:
        """Validate certificate format and structure"""
        try:
            # Check for essential certificate components
            required_keywords = [
                "certificate", "university", "college", "degree",
                "awarded", "conferred", "name", "date"
            ]
            
            text_lower = ocr_text.lower()
            keywords_found = sum(1 for keyword in required_keywords if keyword in text_lower)
            keywords_percentage = (keywords_found / len(required_keywords)) * 100
            
            # Check for certificate number format
            has_cert_number = bool(extracted_data.get("certificate_number"))
            
            # Check for proper spacing and structure
            lines = [line for line in ocr_text.split('\n') if line.strip()]
            has_structure = len(lines) >= 5  # Minimum lines for valid certificate
            
            passed = (keywords_percentage >= 40) and has_structure
            confidence = min(keywords_percentage / 100 + 0.2, 0.95)
            
            details = {
                "keywords_found": f"{keywords_found}/{len(required_keywords)}",
                "keywords_percentage": round(keywords_percentage, 1),
                "has_certificate_number": has_cert_number,
                "text_lines": len(lines),
                "has_structure": has_structure
            }
            
            return AnomalyCheck(
                check_name="Format Validation",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Format validation error: {str(e)}")
            return AnomalyCheck(
                check_name="Format Validation",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )
    
    async def _analyze_signatures(self, image_path: str) -> AnomalyCheck:
        """Analyze signatures for authenticity"""
        try:
            if cv2 is None or np is None:
                return AnomalyCheck(
                    check_name="Signature Analysis",
                    passed=True,
                    confidence=0.5,
                    details="OpenCV not available for signature analysis"
                )
            
            img = self._load_image_cv2(image_path, cv2.IMREAD_GRAYSCALE)
            if img is None:
                raise ValueError("Failed to load image for signature analysis")
            
            # Detect dark regions that might be signatures
            _, binary = cv2.threshold(img, 127, 255, cv2.THRESH_BINARY_INV)
            
            # Find contours
            contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            # Filter contours by size (signature-like regions)
            signature_candidates = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if 100 < area < 10000:  # Reasonable signature size
                    x, y, w, h = cv2.boundingRect(contour)
                    aspect_ratio = w / h if h > 0 else 0
                    if 0.5 < aspect_ratio < 5:  # Reasonable aspect ratio
                        signature_candidates.append({
                            "area": area,
                            "aspect_ratio": aspect_ratio,
                            "position": (x, y, w, h)
                        })
            
            signatures_found = len(signature_candidates) > 0
            signature_count = len(signature_candidates)
            
            # Typically certificates have 1-3 signatures
            passed = 1 <= signature_count <= 5
            confidence = 0.6 if passed else 0.4
            
            details = {
                "signatures_detected": signature_count,
                "signatures_found": signatures_found
            }
            
            return AnomalyCheck(
                check_name="Signature Analysis",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Signature analysis error: {str(e)}")
            return AnomalyCheck(
                check_name="Signature Analysis",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )
    
    async def _analyze_metadata(self, image_path: str) -> AnomalyCheck:
        """Analyze image metadata for anomalies"""
        try:
            if Image is None:
                return AnomalyCheck(
                    check_name="Metadata Analysis",
                    passed=True,
                    confidence=0.5,
                    details="PIL not available for metadata analysis"
                )
            
            img = self._load_image(image_path)
            if img is None:
                raise ValueError("Failed to load image")
            
            # Get EXIF data if available
            exif_data = img.getexif() if hasattr(img, 'getexif') else {}
            
            # Check file format
            file_format = img.format
            valid_formats = ['JPEG', 'PNG', 'PDF']
            format_ok = file_format in valid_formats
            
            # Check creation/modification dates from EXIF
            has_suspicious_dates = False
            if exif_data:
                # Check if creation date is in the future
                # EXIF tag 36867 is DateTimeOriginal
                date_original = exif_data.get(36867)
                if date_original:
                    try:
                        creation_date = datetime.strptime(date_original, "%Y:%m:%d %H:%M:%S")
                        if creation_date > datetime.now():
                            has_suspicious_dates = True
                    except:
                        pass
            
            # Check for software used (some editing software might indicate forgery)
            software = exif_data.get(305, "Unknown")  # Software tag
            editing_software = ["photoshop", "gimp", "paint"]
            likely_edited = any(sw in str(software).lower() for sw in editing_software)
            
            passed = format_ok and not has_suspicious_dates
            confidence = 0.7 if passed else 0.4
            
            details = {
                "format": file_format,
                "format_ok": format_ok,
                "has_exif": bool(exif_data),
                "suspicious_dates": has_suspicious_dates,
                "software": str(software),
                "likely_edited": likely_edited
            }
            
            return AnomalyCheck(
                check_name="Metadata Analysis",
                passed=passed,
                confidence=confidence,
                details=str(details)
            )
            
        except Exception as e:
            logger.error(f"Metadata analysis error: {str(e)}")
            return AnomalyCheck(
                check_name="Metadata Analysis",
                passed=True,
                confidence=0.5,
                details=f"Error: {str(e)}"
            )


# Singleton instance
enhanced_ai_service = EnhancedAIService()
