"""
Automated Integration & Unit Tests for FastAPI Backend.
"""

import sys
import os

# Set Python path to backend
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    """Verify health endpoint returns 200 and operational status."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_engine"] == "loaded"

def test_root_endpoint():
    """Verify root info endpoint."""
    response = client.get("/")
    assert response.status_code == 200
    assert "Textile" in response.json()["project"]

def test_auth_and_prediction_flow():
    """Test full flow: registration, login, prediction, history, dashboard."""
    # 1. Register new user
    import uuid
    test_email = f"testuser_{uuid.uuid4().hex[:6]}@example.com"
    reg_res = client.post("/api/v1/auth/register", json={
        "name": "Integration Tester",
        "email": test_email,
        "password": "Password@123",
        "role": "user"
    })
    assert reg_res.status_code == 201
    token = reg_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Login
    login_res = client.post("/api/v1/auth/login", json={
        "email": test_email,
        "password": "Password@123"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()
    
    # 3. Predict Real Textile News
    real_news = "The Cotton Corporation of India has initiated Minimum Support Price procurement operations across major agricultural markets to support cotton farmers and ensure yarn supply stability."
    pred_res = client.post("/api/v1/predict", json={"text": real_news}, headers=headers)
    assert pred_res.status_code == 200
    pred_data = pred_res.json()
    assert pred_data["prediction"] == "REAL"
    assert pred_data["confidence"] > 0.5
    assert len(pred_data["important_signals"]) > 0
    assert "Important notice:" in pred_data["notice"]
    pred_id = pred_data["id"]

    # 4. Predict Fake Textile News
    fake_news = "URGENT BREAKING: Government issues midnight order banning 100 percent of cotton exports! Instant 50 lakh direct money transfer to your bank without invoice!"
    pred_fake = client.post("/api/v1/predict", json={"text": fake_news}, headers=headers)
    assert pred_fake.status_code == 200
    assert pred_fake.json()["prediction"] == "POTENTIALLY MISLEADING"

    # 5. Get Prediction History
    hist_res = client.get("/api/v1/history", headers=headers)
    assert hist_res.status_code == 200
    hist_data = hist_res.json()
    assert hist_data["total"] >= 2

    # 6. Get Dashboard Stats
    dash_res = client.get("/api/v1/dashboard/stats", headers=headers)
    assert dash_res.status_code == 200
    dash_data = dash_res.json()
    assert dash_data["total_predictions"] >= 2

    # 7. Delete a Prediction
    del_res = client.delete(f"/api/v1/history/{pred_id}", headers=headers)
    assert del_res.status_code == 200

def test_input_validation():
    """Verify short or empty text is rejected with 400 or 422."""
    res_empty = client.post("/api/v1/predict", json={"text": "too short"})
    assert res_empty.status_code in [400, 422]

def test_model_performance_endpoint():
    """Verify live metrics and comparison endpoints."""
    res = client.get("/api/v1/model/performance")
    assert res.status_code == 200
    data = res.json()
    assert data["current_model"] == "Logistic Regression"
    assert "accuracy" in data
    assert "confusion_matrix" in data
    assert len(data["model_comparison"]) >= 3

def test_admin_authorization():
    """Verify non-admin users cannot access admin routes, while admin can."""
    # Register regular user
    user_res = client.post("/api/v1/auth/register", json={
        "name": "Regular User",
        "email": f"reg_{os.urandom(3).hex()}@example.com",
        "password": "Password@123",
        "role": "user"
    })
    user_token = user_res.json()["access_token"]
    
    # Regular user tries to access admin
    forbidden_res = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {user_token}"})
    assert forbidden_res.status_code == 403

    # Admin login
    admin_login = client.post("/api/v1/auth/login", json={
        "email": "admin@textile.org",
        "password": "Admin@123"
    })
    assert admin_login.status_code == 200
    admin_token = admin_login.json()["access_token"]
    
    admin_res = client.get("/api/v1/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert admin_res.status_code == 200
    assert len(admin_res.json()) >= 1

    stats_res = client.get("/api/v1/admin/statistics", headers={"Authorization": f"Bearer {admin_token}"})
    assert stats_res.status_code == 200
    assert stats_res.json()["total_users"] >= 1
