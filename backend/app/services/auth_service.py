"""
Authentication Service: User Registration, Authentication & Token Issuance.
"""

import uuid
import datetime
from typing import Optional, Dict, Any
from fastapi import HTTPException, status

from app.database.mongodb import get_database
from app.utils.security import hash_password, verify_password, create_access_token
from app.models.schemas import UserRegister, UserLogin

class AuthService:
    def register_user(self, user_in: UserRegister) -> Dict[str, Any]:
        db = get_database()
        
        # Check if email exists
        existing = db.users.find_one({"email": user_in.email.lower()})
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )
            
        user_id = str(uuid.uuid4())
        created_at = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        role = "admin" if user_in.role == "admin" else "user"
        
        user_doc = {
            "_id": user_id,
            "id": user_id,
            "name": user_in.name,
            "email": user_in.email.lower(),
            "password_hash": hash_password(user_in.password),
            "role": role,
            "created_at": created_at
        }
        
        db.users.insert_one(user_doc)
        
        # Generate token
        token = create_access_token(data={"sub": user_id, "email": user_doc["email"], "role": role})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user_doc["name"],
                "email": user_doc["email"],
                "role": role,
                "created_at": created_at
            }
        }

    def authenticate_user(self, login_in: UserLogin) -> Dict[str, Any]:
        db = get_database()
        
        user = db.users.find_one({"email": login_in.email.lower()})
        if not user or not verify_password(login_in.password, user.get("password_hash", "")):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password."
            )
            
        user_id = str(user.get("_id", user.get("id")))
        role = user.get("role", "user")
        
        token = create_access_token(data={"sub": user_id, "email": user["email"], "role": role})
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user.get("name", "User"),
                "email": user.get("email"),
                "role": role,
                "created_at": user.get("created_at", "")
            }
        }

auth_service = AuthService()
