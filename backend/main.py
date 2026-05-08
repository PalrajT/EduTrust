import warnings
import sys
import os

# Suppress common warnings
os.environ['PYTHONWARNINGS'] = 'ignore::UserWarning'
warnings.filterwarnings("ignore", category=UserWarning)

# Create a filtering stderr wrapper to suppress bcrypt warnings
class FilteredStderr:
    """Wrapper for stderr that filters out bcrypt and eth_utils warnings"""
    def __init__(self, original_stderr):
        self.original_stderr = original_stderr
        self.buffer = []
        self.skip_next_lines = 0
        
    def write(self, text):
        # Check if we should skip this line (part of a traceback we're filtering)
        if self.skip_next_lines > 0:
            self.skip_next_lines -= 1
            return len(text)
        
        # Filter out specific warning patterns
        if any(pattern in text for pattern in [
            '(trapped) error reading bcrypt version',
            'bcrypt.__about__',
            '_load_backend_mixin',
            'passlib.handlers.bcrypt',
        ]):
            # Skip this line and the next few lines of the traceback
            self.skip_next_lines = 5
            return len(text)
        
        # Pass through other messages
        return self.original_stderr.write(text)
    
    def flush(self):
        if hasattr(self.original_stderr, 'flush'):
            self.original_stderr.flush()
    
    def __getattr__(self, name):
        return getattr(self.original_stderr, name)

# Replace stderr before any other imports
sys.stderr = FilteredStderr(sys.stderr)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from src.core.config import settings
from src.core.database import connect_to_mongo, close_mongo_connection
from src.api.v1.router import api_router
from src.core.logging import setup_logging, logger

# Setup logging
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    logger.info("🚀 Starting EduTrust API Server...")
    
    # Startup
    await connect_to_mongo()
    logger.info("✅ Database connected")
    
    # Create necessary directories
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.MODEL_PATH, exist_ok=True)
    os.makedirs("logs", exist_ok=True)
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down EduTrust API Server...")
    await close_mongo_connection()
    logger.info("✅ Database connection closed")


# Create FastAPI app
app = FastAPI(
    title="EduTrust API",
    description="AI-Powered Certificate Verification System for Smart India Hackathon 2025",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list if settings.ENV == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Trusted Host Middleware (for production)
if settings.ENV == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.allowed_origins_list
    )

# Include API router
app.include_router(api_router, prefix="/api/v1")

# Mount static files (for uploaded certificates)
if os.path.exists(settings.UPLOAD_DIR):
    app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🎓 Welcome to EduTrust API",
        "version": "1.0.0",
        "status": "active",
        "docs": "/api/docs",
        "team": "COSMOS - SIH 2025"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENV,
        "database": "connected"
    }


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.RELOAD,
        log_level=settings.LOG_LEVEL.lower()
    )
