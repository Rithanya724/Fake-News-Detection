"""
Pydantic Schemas for Request & Response validation.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# --- User & Auth Schemas ---
class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    role: Optional[str] = "user"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Prediction Schemas ---
class SignalItem(BaseModel):
    feature: str
    weight: float
    indicator: str

class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=15, max_length=15000, description="Textile news article text or headline")
    title: Optional[str] = Field(None, max_length=300, description="Optional news headline")
    source: Optional[str] = Field(None, max_length=100, description="Optional source publication")

class PredictionResponse(BaseModel):
    id: str
    prediction: str # "REAL" or "POTENTIALLY MISLEADING"
    raw_label: str # "REAL" or "FAKE"
    confidence: float # 0.0 to 1.0
    confidence_percentage: float # 0.0 to 100.0
    model: str
    category: str
    important_signals: Optional[List[SignalItem]] = Field(default_factory=list)
    notice: Optional[str] = "Statistical ML classification pattern."
    created_at: str
    text_snippet: Optional[str] = ""
    title: Optional[str] = None
    source: Optional[str] = None

class PredictionDetail(PredictionResponse):
    full_text: str

# --- History & Dashboard Schemas ---
class HistoryListResponse(BaseModel):
    total: int
    page: int
    limit: int
    items: List[PredictionResponse]

class DashboardStatsResponse(BaseModel):
    total_predictions: int
    real_count: int
    fake_count: int
    average_confidence: float
    category_distribution: List[Dict[str, Any]]
    predictions_timeline: List[Dict[str, Any]]
    confidence_distribution: List[Dict[str, Any]]
    recent_predictions: List[PredictionResponse]

class ModelMetricsResponse(BaseModel):
    current_model: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    confusion_matrix: List[List[int]]
    dataset_records: int
    training_date: str
    model_comparison: List[Dict[str, Any]]
    vocabulary_size: int

# --- Admin Schemas ---
class AdminStatsResponse(BaseModel):
    total_users: int
    total_predictions: int
    real_predictions: int
    fake_predictions: int
    top_categories: List[Dict[str, Any]]
    system_status: str
