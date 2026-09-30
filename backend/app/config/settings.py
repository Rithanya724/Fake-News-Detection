"""
Application Settings & Configuration via Pydantic.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Textile Industry Fake News Detection System"
    API_V1_PREFIX: str = "/api/v1"
    
    # Database
    MONGODB_URI: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "textile_fake_news"
    
    # Security
    JWT_SECRET: str = "textile_secure_jwt_secret_key_change_in_production_2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440 # 24 hours
    
    # CORS
    FRONTEND_URL: str = "http://localhost:5173"
    
    # Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    ML_MODELS_DIR: str = os.path.join(BASE_DIR, "..", "ml", "models")
    
    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
