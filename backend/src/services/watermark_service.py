"""
Digital Watermark Detection Service with OCR Integration

This service provides comprehensive watermark detection and verification
capabilities, including:
- Visible watermark detection using OCR (Tesseract)
- Invisible watermark detection using frequency domain analysis
- Watermark authenticity verification
- Watermark extraction and decoding
"""

import os
import hashlib
import json
from typing import Dict, Optional, Tuple, List, Any
from datetime import datetime

from src.core.logging import logger
from src.core.config import settings

# Optional heavy dependencies
try:
    import pytesseract
except Exception:
    pytesseract = None

try:
    from PIL import Image, ImageEnhance, ImageFilter
except Exception:
    Image = None
    ImageEnhance = None
    ImageFilter = None

try:
    import cv2
except Exception:
    cv2 = None

try:
    import numpy as np
except Exception:
    np = None

# PDF handling
try:
    import pdf2image
    PDF_SUPPORT = True
except Exception:
    PDF_SUPPORT = False
    np = None


class WatermarkService:
    """
    Service for detecting and verifying digital watermarks in certificates.
    Supports both visible (OCR-based) and invisible (frequency-based) watermarks.
    """
    
    def __init__(self):
        """Initialize watermark service"""
        self.visible_watermark_keywords = [
            "watermark", "authentic", "verified", "official", "original",
            "certified", "genuine", "issued by", "authorized", "valid"
        ]
        
        # Configure Tesseract
        if pytesseract and hasattr(settings, 'TESSERACT_CMD'):
            try:
                pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
            except Exception:
                pass
    
    def _convert_pdf_to_image(self, pdf_path: str):
        """
        Convert PDF to image (first page only).
        
        Args:
            pdf_path: Path to PDF file
            
        Returns:
            PIL Image object or None if conversion fails
        """
        if not PDF_SUPPORT:
            logger.error("PDF support not available - install pdf2image and poppler")
            return None
        
        try:
            from pdf2image import convert_from_path
            
            # Check if file exists
            if not os.path.exists(pdf_path):
                logger.error(f"PDF file not found: {pdf_path}")
                return None
            
            # Get absolute path
            abs_path = os.path.abspath(pdf_path)
            logger.info(f"Converting PDF for watermark detection: {abs_path}")
            
            # Get poppler path from settings if configured
            poppler_path = getattr(settings, 'POPPLER_PATH', None)
            if poppler_path and not os.path.exists(poppler_path):
                logger.warning(f"Configured POPPLER_PATH does not exist: {poppler_path}")
                poppler_path = None
            
            pdf_dpi = getattr(settings, 'PDF_DPI', 150)  # Default 150 for speed
            
            # Convert first page only
            images = convert_from_path(
                abs_path,
                first_page=1,
                last_page=1,
                dpi=pdf_dpi,
                fmt='png',
                poppler_path=poppler_path if poppler_path else None
            )
            
            if images:
                logger.info(f"Successfully converted PDF: {os.path.basename(pdf_path)}")
                return images[0]
            else:
                logger.error(f"No pages found in PDF: {pdf_path}")
                return None
                
        except Exception as e:
            logger.error(f"Error converting PDF to image: {pdf_path}")
            logger.error(f"Exception details: {type(e).__name__}: {str(e)}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return None
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
                logger.info(f"Converting PDF to image: {image_path}")
                return self._convert_pdf_to_image(image_path)
            else:
                return Image.open(image_path)
                
        except Exception as e:
            logger.error(f"Error loading image: {e}")
            return None
    
    async def detect_watermark(
        self,
        image_path: str,
        detect_visible: bool = True,
        detect_invisible: bool = True
    ) -> Dict[str, Any]:
        """
        Comprehensive watermark detection.
        
        Args:
            image_path: Path to the certificate image
            detect_visible: Whether to detect visible watermarks using OCR
            detect_invisible: Whether to detect invisible watermarks using frequency analysis
            
        Returns:
            Dictionary containing watermark detection results
        """
        results = {
            "has_watermark": False,
            "watermark_type": None,
            "visible_watermark": None,
            "invisible_watermark": None,
            "confidence": 0.0,
            "details": {}
        }
        
        try:
            if detect_visible:
                visible_result = await self.detect_visible_watermark(image_path)
                if visible_result["detected"]:
                    results["has_watermark"] = True
                    results["watermark_type"] = "visible"
                    results["visible_watermark"] = visible_result
                    results["confidence"] = max(results["confidence"], visible_result["confidence"])
            
            if detect_invisible:
                invisible_result = await self.detect_invisible_watermark(image_path)
                if invisible_result["detected"]:
                    results["has_watermark"] = True
                    if results["watermark_type"] == "visible":
                        results["watermark_type"] = "both"
                    else:
                        results["watermark_type"] = "invisible"
                    results["invisible_watermark"] = invisible_result
                    results["confidence"] = max(results["confidence"], invisible_result["confidence"])
            
            results["details"] = {
                "timestamp": datetime.utcnow().isoformat(),
                "image_path": image_path,
                "detection_methods": []
            }
            
            if detect_visible:
                results["details"]["detection_methods"].append("OCR-based visible detection")
            if detect_invisible:
                results["details"]["detection_methods"].append("Frequency-based invisible detection")
            
            logger.info(f"Watermark detection completed: {results['watermark_type'] or 'none'} detected")
            
            return results
            
        except Exception as e:
            logger.error(f"Error detecting watermark: {e}")
            raise
    
    async def detect_visible_watermark(self, image_path: str) -> Dict[str, Any]:
        """
        Detect visible watermarks using OCR (Tesseract).
        
        This method extracts text from the image and searches for common
        watermark patterns and keywords.
        
        Args:
            image_path: Path to the certificate image
            
        Returns:
            Dictionary with visible watermark detection results
        """
        if pytesseract is None or Image is None:
            logger.warning("Tesseract or PIL not available for visible watermark detection")
            return {
                "detected": False,
                "confidence": 0.0,
                "text": None,
                "method": "OCR"
            }
        
        try:
            # Load and preprocess image for watermark detection
            img = self._load_image(image_path)
            if img is None:
                raise ValueError(f"Failed to load image: {image_path}")
            
            # Create multiple enhanced versions to detect faint watermarks
            enhanced_images = await self._create_enhanced_versions(img)
            
            watermark_texts = []
            max_confidence = 0.0
            
            for enhanced_img in enhanced_images:
                # Extract text using OCR
                try:
                    # Get detailed OCR data
                    ocr_data = pytesseract.image_to_data(
                        enhanced_img,
                        lang='eng',
                        output_type=pytesseract.Output.DICT,
                        config='--psm 11'  # Sparse text detection
                    )
                    
                    # Extract text with confidence
                    texts = ocr_data.get('text', [])
                    confidences = ocr_data.get('conf', [])
                    
                    for text, conf in zip(texts, confidences):
                        if text.strip() and conf and int(conf) > 30:
                            text_lower = text.lower()
                            # Check if text matches watermark keywords
                            if any(keyword in text_lower for keyword in self.visible_watermark_keywords):
                                watermark_texts.append({
                                    "text": text.strip(),
                                    "confidence": int(conf) / 100.0
                                })
                                max_confidence = max(max_confidence, int(conf) / 100.0)
                
                except Exception as e:
                    logger.debug(f"OCR extraction error on enhanced image: {e}")
                    continue
            
            # Check for diagonal/rotated watermarks
            diagonal_result = await self._detect_diagonal_watermark(img)
            if diagonal_result["detected"]:
                watermark_texts.extend(diagonal_result["texts"])
                max_confidence = max(max_confidence, diagonal_result["confidence"])
            
            detected = len(watermark_texts) > 0
            
            return {
                "detected": detected,
                "confidence": max_confidence,
                "texts": watermark_texts if detected else [],
                "method": "OCR",
                "total_matches": len(watermark_texts)
            }
            
        except Exception as e:
            logger.error(f"Error detecting visible watermark: {e}")
            return {
                "detected": False,
                "confidence": 0.0,
                "texts": [],
                "method": "OCR",
                "error": str(e)
            }
    
    async def _create_enhanced_versions(self, img: Any) -> List[Any]:
        """
        Create multiple enhanced versions of the image to detect faint watermarks.
        
        Args:
            img: PIL Image object
            
        Returns:
            List of enhanced PIL Image objects
        """
        if Image is None or ImageEnhance is None or ImageFilter is None:
            return [img]
        
        enhanced_versions = [img]  # Original
        
        try:
            # Convert to grayscale
            gray = img.convert('L')
            enhanced_versions.append(gray)
            
            # High contrast version
            enhancer = ImageEnhance.Contrast(gray)
            high_contrast = enhancer.enhance(2.5)
            enhanced_versions.append(high_contrast)
            
            # Brightness adjusted
            enhancer = ImageEnhance.Brightness(gray)
            bright = enhancer.enhance(1.5)
            enhanced_versions.append(bright)
            
            # Edge enhancement
            edges = gray.filter(ImageFilter.EDGE_ENHANCE_MORE)
            enhanced_versions.append(edges)
            
            # Sharpen
            sharp = gray.filter(ImageFilter.SHARPEN)
            enhanced_versions.append(sharp)
            
            # Threshold (binarization)
            threshold = gray.point(lambda p: 255 if p > 128 else 0)
            enhanced_versions.append(threshold)
            
        except Exception as e:
            logger.debug(f"Error creating enhanced versions: {e}")
        
        return enhanced_versions
    
    async def _detect_diagonal_watermark(self, img: Any) -> Dict[str, Any]:
        """
        Detect diagonal or rotated watermarks by rotating the image.
        
        Args:
            img: PIL Image object
            
        Returns:
            Dictionary with diagonal watermark detection results
        """
        if pytesseract is None or Image is None:
            return {"detected": False, "texts": [], "confidence": 0.0}
        
        watermark_texts = []
        max_confidence = 0.0
        
        try:
            # Try common diagonal angles
            angles = [45, -45, 30, -30, 60, -60]
            
            for angle in angles:
                try:
                    # Rotate image
                    rotated = img.rotate(angle, expand=True, fillcolor='white')
                    
                    # Convert to grayscale and enhance
                    gray = rotated.convert('L')
                    enhancer = ImageEnhance.Contrast(gray)
                    enhanced = enhancer.enhance(2.0)
                    
                    # OCR
                    ocr_data = pytesseract.image_to_data(
                        enhanced,
                        lang='eng',
                        output_type=pytesseract.Output.DICT,
                        config='--psm 6'
                    )
                    
                    texts = ocr_data.get('text', [])
                    confidences = ocr_data.get('conf', [])
                    
                    for text, conf in zip(texts, confidences):
                        if text.strip() and conf and int(conf) > 40:
                            text_lower = text.lower()
                            if any(keyword in text_lower for keyword in self.visible_watermark_keywords):
                                watermark_texts.append({
                                    "text": text.strip(),
                                    "confidence": int(conf) / 100.0,
                                    "angle": angle
                                })
                                max_confidence = max(max_confidence, int(conf) / 100.0)
                
                except Exception as e:
                    logger.debug(f"Error detecting diagonal watermark at {angle}°: {e}")
                    continue
        
        except Exception as e:
            logger.debug(f"Error in diagonal watermark detection: {e}")
        
        return {
            "detected": len(watermark_texts) > 0,
            "texts": watermark_texts,
            "confidence": max_confidence
        }
    
    async def detect_invisible_watermark(self, image_path: str) -> Dict[str, Any]:
        """
        Detect invisible watermarks using frequency domain analysis (DCT/DFT).
        
        This method analyzes the frequency components of the image to detect
        embedded watermarks that are not visible to the human eye.
        
        Args:
            image_path: Path to the certificate image
            
        Returns:
            Dictionary with invisible watermark detection results
        """
        if cv2 is None or np is None:
            logger.warning("OpenCV or NumPy not available for invisible watermark detection")
            return {
                "detected": False,
                "confidence": 0.0,
                "method": "Frequency Analysis"
            }
        
        try:
            # Check if PDF and convert first
            file_ext = os.path.splitext(image_path)[1].lower()
            if file_ext == '.pdf':
                logger.info(f"Converting PDF for frequency analysis: {image_path}")
                pil_img = self._convert_pdf_to_image(image_path)
                if pil_img is None:
                    raise ValueError("Failed to convert PDF to image")
                # Convert PIL image to numpy array for cv2
                img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2GRAY)
            else:
                # Load image directly with cv2
                img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
                if img is None:
                    raise ValueError("Failed to load image")
            
            # Perform DCT (Discrete Cosine Transform)
            dct_result = await self._analyze_dct(img)
            
            # Perform DFT (Discrete Fourier Transform)
            dft_result = await self._analyze_dft(img)
            
            # Combine results
            detected = dct_result["anomaly_detected"] or dft_result["anomaly_detected"]
            confidence = max(dct_result["confidence"], dft_result["confidence"])
            
            return {
                "detected": detected,
                "confidence": confidence,
                "method": "Frequency Analysis",
                "dct_analysis": dct_result,
                "dft_analysis": dft_result
            }
            
        except Exception as e:
            logger.error(f"Error detecting invisible watermark: {e}")
            return {
                "detected": False,
                "confidence": 0.0,
                "method": "Frequency Analysis",
                "error": str(e)
            }
    
    async def _analyze_dct(self, img: Any) -> Dict[str, Any]:
        """
        Analyze image using Discrete Cosine Transform to detect watermarks.
        
        Args:
            img: Grayscale image (numpy array)
            
        Returns:
            Dictionary with DCT analysis results
        """
        if cv2 is None or np is None:
            return {"anomaly_detected": False, "confidence": 0.0}
        
        try:
            # Convert to float32
            img_float = np.float32(img)
            
            # Apply DCT
            dct = cv2.dct(img_float)
            
            # Analyze mid-frequency coefficients (where watermarks are typically embedded)
            h, w = dct.shape
            mid_freq_region = dct[h//4:3*h//4, w//4:3*w//4]
            
            # Calculate statistics
            mean = np.mean(np.abs(mid_freq_region))
            std = np.std(np.abs(mid_freq_region))
            max_val = np.max(np.abs(mid_freq_region))
            
            # Detect anomalies (unusual patterns in mid-frequencies)
            # Watermarks typically cause higher variance in these regions
            threshold = mean + 2 * std
            anomalies = np.sum(np.abs(mid_freq_region) > threshold)
            anomaly_ratio = anomalies / mid_freq_region.size
            
            # Consider watermark detected if anomaly ratio > 5%
            detected = anomaly_ratio > 0.05
            confidence = min(anomaly_ratio * 10, 0.95)  # Scale to 0-0.95
            
            return {
                "anomaly_detected": detected,
                "confidence": confidence,
                "anomaly_ratio": anomaly_ratio,
                "statistics": {
                    "mean": float(mean),
                    "std": float(std),
                    "max": float(max_val)
                }
            }
            
        except Exception as e:
            logger.debug(f"DCT analysis error: {e}")
            return {"anomaly_detected": False, "confidence": 0.0}
    
    async def _analyze_dft(self, img: Any) -> Dict[str, Any]:
        """
        Analyze image using Discrete Fourier Transform to detect watermarks.
        
        Args:
            img: Grayscale image (numpy array)
            
        Returns:
            Dictionary with DFT analysis results
        """
        if cv2 is None or np is None:
            return {"anomaly_detected": False, "confidence": 0.0}
        
        try:
            # Apply DFT
            dft = cv2.dft(np.float32(img), flags=cv2.DFT_COMPLEX_OUTPUT)
            dft_shift = np.fft.fftshift(dft)
            
            # Calculate magnitude spectrum
            magnitude = cv2.magnitude(dft_shift[:,:,0], dft_shift[:,:,1])
            
            # Analyze spectrum for patterns
            h, w = magnitude.shape
            center_region = magnitude[h//4:3*h//4, w//4:3*w//4]
            
            # Calculate statistics
            mean = np.mean(center_region)
            std = np.std(center_region)
            
            # Detect periodic patterns (indication of watermark)
            # Look for peaks in the spectrum
            threshold = mean + 3 * std
            peaks = np.sum(center_region > threshold)
            peak_ratio = peaks / center_region.size
            
            # Watermark typically creates regular patterns
            detected = peak_ratio > 0.01
            confidence = min(peak_ratio * 50, 0.90)
            
            return {
                "anomaly_detected": detected,
                "confidence": confidence,
                "peak_ratio": peak_ratio,
                "statistics": {
                    "mean": float(mean),
                    "std": float(std)
                }
            }
            
        except Exception as e:
            logger.debug(f"DFT analysis error: {e}")
            return {"anomaly_detected": False, "confidence": 0.0}
    
    async def verify_watermark_authenticity(
        self,
        image_path: str,
        expected_watermark: Optional[str] = None,
        expected_hash: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Verify if the detected watermark matches expected values.
        
        Args:
            image_path: Path to the certificate image
            expected_watermark: Expected watermark text
            expected_hash: Expected watermark hash
            
        Returns:
            Dictionary with verification results
        """
        try:
            # Detect watermark
            detection_result = await self.detect_watermark(image_path)
            
            if not detection_result["has_watermark"]:
                return {
                    "verified": False,
                    "reason": "No watermark detected",
                    "confidence": 0.0
                }
            
            verified = False
            confidence = detection_result["confidence"]
            reasons = []
            
            # Check visible watermark text
            if expected_watermark and detection_result.get("visible_watermark"):
                visible = detection_result["visible_watermark"]
                if visible.get("texts"):
                    detected_texts = [t["text"] for t in visible["texts"]]
                    if any(expected_watermark.lower() in text.lower() for text in detected_texts):
                        verified = True
                        reasons.append("Visible watermark text matches")
                    else:
                        reasons.append("Visible watermark text does not match")
            
            # Check watermark hash
            if expected_hash:
                watermark_data = json.dumps(detection_result, sort_keys=True)
                computed_hash = hashlib.sha256(watermark_data.encode()).hexdigest()
                if computed_hash == expected_hash:
                    verified = True
                    reasons.append("Watermark hash matches")
                else:
                    reasons.append("Watermark hash does not match")
            
            # If no expected values provided, just check if watermark exists
            if not expected_watermark and not expected_hash:
                verified = detection_result["has_watermark"]
                reasons.append("Watermark detected (no validation criteria provided)")
            
            return {
                "verified": verified,
                "confidence": confidence,
                "reasons": reasons,
                "detection_result": detection_result
            }
            
        except Exception as e:
            logger.error(f"Error verifying watermark: {e}")
            return {
                "verified": False,
                "reason": f"Verification error: {str(e)}",
                "confidence": 0.0
            }
    
    async def extract_watermark_metadata(self, image_path: str) -> Dict[str, Any]:
        """
        Extract metadata from embedded watermark.
        
        Args:
            image_path: Path to the certificate image
            
        Returns:
            Dictionary with watermark metadata
        """
        try:
            detection_result = await self.detect_watermark(image_path)
            
            metadata = {
                "has_watermark": detection_result["has_watermark"],
                "watermark_type": detection_result["watermark_type"],
                "extracted_at": datetime.utcnow().isoformat(),
                "data": {}
            }
            
            # Extract visible watermark metadata
            if detection_result.get("visible_watermark"):
                visible = detection_result["visible_watermark"]
                metadata["data"]["visible"] = {
                    "texts": visible.get("texts", []),
                    "confidence": visible.get("confidence", 0.0),
                    "method": visible.get("method")
                }
            
            # Extract invisible watermark metadata
            if detection_result.get("invisible_watermark"):
                invisible = detection_result["invisible_watermark"]
                metadata["data"]["invisible"] = {
                    "detected": invisible.get("detected", False),
                    "confidence": invisible.get("confidence", 0.0),
                    "method": invisible.get("method")
                }
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error extracting watermark metadata: {e}")
            return {
                "has_watermark": False,
                "error": str(e)
            }


# Global service instance
watermark_service = WatermarkService()
