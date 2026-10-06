"""
Dashboard Analytics & Aggregated Statistics API Endpoints.
"""

from collections import defaultdict
from fastapi import APIRouter, Depends
from app.models.schemas import DashboardStatsResponse
from app.database.mongodb import get_database
from app.middleware.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStatsResponse)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Compute and return aggregated statistics for the user dashboard."""
    db = get_database()
    user_id = current_user["id"]
    
    # Query all predictions for current user
    all_predictions = list(db.predictions.find({"user_id": user_id}).sort("created_at", -1))
    
    # If user has no predictions yet, pull all predictions or seeded demo dataset for rich charts
    if len(all_predictions) == 0:
        all_predictions = list(db.predictions.find().sort("created_at", -1))

    total = len(all_predictions)
    real_count = sum(1 for p in all_predictions if p.get("raw_label") == "REAL")
    fake_count = sum(1 for p in all_predictions if p.get("raw_label") == "FAKE")
    
    avg_conf = 0.0
    if total > 0:
        avg_conf = round(sum(p.get("confidence", 0.0) for p in all_predictions) / total * 100.0, 1)

    # 1. Category Distribution
    cat_counts = defaultdict(int)
    for p in all_predictions:
        cat = p.get("category", "Textile")
        cat_counts[cat] += 1
    category_distribution = [{"name": k, "value": v} for k, v in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True)]

    # 2. Timeline aggregation (by date)
    timeline_dict = defaultdict(lambda: {"REAL": 0, "FAKE": 0})
    for p in all_predictions:
        date_str = p.get("created_at", "2026-02-15")[:10]
        label = p.get("raw_label", "REAL")
        timeline_dict[date_str][label] += 1
        
    predictions_timeline = []
    for d, counts in sorted(timeline_dict.items()):
        predictions_timeline.append({
            "date": d,
            "real": counts["REAL"],
            "fake": counts["FAKE"],
            "total": counts["REAL"] + counts["FAKE"]
        })

    # 3. Confidence Distribution Buckets
    conf_buckets = {
        "50-60%": 0,
        "60-70%": 0,
        "70-80%": 0,
        "80-90%": 0,
        "90-100%": 0
    }
    for p in all_predictions:
        c = p.get("confidence", 0.75) * 100
        if c < 60:
            conf_buckets["50-60%"] += 1
        elif c < 70:
            conf_buckets["60-70%"] += 1
        elif c < 80:
            conf_buckets["70-80%"] += 1
        elif c < 90:
            conf_buckets["80-90%"] += 1
        else:
            conf_buckets["90-100%"] += 1
            
    confidence_distribution = [{"range": k, "count": v} for k, v in conf_buckets.items()]

    # 4. Recent Predictions
    recent = []
    for p in all_predictions[:5]:
        p_copy = p.copy()
        p_copy["id"] = str(p.get("_id", p.get("id")))
        if "text_snippet" not in p_copy or not p_copy["text_snippet"]:
            p_copy["text_snippet"] = (p_copy.get("text") or "")[:120]
        if "notice" not in p_copy:
            p_copy["notice"] = "Statistical ML classification pattern."
        recent.append(p_copy)

    return {
        "total_predictions": total,
        "real_count": real_count,
        "fake_count": fake_count,
        "average_confidence": avg_conf,
        "category_distribution": category_distribution,
        "predictions_timeline": predictions_timeline,
        "confidence_distribution": confidence_distribution,
        "recent_predictions": recent
    }
