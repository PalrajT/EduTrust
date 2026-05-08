from typing import List, Dict, Tuple
from datetime import datetime

try:
    import cv2
except Exception:
    cv2 = None

try:
    import numpy as np
except Exception:
    np = None

try:
    from PIL import Image
except Exception:
    Image = None

try:
    import torch
except Exception:
    torch = None

from src.core.config import settings
from src.core.logging import logger
from src.schemas.certificate import AnomalyCheck


class AIVerificationService:
    """AI-powered certificate verification service"""
    
    def __init__(self):
        self.confidence_threshold = settings.CONFIDENCE_THRESHOLD
        # Initialize models (placeholder - add actual model loading)
        self.tamper_detection_model = None
        self.font_analysis_model = None
    
    async def verify_certificate(
        self,
        image_path: str,
        ocr_text: str,
        extracted_data: Dict
    ) -> Tuple[bool, List[AnomalyCheck], float]:
        """
        Comprehensive certificate verification
        Returns: (is_authentic, anomaly_checks, confidence_score)
        """
        anomaly_checks = []
        
        # Run all verification checks
        checks = [
            await self._check_image_quality(image_path),
            await self._check_tamper_detection(image_path),
            await self._check_font_consistency(image_path),
            await self._check_seal_presence(image_path),
            await self._check_watermark(image_path),
            await self._check_text_alignment(image_path, ocr_text),
            await self._check_metadata(image_path),
        ]
        
        anomaly_checks.extend(checks)
        
        # Calculate overall confidence
        passed_checks = sum(1 for check in anomaly_checks if check.status)
        total_checks = len(anomaly_checks)
        confidence_score = passed_checks / total_checks if total_checks > 0 else 0
        
        # Determine if authentic
        is_authentic = confidence_score >= self.confidence_threshold
        
        logger.info(f"Verification complete: authentic={is_authentic}, confidence={confidence_score:.2%}")
        
        return is_authentic, anomaly_checks, confidence_score
    
    async def _check_image_quality(self, image_path: str) -> AnomalyCheck:
        """Check image quality (resolution, blur, etc.)"""
        if cv2 is None:
            return AnomalyCheck(
                check_name="Image Quality",
                status=False,
                confidence=0.0,
                details="OpenCV not installed"
            )

        try:
            img = cv2.imread(image_path)
            if img is None:
                raise RuntimeError("Unable to read image")
            height, width = img.shape[:2]
            
            # Check resolution
            min_resolution = 800 * 600
            actual_resolution = height * width
            
            # Check for blur using Laplacian variance
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            is_good_quality = (
                actual_resolution >= min_resolution and
                laplacian_var > 100  # Threshold for blur detection
            )
            
            confidence = min(
                actual_resolution / min_resolution,
                laplacian_var / 500
            )
            confidence = min(confidence, 1.0)
            
            return AnomalyCheck(
                check_name="Image Quality",
                status=is_good_quality,
                confidence=confidence,
                details=f"Resolution: {width}x{height}, Sharpness: {laplacian_var:.2f}"
            )
        except Exception as e:
            logger.error(f"Error checking image quality: {e}")
            return AnomalyCheck(
                check_name="Image Quality",
                status=False,
                confidence=0.0,
                details=f"Error: {str(e)}"
            )
    
    async def _check_tamper_detection(self, image_path: str) -> AnomalyCheck:
        """Detect image tampering using Error Level Analysis"""
        if Image is None or cv2 is None or np is None:
            return AnomalyCheck(
                check_name="Tamper Detection",
                status=False,
                confidence=0.0,
                details="Required libraries for tamper detection not installed"
            )

        try:
            # Error Level Analysis (ELA)
            img = Image.open(image_path)
            
            # Save at different quality and compare
            temp_path = image_path.replace('.jpg', '_temp.jpg')
            img.save(temp_path, 'JPEG', quality=90)
            
            # Load both images
            original = cv2.imread(image_path)
            compressed = cv2.imread(temp_path)
            
            # Calculate difference
            diff = cv2.absdiff(original, compressed)
            diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
            
            # Calculate mean difference
            mean_diff = np.mean(diff_gray)
            
            # Clean up
            import os
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            # Lower mean difference suggests no tampering
            is_authentic = mean_diff < 15
            confidence = 1.0 - (mean_diff / 50)
            confidence = max(0.0, min(confidence, 1.0))
            
            return AnomalyCheck(
                check_name="Tamper Detection",
                status=is_authentic,
                confidence=confidence,
                details=f"ELA score: {mean_diff:.2f}"
            )
        except Exception as e:
            logger.error(f"Error in tamper detection: {e}")
            return AnomalyCheck(
                check_name="Tamper Detection",
                status=True,
                confidence=0.5,
                details="Analysis inconclusive"
            )
    
    async def _check_font_consistency(self, image_path: str) -> AnomalyCheck:
        """Check font consistency across the certificate"""
        if cv2 is None or np is None:
            return AnomalyCheck(
                check_name="Font Consistency",
                status=False,
                confidence=0.0,
                details="OpenCV/numpy not installed"
            )

        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Detect edges
            edges = cv2.Canny(img, 50, 150)
            
            # Find contours
            contours, _ = cv2.findContours(
                edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )
            
            # Analyze contour properties for consistency
            if len(contours) < 10:
                return AnomalyCheck(
                    check_name="Font Consistency",
                    status=False,
                    confidence=0.3,
                    details="Insufficient text detected"
                )
            
            # Calculate variance in contour areas (simpler approach)
            areas = [cv2.contourArea(c) for c in contours if cv2.contourArea(c) > 10]
            if not areas:
                return AnomalyCheck(
                    check_name="Font Consistency",
                    status=False,
                    confidence=0.3,
                    details="No valid text regions found"
                )
            
            variance = np.var(areas)
            mean_area = np.mean(areas)
            coefficient_of_variation = (np.sqrt(variance) / mean_area) if mean_area > 0 else 0
            
            # Lower CV suggests more consistent fonts
            is_consistent = coefficient_of_variation < 1.5
            confidence = 1.0 - min(coefficient_of_variation / 3, 1.0)
            
            return AnomalyCheck(
                check_name="Font Consistency",
                status=is_consistent,
                confidence=confidence,
                details=f"Font variation coefficient: {coefficient_of_variation:.2f}"
            )
        except Exception as e:
            logger.error(f"Error checking font consistency: {e}")
            return AnomalyCheck(
                check_name="Font Consistency",
                status=True,
                confidence=0.6,
                details="Analysis inconclusive"
            )
    
    async def _check_seal_presence(self, image_path: str) -> AnomalyCheck:
        """Detect presence of official seals/stamps"""
        if cv2 is None:
            return AnomalyCheck(
                check_name="Seal Presence",
                status=False,
                confidence=0.0,
                details="OpenCV not installed"
            )

        try:
            img = cv2.imread(image_path)
            if img is None:
                raise RuntimeError("Unable to read image")
            hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
            
            # Detect circular shapes (seals are usually circular)
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            gray = cv2.medianBlur(gray, 5)
            
            circles = cv2.HoughCircles(
                gray,
                cv2.HOUGH_GRADIENT,
                dp=1,
                minDist=100,
                param1=50,
                param2=30,
                minRadius=20,
                maxRadius=150
            )
            
            has_seal = circles is not None and len(circles[0]) > 0
            confidence = 0.9 if has_seal else 0.3
            
            return AnomalyCheck(
                check_name="Seal Presence",
                status=has_seal,
                confidence=confidence,
                details=f"Detected {len(circles[0]) if has_seal else 0} potential seals"
            )
        except Exception as e:
            logger.error(f"Error checking seal presence: {e}")
            return AnomalyCheck(
                check_name="Seal Presence",
                status=False,
                confidence=0.5,
                details="Analysis inconclusive"
            )
    
    async def _check_watermark(self, image_path: str) -> AnomalyCheck:
        """Detect watermark presence"""
        if cv2 is None or np is None:
            return AnomalyCheck(
                check_name="Watermark Detection",
                status=False,
                confidence=0.0,
                details="OpenCV/numpy not installed"
            )

        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Apply FFT to detect watermark patterns
            f = np.fft.fft2(img)
            fshift = np.fft.fftshift(f)
            magnitude_spectrum = 20 * np.log(np.abs(fshift) + 1)
            
            # Check for repeating patterns (simplified)
            mean_magnitude = np.mean(magnitude_spectrum)
            std_magnitude = np.std(magnitude_spectrum)
            
            # High standard deviation might indicate watermark patterns
            has_watermark = std_magnitude > mean_magnitude * 0.3
            confidence = min(std_magnitude / (mean_magnitude * 0.5), 1.0) if has_watermark else 0.4
            
            return AnomalyCheck(
                check_name="Watermark Detection",
                status=has_watermark,
                confidence=confidence,
                details=f"Pattern complexity: {std_magnitude/mean_magnitude:.2f}"
            )
        except Exception as e:
            logger.error(f"Error checking watermark: {e}")
            return AnomalyCheck(
                check_name="Watermark Detection",
                status=False,
                confidence=0.5,
                details="Analysis inconclusive"
            )
    
    async def _check_text_alignment(self, image_path: str, ocr_text: str) -> AnomalyCheck:
        """Check text alignment and structure"""
        if cv2 is None:
            return AnomalyCheck(
                check_name="Text Alignment",
                status=False,
                confidence=0.0,
                details="OpenCV not installed"
            )

        try:
            img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
            
            # Detect horizontal lines
            horizontal_kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (40, 1))
            detect_horizontal = cv2.morphologyEx(
                img, cv2.MORPH_OPEN, horizontal_kernel, iterations=2
            )
            
            # Count horizontal lines (should be consistent in genuine certificates)
            contours, _ = cv2.findContours(
                detect_horizontal, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )
            
            num_lines = len(contours)
            is_aligned = num_lines > 3  # Proper certificates have multiple aligned text lines
            confidence = min(num_lines / 10, 1.0)
            
            return AnomalyCheck(
                check_name="Text Alignment",
                status=is_aligned,
                confidence=confidence,
                details=f"Detected {num_lines} aligned text lines"
            )
        except Exception as e:
            logger.error(f"Error checking text alignment: {e}")
            return AnomalyCheck(
                check_name="Text Alignment",
                status=True,
                confidence=0.6,
                details="Analysis inconclusive"
            )
    
    async def _check_metadata(self, image_path: str) -> AnomalyCheck:
        """Check image metadata for suspicious modifications"""
        try:
            if Image is None:
                return AnomalyCheck(
                    check_name="Metadata Check",
                    status=False,
                    confidence=0.0,
                    details="Pillow not installed"
                )

            from PIL.ExifTags import TAGS

            img = Image.open(image_path)
            exif_data = img._getexif()

            if not exif_data:
                return AnomalyCheck(
                    check_name="Metadata Check",
                    status=False,
                    confidence=0.4,
                    details="No EXIF data found"
                )

            # Check for modification software
            metadata = {}
            for tag_id, value in exif_data.items():
                tag = TAGS.get(tag_id, tag_id)
                metadata[tag] = value

            suspicious_software = ['photoshop', 'gimp', 'paint', 'editor']
            software = str(metadata.get('Software', '')).lower()

            has_suspicious = any(s in software for s in suspicious_software)

            return AnomalyCheck(
                check_name="Metadata Check",
                status=not has_suspicious,
                confidence=0.7 if not has_suspicious else 0.3,
                details=f"Software: {software if software else 'Unknown'}"
            )
        except Exception as e:
            logger.error(f"Error checking metadata: {e}")
            return AnomalyCheck(
                check_name="Metadata Check",
                status=True,
                confidence=0.5,
                details="No metadata available"
            )


# Singleton instance
ai_verification_service = AIVerificationService()
