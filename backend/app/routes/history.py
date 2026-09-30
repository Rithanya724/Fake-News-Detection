"""
Prediction History API Endpoints.
"""

from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.models.schemas import HistoryListResponse, PredictionDetail, PredictionResponse
from app.database.mongodb import get_database
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/history", tags=["History"])

@router.get("", response_model=HistoryListResponse)
async def get_history(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    prediction: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    """Retrieve filtered and paginated prediction history for current user."""
    db = get_database()
    query = {"user_id": current_user["id"]}
    
    if prediction:
        # Accept REAL / FAKE / POTENTIALLY MISLEADING
        if prediction.upper() in ["FAKE", "POTENTIALLY MISLEADING", "MISLEADING"]:
            query["raw_label"] = "FAKE"
        elif prediction.upper() == "REAL":
            query["raw_label"] = "REAL"
            
    if category and category.lower() != "all":
        query["category"] = category

    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"text_snippet": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}}
        ]

    total = db.predictions.count_documents(query)
    skip = (page - 1) * limit
    
    cursor = db.predictions.find(query).sort("created_at", -1).skip(skip).limit(limit)
    items = []
    for doc in cursor:
        doc_id = str(doc.get("_id", doc.get("id")))
        doc["id"] = doc_id
        items.append(doc)
        
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "items": items
    }

@router.get("/{prediction_id}", response_model=PredictionDetail)
async def get_prediction_detail(prediction_id: str, current_user: dict = Depends(get_current_user)):
    """Retrieve full details of an individual prediction record."""
    db = get_database()
    doc = db.predictions.find_one({
        "$or": [{"_id": prediction_id}, {"id": prediction_id}],
        "user_id": current_user["id"]
    })
    
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found."
        )
        
    doc["id"] = str(doc.get("_id", doc.get("id")))
    return doc

@router.delete("/{prediction_id}", status_code=status.HTTP_200_OK)
async def delete_prediction(prediction_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a prediction from user history."""
    db = get_database()
    res = db.predictions.delete_one({
        "$or": [{"_id": prediction_id}, {"id": prediction_id}],
        "user_id": current_user["id"]
    })
    
    if res.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction record not found or already deleted."
        )
        
    return {"message": "Prediction record deleted successfully."}
