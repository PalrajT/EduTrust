import sys
from loguru import logger
from src.core.config import settings


def setup_logging():
    """Configure Loguru logger"""
    
    # Remove default handler
    logger.remove()
    
    # Console handler with custom format
    logger.add(
        sys.stdout,
        colorize=True,
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        level=settings.LOG_LEVEL,
    )
    
    # File handler
    logger.add(
        settings.LOG_FILE,
        rotation="500 MB",
        retention="10 days",
        compression="zip",
        format="{time:YYYY-MM-DD HH:mm:ss} | {level: <8} | {name}:{function}:{line} - {message}",
        level=settings.LOG_LEVEL,
    )
    
    return logger


# Export logger
__all__ = ["logger", "setup_logging"]
