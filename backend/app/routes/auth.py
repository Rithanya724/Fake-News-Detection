"""
Authentication API Endpoints: Register, Login, Current User Profile.
"""

from fastapi import APIRouter, Depends, status
from app.models.schemas import UserRegister, UserLogin, TokenResponse, UserResponse
from app.services.auth_service import auth_service
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    """Register a new user account and obtain access token."""
    return auth_service.register_user(user_in)

@router.post("/login", response_model=TokenResponse)
async def login(login_in: UserLogin):
    """Authenticate existing user and return access token."""
    return auth_service.authenticate_user(login_in)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Retrieve currently authenticated user profile."""
    return {
        "id": current_user["id"],
        "name": current_user["name"],
        "email": current_user["email"],
        "role": current_user["role"],
        "created_at": ""
    }
