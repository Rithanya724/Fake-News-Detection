"""
Prediction & Model Performance API Endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import PredictionRequest, PredictionResponse, ModelMetricsResponse
from app.services.prediction_service import prediction_service
from app.middleware.auth import get_optional_user

router = APIRouter(tags=["Prediction & ML"])

@router.post("/predict", response_model=PredictionResponse, status_code=status.HTTP_200_OK)
async def predict_news(payload: PredictionRequest, current_user: dict = Depends(get_optional_user)):
    """
    Analyze textile news text and predict if it is REAL or POTENTIALLY MISLEADING.
    Returns model confidence, inferred category, and feature-level explainability signals.
    """
    if not payload.text or len(payload.text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="News content must be at least 10 characters long."
        )

    user_id = current_user["id"] if current_user else "anonymous"
    
    result = prediction_service.predict(
        text=payload.text,
        title=payload.title or "",
        source=payload.source or "",
        user_id=user_id
    )
    return result

@router.get("/model/performance", response_model=ModelMetricsResponse)
async def get_model_performance():
    """
    Retrieve live training metrics, benchmark comparisons, and confusion matrix data.
    """
    return prediction_service.get_model_metrics()
