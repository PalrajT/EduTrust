from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""
    
    # Environment
    ENV: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    RELOAD: bool = True
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database - MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "edutrust"
    
    # Database - PostgreSQL
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "edutrust"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = ""
    
    # CORS (comma-separated string in env, e.g. http://localhost:5173,http://localhost:3000)
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:8081"
    
    # File Upload
    MAX_FILE_SIZE: int = 10485760  # 10MB
    # Comma-separated allowed extensions in env, e.g. .jpg,.jpeg,.png,.pdf
    ALLOWED_EXTENSIONS: str = ".jpg,.jpeg,.png,.pdf"
    UPLOAD_DIR: str = "./uploads"
    
    # OCR Configuration
    TESSERACT_CMD: str = "tesseract"
    OCR_LANGUAGES: str = "eng+hin+tam+tel+ben+mar+guj+kan+mal+pan"
    
    # AI Model
    MODEL_PATH: str = "./models"
    CONFIDENCE_THRESHOLD: float = 0.85
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Email
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAIL_FROM: str = "noreply@edutrust.com"
    
    # Cloud Storage
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_REGION: str = "ap-south-1"
    S3_BUCKET_NAME: str = "edutrust-certificates"
    
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_CONTAINER_NAME: str = "certificates"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "logs/app.log"
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    
    # API Keys
    GOOGLE_CLOUD_VISION_KEY: str = ""
    
    # Blockchain Configuration
    USE_REAL_BLOCKCHAIN: bool = False  # Set to True for production blockchain
    BLOCKCHAIN_RPC_URL: str = "https://polygon-mumbai.g.alchemy.com/v2/your-api-key"  # Polygon testnet
    BLOCKCHAIN_CONTRACT_ADDRESS: str = ""  # Smart contract address
    BLOCKCHAIN_PRIVATE_KEY: str = ""  # Private key for signing transactions
    BLOCKCHAIN_NETWORK_ID: int = 80001  # Polygon Mumbai testnet
    
    # Poppler (for PDF processing)
    POPPLER_PATH: str = ""  # Path to poppler bin directory (Windows: C:\Program Files\poppler\Library\bin)
    PDF_DPI: int = 150  # DPI for PDF conversion (lower = faster, higher = better quality)
    
    # Performance Optimization
    ENABLE_INVISIBLE_WATERMARK: bool = False  # Invisible watermark detection is slow (5-8s), disable for speed
    ENABLE_SIGNATURE_ANALYSIS: bool = True  # Signature detection
    ENABLE_METADATA_ANALYSIS: bool = True  # Image metadata analysis
    VERIFICATION_TIMEOUT: int = 55  # Maximum seconds for verification (safety margin under 60s)
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Parse ALLOWED_ORIGINS if it's a string"""
        # Accept either a JSON-style list already parsed by pydantic-settings or a comma-separated string
        if isinstance(self.ALLOWED_ORIGINS, str):
            # allow empty string
            if not self.ALLOWED_ORIGINS.strip():
                return []
            return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]
        # If it's already a list (e.g., loaded as JSON), normalize entries
        try:
            return [str(o).strip() for o in self.ALLOWED_ORIGINS]
        except Exception:
            return []

    @property
    def allowed_extensions_list(self) -> List[str]:
        """Return allowed extensions as a list"""
        if isinstance(self.ALLOWED_EXTENSIONS, str):
            return [e.strip().lower() for e in self.ALLOWED_EXTENSIONS.split(",") if e.strip()]
        try:
            return [str(e).strip().lower() for e in self.ALLOWED_EXTENSIONS]
        except Exception:
            return []
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
