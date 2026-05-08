from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure
from typing import Optional

from src.core.config import settings
from src.core.logging import logger


class Database:
    """MongoDB Database Connection Manager"""
    
    client: Optional[AsyncIOMotorClient] = None
    db = None


db = Database()


async def connect_to_mongo():
    """Connect to MongoDB"""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
        db.client = AsyncIOMotorClient(settings.MONGODB_URL)
        db.db = db.client[settings.MONGODB_DB_NAME]

        # Test the connection
        try:
            await db.client.admin.command('ping')
            logger.info("✅ Successfully connected to MongoDB")

            # Create indexes
            await create_indexes()
        except Exception as e:
            logger.warning(f"⚠️ MongoDB connection test failed: {e}. Continuing without DB for now.")
            # Leave db.client and db.db as-is; operations will fail if used until DB is available.

    except ConnectionFailure as e:
        logger.error(f"❌ Failed to connect to MongoDB: {e}")
        # Do not raise to allow app to start in development without DB
        logger.warning("Continuing without a live MongoDB connection. Some endpoints will fail until DB is available.")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if db.client:
        db.client.close()
        logger.info("MongoDB connection closed")


async def create_indexes():
    """Create database indexes for performance"""
    try:
        # Users collection indexes
        await db.db.users.create_index("email", unique=True)
        await db.db.users.create_index("username", unique=True)
        
        # Certificates collection indexes
        await db.db.certificates.create_index("certificate_id", unique=True)
        await db.db.certificates.create_index("student_name")
        await db.db.certificates.create_index("institution")
        await db.db.certificates.create_index("issue_date")
        await db.db.certificates.create_index([("student_name", "text"), ("institution", "text")])
        
        # Verifications collection indexes
        await db.db.verifications.create_index("verification_id", unique=True)
        await db.db.verifications.create_index("created_at")
        await db.db.verifications.create_index("status")
        
        # Blacklist collection indexes
        await db.db.blacklist.create_index("certificate_id", unique=True)
        await db.db.blacklist.create_index("created_at")
        
        logger.info("✅ Database indexes created successfully")
        
    except Exception as e:
        error_msg = str(e)
        if "createIndex" in error_msg and ("8000" in error_msg or "AtlasError" in error_msg):
            logger.warning("⚠️ MongoDB Atlas user lacks 'createIndex' permission")
            logger.warning("📖 Fix: Update user role to 'Atlas admin' in Database Access")
            logger.warning("📄 See FIX_ATLAS_PERMISSIONS.md for detailed instructions")
            logger.info("ℹ️ Application will continue - indexes may already exist or will be created later")
        else:
            logger.error(f"Error creating indexes: {e}")


def get_database():
    """Get database instance"""
    return db.db
