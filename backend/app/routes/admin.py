"""
Admin API Endpoints (Protected with Role-based Authorization).
"""

from collections import defaultdict
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from app.models.schemas import AdminStatsResponse, UserResponse
from app.database.mongodb import get_database
from app.middleware.auth import require_admin

router = APIRouter(prefix="/admin", tags=["Admin Operations"])

@router.get("/users", response_model=List[UserResponse])
async def list_all_users(admin: dict = Depends(require_admin)):
    """Retrieve list of all registered users (Admin only)."""
    db = get_database()
    users = []
    for doc in db.users.find().sort("created_at", -1):
        users.append({
            "id": str(doc.get("_id", doc.get("id"))),
            "name": doc.get("name", "User"),
            "email": doc.get("email"),
            "role": doc.get("role", "user"),
            "created_at": doc.get("created_at", "")
        })
    return users

@router.get("/statistics", response_model=AdminStatsResponse)
async def get_admin_statistics(admin: dict = Depends(require_admin)):
    """Retrieve global platform metrics and system health indicators (Admin only)."""
    db = get_database()
    
    total_users = db.users.count_documents({})
    all_preds = list(db.predictions.find())
    
    total_preds = len(all_preds)
    real_preds = sum(1 for p in all_preds if p.get("raw_label") == "REAL")
    fake_preds = sum(1 for p in all_preds if p.get("raw_label") == "FAKE")
    
    cat_counts = defaultdict(int)
    for p in all_preds:
        cat = p.get("category", "Textile")
        cat_counts[cat] += 1
        
    top_cats = [{"category": k, "count": v} for k, v in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)[:5]]

    return {
        "total_users": total_users,
        "total_predictions": total_preds,
        "real_predictions": real_preds,
        "fake_predictions": fake_preds,
        "top_categories": top_cats,
        "system_status": "ONLINE - ML Engine Operational"
    }
