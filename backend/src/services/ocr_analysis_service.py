"""
Comprehensive OCR Analysis Service

Provides detailed OCR-based analysis and reporting for certificate verification.
"""

import os
import re
from typing import Dict, Any, List, Tuple, Optional
from PIL import Image
from datetime import datetime

from src.core.logging import logger
from src.core.config import settings

# Optional dependencies
try:
    import pytesseract
except Exception:
    pytesseract = None

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
    logger.warning("pdf2image not available - PDF support disabled")


class OCRAnalysisService:
    """
    Service for comprehensive OCR-based analysis of certificate images.
    Provides detailed reports on image quality, text extraction, and field detection.
    """
    
    def __init__(self):
        """Initialize OCR analysis service"""
        if pytesseract and hasattr(settings, 'TESSERACT_CMD'):
            try:
                pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
            except Exception:
                pass
    
    def _convert_pdf_to_image(self, pdf_path: str) -> Optional[Image.Image]:
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
            logger.info(f"Converting PDF to image: {abs_path}")
            
            # Get poppler path from settings if configured
            poppler_path = getattr(settings, 'POPPLER_PATH', None)
            if poppler_path and not os.path.exists(poppler_path):
                logger.warning(f"Configured POPPLER_PATH does not exist: {poppler_path}")
                poppler_path = None
            
            pdf_dpi = getattr(settings, 'PDF_DPI', 150)  # Default 150 for speed
            
            # Convert first page only (certificates are usually single page)
            try:
                images = convert_from_path(
                    abs_path, 
                    first_page=1, 
                    last_page=1, 
                    dpi=pdf_dpi,
                    fmt='png',
                    poppler_path=poppler_path if poppler_path else None
                )
            except Exception as e:
                if "poppler" in str(e).lower():
                    logger.error("Poppler is not installed or not in PATH!")
                    logger.error("Please install poppler-utils:")
                    logger.error("  - Windows: Download from https://github.com/oschwartz10612/poppler-windows/releases/")
                    logger.error("  - Linux: sudo apt-get install poppler-utils")
                    logger.error("  - macOS: brew install poppler")
                    logger.error("Or set POPPLER_PATH in .env to the poppler bin directory")
                raise
            
            if images:
                logger.info(f"Successfully converted PDF to image: {os.path.basename(pdf_path)}")
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
    
    async def analyze_image(self, image_path: str) -> Dict[str, Any]:
        """
        Comprehensive image analysis.
        
        Args:
            image_path: Path to the certificate image or PDF
            
        Returns:
            Dictionary with detailed image analysis
        """
        try:
            # Get file information
            file_stats = os.stat(image_path)
            file_name = os.path.basename(image_path)
            file_size = file_stats.st_size
            file_format = os.path.splitext(file_name)[1][1:].upper()
            
            # Handle PDF files
            if file_format.upper() == 'PDF':
                logger.info(f"Processing PDF file: {file_name}")
                img = self._convert_pdf_to_image(image_path)
                if img is None:
                    raise ValueError(f"Failed to convert PDF to image: {file_name}")
                # Update format to indicate it was converted from PDF
                original_format = file_format
                file_format = "PDF->PNG"
            else:
                # Open image with PIL
                img = Image.open(image_path)
            
            # Get dimensions
            width, height = img.size
            dimensions = {"width": width, "height": height}
            
            # Get resolution (DPI)
            resolution = None
            if hasattr(img, 'info') and 'dpi' in img.info:
                dpi = img.info['dpi']
                resolution = {"horizontal": dpi[0], "vertical": dpi[1]}
            
            # Get color mode
            color_mode = img.mode
            
            # Check transparency
            has_transparency = img.mode in ('RGBA', 'LA', 'P') and 'transparency' in img.info
            
            # Get compression type if available
            compression_type = img.info.get('compression', None)
            
            # Calculate quality score based on resolution and size
            quality_score = self._calculate_image_quality(img, file_size)
            
            # Extract metadata
            metadata = {}
            if hasattr(img, 'info'):
                for key, value in img.info.items():
                    if isinstance(value, (str, int, float, bool)):
                        # Convert all keys to strings for MongoDB compatibility
                        metadata[str(key)] = value
            
            # Get EXIF data if available
            try:
                exif_data = img._getexif()
                if exif_data:
                    # Convert all EXIF keys to strings for MongoDB compatibility
                    metadata['exif'] = {str(k): str(v)[:100] for k, v in exif_data.items() if isinstance(v, (str, int, float))}
            except Exception:
                pass
            
            return {
                "file_name": file_name,
                "file_size": file_size,
                "file_format": file_format,
                "dimensions": dimensions,
                "resolution": resolution,
                "color_mode": color_mode,
                "quality_score": quality_score,
                "has_transparency": has_transparency,
                "compression_type": compression_type,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Error analyzing image: {e}")
            raise
    
    def _calculate_image_quality(self, img: Image.Image, file_size: int) -> float:
        """
        Calculate image quality score.
        
        Args:
            img: PIL Image object
            file_size: File size in bytes
            
        Returns:
            Quality score between 0 and 1
        """
        width, height = img.size
        pixels = width * height
        
        # Resolution score (based on pixel count)
        if pixels >= 1920 * 1080:  # Full HD or higher
            resolution_score = 1.0
        elif pixels >= 1280 * 720:  # HD
            resolution_score = 0.8
        elif pixels >= 800 * 600:  # Standard
            resolution_score = 0.6
        else:  # Low resolution
            resolution_score = 0.4
        
        # Compression score (based on file size per pixel)
        bytes_per_pixel = file_size / pixels if pixels > 0 else 0
        if bytes_per_pixel > 3:  # High quality
            compression_score = 1.0
        elif bytes_per_pixel > 1:  # Medium quality
            compression_score = 0.7
        else:  # Heavy compression
            compression_score = 0.4
        
        # Combined score
        quality_score = (resolution_score * 0.6 + compression_score * 0.4)
        
        return round(quality_score, 2)
    
    async def perform_comprehensive_ocr(
        self,
        image_path: str,
        language: str = "eng"
    ) -> Dict[str, Any]:
        """
        Perform comprehensive OCR analysis.
        
        Args:
            image_path: Path to the certificate image or PDF
            language: OCR language(s)
            
        Returns:
            Dictionary with detailed OCR analysis
        """
        if pytesseract is None:
            raise RuntimeError("pytesseract is required for OCR analysis")
        
        try:
            # Check if PDF and convert
            file_ext = os.path.splitext(image_path)[1].lower()
            if file_ext == '.pdf':
                logger.info(f"Converting PDF for OCR: {image_path}")
                img = self._convert_pdf_to_image(image_path)
                if img is None:
                    raise ValueError(f"Failed to convert PDF to image for OCR")
            else:
                # Load image
                img = Image.open(image_path)
            
            # Perform OCR with detailed data
            ocr_data = pytesseract.image_to_data(
                img,
                lang=language,
                output_type=pytesseract.Output.DICT
            )
            
            # Get full text
            raw_text = pytesseract.image_to_string(img, lang=language)
            
            # Clean text
            cleaned_text = self._clean_text(raw_text)
            
            # Get word and line counts
            words = [w for w in ocr_data.get('text', []) if w.strip()]
            word_count = len(words)
            line_count = len(set(ocr_data.get('line_num', []))) if ocr_data.get('line_num') else 0
            
            # Calculate average confidence
            confidences = [int(c) for c in ocr_data.get('conf', []) if c and int(c) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0
            
            # Detect language
            detected_language, language_confidence = await self._detect_language(cleaned_text)
            
            # Extract text regions
            text_regions = self._extract_text_regions(ocr_data)
            
            # Detect fonts (heuristic)
            fonts_detected = self._detect_fonts(ocr_data)
            
            # Determine text orientation
            text_orientation = self._determine_orientation(ocr_data)
            
            # Calculate reading order score
            reading_order_score = self._calculate_reading_order_score(ocr_data)
            
            return {
                "raw_text": raw_text,
                "cleaned_text": cleaned_text,
                "word_count": word_count,
                "line_count": line_count,
                "confidence": avg_confidence / 100.0,
                "detected_language": detected_language,
                "language_confidence": language_confidence,
                "text_regions": text_regions,
                "fonts_detected": fonts_detected,
                "text_orientation": text_orientation,
                "reading_order_score": reading_order_score
            }
            
        except Exception as e:
            logger.error(f"Error performing OCR analysis: {e}")
            raise
    
    def _clean_text(self, text: str) -> str:
        """Clean OCR text by removing noise and normalizing whitespace"""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters that are likely OCR errors
        text = re.sub(r'[^\w\s\.\,\:\;\-\/\(\)]', '', text)
        return text.strip()
    
    async def _detect_language(self, text: str) -> Tuple[str, float]:
        """
        Detect language from text.
        
        Args:
            text: Text to analyze
            
        Returns:
            Tuple of (language code, confidence)
        """
        # Simple heuristic-based language detection
        if not text.strip():
            return "unknown", 0.0
        
        # Check for common English words
        english_words = ['the', 'certificate', 'this', 'is', 'to', 'certify', 'that', 'has', 'completed']
        english_count = sum(1 for word in english_words if word.lower() in text.lower())
        
        # Check for Hindi/Devanagari characters
        hindi_chars = sum(1 for char in text if '\u0900' <= char <= '\u097F')
        
        # Check for Tamil characters
        tamil_chars = sum(1 for char in text if '\u0B80' <= char <= '\u0BFF')
        
        total_chars = len(text.replace(' ', ''))
        
        if total_chars == 0:
            return "unknown", 0.0
        
        if hindi_chars / total_chars > 0.3:
            return "hindi", min(hindi_chars / total_chars, 0.95)
        elif tamil_chars / total_chars > 0.3:
            return "tamil", min(tamil_chars / total_chars, 0.95)
        elif english_count >= 3:
            return "english", min(english_count / len(english_words), 0.90)
        else:
            return "english", 0.5  # Default to English with low confidence
    
    def _extract_text_regions(self, ocr_data: Dict) -> List[Dict[str, Any]]:
        """Extract text regions with bounding boxes"""
        regions = []
        
        n_boxes = len(ocr_data.get('text', []))
        for i in range(n_boxes):
            text = ocr_data['text'][i]
            if text.strip():
                region = {
                    "text": text,
                    "confidence": int(ocr_data['conf'][i]) if ocr_data['conf'][i] != '-1' else 0,
                    "left": int(ocr_data['left'][i]),
                    "top": int(ocr_data['top'][i]),
                    "width": int(ocr_data['width'][i]),
                    "height": int(ocr_data['height'][i]),
                    "block_num": int(ocr_data['block_num'][i]),
                    "line_num": int(ocr_data['line_num'][i])
                }
                regions.append(region)
        
        return regions[:20]  # Return top 20 regions to avoid excessive data
    
    def _detect_fonts(self, ocr_data: Dict) -> List[str]:
        """Detect font characteristics (heuristic)"""
        fonts = []
        
        # Analyze text heights to detect different font sizes
        heights = [int(h) for h in ocr_data.get('height', []) if h and int(h) > 0]
        if heights:
            avg_height = sum(heights) / len(heights)
            large_text = [h for h in heights if h > avg_height * 1.5]
            
            if large_text:
                fonts.append("Large/Title font detected")
            fonts.append(f"Average text height: {int(avg_height)}px")
        
        return fonts
    
    def _determine_orientation(self, ocr_data: Dict) -> str:
        """Determine text orientation"""
        # Analyze line progression
        line_tops = {}
        for i, line_num in enumerate(ocr_data.get('line_num', [])):
            if line_num not in line_tops:
                line_tops[line_num] = ocr_data['top'][i]
        
        if len(line_tops) < 2:
            return "horizontal"
        
        # Check if lines progress vertically (top increases)
        line_positions = sorted(line_tops.values())
        if line_positions[-1] - line_positions[0] > 100:
            return "horizontal"
        else:
            return "unknown"
    
    def _calculate_reading_order_score(self, ocr_data: Dict) -> float:
        """Calculate how well text follows reading order"""
        # Simple heuristic: check if line numbers and top positions correlate
        line_nums = ocr_data.get('line_num', [])
        tops = ocr_data.get('top', [])
        
        if len(line_nums) < 2:
            return 1.0
        
        # Count how many times line number increases with top position
        correct_order = 0
        total_comparisons = 0
        
        for i in range(1, len(line_nums)):
            if line_nums[i] > line_nums[i-1]:
                total_comparisons += 1
                if tops[i] >= tops[i-1]:
                    correct_order += 1
        
        if total_comparisons == 0:
            return 1.0
        
        return round(correct_order / total_comparisons, 2)
    
    async def extract_advanced_fields(
        self,
        text: str,
        ocr_data: Dict
    ) -> Dict[str, Any]:
        """
        Extract advanced fields from certificate.
        
        Args:
            text: OCR extracted text
            ocr_data: Detailed OCR data
            
        Returns:
            Dictionary with extracted fields
        """
        fields = {
            "student_name": None,
            "institution": None,
            "course": None,
            "issue_date": None,
            "certificate_number": None,
            "grade": None,
            "degree_type": None,
            "graduation_date": None,
            "registration_number": None,
            "university_seal": False,
            "signatures_detected": 0,
            "qr_code_detected": False,
            "barcode_detected": False
        }
        
        # Extract basic fields (reuse existing patterns)
        fields.update(await self._extract_basic_fields(text))
        
        # Detect degree type
        degree_patterns = [
            r"(bachelor|master|phd|doctorate|diploma|associate)[\s]+(of|in|degree)",
            r"(b\.?a\.?|m\.?a\.?|b\.?sc\.?|m\.?sc\.?|b\.?tech\.?|m\.?tech\.?|phd)"
        ]
        for pattern in degree_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["degree_type"] = match.group(0).strip()
                break
        
        # Detect graduation date (different from issue date)
        grad_patterns = [
            r"(?:graduated|graduation)[\s:]+(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
            r"(?:graduated|graduation)[\s:]+(\d{1,2}\s+\w+\s+\d{4})"
        ]
        for pattern in grad_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["graduation_date"] = match.group(1).strip()
                break
        
        # Detect registration number
        reg_patterns = [
            r"(?:registration|reg|roll)[\s#:]+([A-Z0-9/-]+)",
            r"(?:student|enroll)[\s#:]+(?:id|number)[\s:]+([A-Z0-9/-]+)"
        ]
        for pattern in reg_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["registration_number"] = match.group(1).strip()
                break
        
        # Detect university seal (keywords)
        seal_keywords = ["seal", "stamp", "emblem", "sigil"]
        fields["university_seal"] = any(keyword in text.lower() for keyword in seal_keywords)
        
        # Count signature mentions
        signature_pattern = r"(?:signature|signed|sign)"
        fields["signatures_detected"] = len(re.findall(signature_pattern, text, re.IGNORECASE))
        
        # Detect QR code mention
        fields["qr_code_detected"] = bool(re.search(r"qr[\s-]?code", text, re.IGNORECASE))
        
        # Detect barcode mention
        fields["barcode_detected"] = bool(re.search(r"barcode", text, re.IGNORECASE))
        
        return fields
    
    async def _extract_basic_fields(self, text: str) -> Dict[str, Optional[str]]:
        """Extract basic fields (name, institution, course, dates, etc.)"""
        fields = {}
        
        # Student name patterns
        name_patterns = [
            r"(?:name|candidate|student)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
            r"(?:mr|ms|mrs)[\s.]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
            r"(?:this is to certify that)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)"
        ]
        for pattern in name_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["student_name"] = match.group(1).strip()
                break
        
        # Institution patterns
        institution_patterns = [
            r"([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:University|College|Institute))",
            r"(?:university|college|institute)[\s:]+(.+?)(?:\n|$)"
        ]
        for pattern in institution_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["institution"] = match.group(1).strip()
                break
        
        # Course patterns
        course_patterns = [
            r"(?:course|program|degree)[\s:]+(.+?)(?:\n|$)",
            r"(?:bachelor|master|diploma)[\s]+(?:of|in)[\s]+(.+?)(?:\n|$)"
        ]
        for pattern in course_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["course"] = match.group(1).strip()
                break
        
        # Date patterns
        date_patterns = [
            r"(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
            r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})"
        ]
        for pattern in date_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["issue_date"] = match.group(1).strip()
                break
        
        # Certificate number
        cert_patterns = [
            r"(?:certificate|cert)[\s#:]+(?:no|number)[\s:]*([A-Z0-9/-]+)",
            r"(?:certificate)[\s:]+([A-Z0-9/-]+)"
        ]
        for pattern in cert_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["certificate_number"] = match.group(1).strip()
                break
        
        # Grade patterns
        grade_patterns = [
            r"(?:grade|cgpa|gpa|marks)[\s:]+([A-F][\+\-]?|\d+\.?\d*)",
            r"(?:first|second|third)[\s]+class"
        ]
        for pattern in grade_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields["grade"] = match.group(0).strip()
                break
        
        return fields


# Global service instance
ocr_analysis_service = OCRAnalysisService()
