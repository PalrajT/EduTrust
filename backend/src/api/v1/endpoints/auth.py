from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from datetime import datetime

from src.core.database import get_database
from src.core.security import get_current_user, get_password_hash
from src.core.logging import logger
from src.schemas.user import (
    UserCreate, UserResponse, UserUpdate, LoginRequest,
    TokenResponse, RefreshTokenRequest
)
from src.core.security import (
    verify_password, create_access_token, create_refresh_token,
    decode_token
)

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user: UserCreate, db=Depends(get_database)):
    """Register a new user"""
    
    # Check if user exists
    existing_user = await db.users.find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email or username already exists"
        )
    
    # Create user
    user_dict = user.dict()
    user_dict["hashed_password"] = get_password_hash(user_dict.pop("password"))
    user_dict["is_active"] = True
    user_dict["created_at"] = datetime.utcnow()
    
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = str(result.inserted_id)
    
    logger.info(f"New user registered: {user.email}")
    
    return user_dict


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest, db=Depends(get_database)):
    """Login and get access token"""
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create tokens
    token_data = {
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user")
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow()}}
    )
    
    logger.info(f"User logged in: {user['email']}")
    
    # Prepare user response
    user["_id"] = str(user["_id"])
    user_response = UserResponse(**user)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_response
    )


@router.post("/refresh", response_model=dict)
async def refresh_token(request: RefreshTokenRequest, db=Depends(get_database)):
    """Refresh access token"""
    
    try:
        payload = decode_token(request.refresh_token)
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        # Create new access token
        token_data = {
            "sub": payload["sub"],
            "email": payload["email"],
            "role": payload.get("role", "user")
        }
        
        new_access_token = create_access_token(token_data)
        
        return {
            "access_token": new_access_token,
            "token_type": "bearer"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Get current user information"""
    from bson import ObjectId
    
    user = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user["_id"] = str(user["_id"])
    return user


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db=Depends(get_database)
):
    """Update current user information"""
    from bson import ObjectId
    
    update_data = user_update.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = get_password_hash(update_data.pop("password"))
    
    update_data["updated_at"] = datetime.utcnow()
    
    result = await db.users.update_one(
        {"_id": ObjectId(current_user["user_id"])},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user = await db.users.find_one({"_id": ObjectId(current_user["user_id"])})
    user["_id"] = str(user["_id"])
    
    logger.info(f"User updated: {current_user['email']}")
    
    return user
