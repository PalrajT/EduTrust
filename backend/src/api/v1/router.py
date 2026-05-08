from fastapi import APIRouter

from src.api.v1.endpoints import auth, verify, certificates, dashboard, blockchain

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(verify.router, prefix="/verify", tags=["Verification"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(blockchain.router, prefix="/blockchain", tags=["Blockchain"])
