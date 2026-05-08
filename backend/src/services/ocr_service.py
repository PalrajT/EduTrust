import re
from typing import Dict, Optional, Tuple, Any
import os

from src.core.config import settings
from src.core.logging import logger

# Optional heavy dependencies: import lazily and handle missing packages gracefully
try:
    import pytesseract
except Exception:  # pragma: no cover - runtime optional
    pytesseract = None

try:
    from PIL import Image
except Exception:  # pragma: no cover - runtime optional
    Image = None

try:
    import cv2
except Exception:  # pragma: no cover - runtime optional
    cv2 = None

try:
    import numpy as np
except Exception:  # pragma: no cover - runtime optional
    np = None


class OCRService:
    """OCR Service for text extraction from certificates"""
    
    def __init__(self):
        # Set Tesseract command path
        if pytesseract and os.path.exists(settings.TESSERACT_CMD):
            try:
                pytesseract.pytesseract.tesseract_cmd = settings.TESSERACT_CMD
            except Exception:
                # ignore configuration issues here; will fail during OCR call if unusable
                pass
    
    async def preprocess_image(self, image_path: str) -> Any:
        """Preprocess image for better OCR results"""
        if cv2 is None or np is None:
            raise RuntimeError("OpenCV (cv2) and numpy are required for image preprocessing. Install opencv-python and numpy.")

        try:
            # Read image
            img = cv2.imread(image_path)
            
            # Convert to grayscale
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # Apply denoising
            denoised = cv2.fastNlMeansDenoising(gray)
            
            # Apply adaptive thresholding
            thresh = cv2.adaptiveThreshold(
                denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                cv2.THRESH_BINARY, 11, 2
            )
            
            # Deskew if needed
            thresh = self._deskew(thresh)
            
            return thresh
            
        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            raise
    
    def _deskew(self, image) -> Any:
        """Deskew image"""
        coords = np.column_stack(np.where(image > 0))
        angle = cv2.minAreaRect(coords)[-1]
        
        if angle < -45:
            angle = -(90 + angle)
        else:
            angle = -angle
            
        (h, w) = image.shape[:2]
        center = (w // 2, h // 2)
        M = cv2.getRotationMatrix2D(center, angle, 1.0)
        rotated = cv2.warpAffine(
            image, M, (w, h),
            flags=cv2.INTER_CUBIC,
            borderMode=cv2.BORDER_REPLICATE
        )
        
        return rotated
    
    async def extract_text(
        self,
        image_path: str,
        language: str = "eng"
    ) -> Tuple[str, float]:
        """Extract text from image using OCR"""
        if pytesseract is None or Image is None:
            raise RuntimeError("pytesseract and Pillow are required for OCR. Install pytesseract and pillow.")

        try:
            # Preprocess image
            processed_img = await self.preprocess_image(image_path)

            # Convert numpy array to PIL Image
            pil_image = Image.fromarray(processed_img)

            # Perform OCR with confidence data
            ocr_data = pytesseract.image_to_data(
                pil_image,
                lang=settings.OCR_LANGUAGES if language == "auto" else language,
                output_type=pytesseract.Output.DICT
            )

            # Extract text
            text = pytesseract.image_to_string(
                pil_image,
                lang=settings.OCR_LANGUAGES if language == "auto" else language
            )

            # Calculate average confidence
            confidences = [int(conf) for conf in ocr_data.get('conf', []) if conf and int(conf) > 0]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0

            logger.info(f"OCR extracted {len(text)} characters with {avg_confidence:.2f}% confidence")

            return text.strip(), avg_confidence / 100

        except Exception as e:
            logger.error(f"Error extracting text: {e}")
            raise
    
    async def extract_structured_data(self, text: str) -> Dict[str, Optional[str]]:
        """Extract structured data from OCR text"""
        data = {
            "student_name": None,
            "institution": None,
            "course": None,
            "issue_date": None,
            "certificate_number": None,
            "grade": None
        }
        
        try:
            # Extract student name (common patterns)
            name_patterns = [
                r"(?:student|name|candidate)[\s:]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
                r"(?:mr|ms|mrs)[\s.]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)",
                r"(?:this is to certify that)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)"
            ]
            for pattern in name_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["student_name"] = match.group(1).strip()
                    break
            
            # Extract institution
            institution_patterns = [
                r"(?:university|college|institute)[\s:]+(.+?)(?:\n|$)",
                r"([A-Z][a-z]+\s+University)",
                r"([A-Z][a-z]+\s+College)"
            ]
            for pattern in institution_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["institution"] = match.group(1).strip()
                    break
            
            # Extract course
            course_patterns = [
                r"(?:course|program|degree)[\s:]+(.+?)(?:\n|$)",
                r"(?:bachelor|master|diploma)[\s]+(?:of|in)[\s]+(.+?)(?:\n|$)",
            ]
            for pattern in course_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["course"] = match.group(1).strip()
                    break
            
            # Extract date
            date_patterns = [
                r"(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})",
                r"(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})",
                r"(?:date|dated|issued)[\s:]+(.+?)(?:\n|$)"
            ]
            for pattern in date_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["issue_date"] = match.group(1).strip()
                    break
            
            # Extract certificate number
            cert_num_patterns = [
                r"(?:certificate|cert|reg|registration)[\s#:]+([A-Z0-9/-]+)",
                r"(?:number|no)[\s#:]+([A-Z0-9/-]+)"
            ]
            for pattern in cert_num_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["certificate_number"] = match.group(1).strip()
                    break
            
            # Extract grade/marks
            grade_patterns = [
                r"(?:grade|cgpa|percentage)[\s:]+([A-Z0-9.+]+)",
                r"(?:with|secured)[\s]+([A-Z]+)[\s]+(?:grade|class)"
            ]
            for pattern in grade_patterns:
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    data["grade"] = match.group(1).strip()
                    break
            
            logger.info(f"Extracted structured data: {data}")
            return data
            
        except Exception as e:
            logger.error(f"Error extracting structured data: {e}")
            return data
    
    async def detect_language(self, text: str) -> str:
        """Detect the primary language of the text"""
        try:
            # Simple language detection based on character sets
            if re.search(r'[\u0900-\u097F]', text):
                return "hindi"
            elif re.search(r'[\u0B80-\u0BFF]', text):
                return "tamil"
            elif re.search(r'[\u0C00-\u0C7F]', text):
                return "telugu"
            elif re.search(r'[\u0980-\u09FF]', text):
                return "bengali"
            elif re.search(r'[\u0900-\u097F]', text):
                return "marathi"
            else:
                return "english"
        except Exception as e:
            logger.error(f"Error detecting language: {e}")
            return "english"


# Singleton instance
ocr_service = OCRService()
