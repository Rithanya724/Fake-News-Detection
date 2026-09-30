# REST API Documentation

Base URL: `http://localhost:8000/api/v1`
Interactive Docs: `http://localhost:8000/docs` or `http://localhost:8000/redoc`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Create a new user account.

**Request Body:**
```json
{
  "name": "Student Analyst",
  "email": "analyst@textile.org",
  "password": "Password@123",
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "e4b2d184-789a-4c4f-9e77-59d4f58c7e91",
    "name": "Student Analyst",
    "email": "analyst@textile.org",
    "role": "user",
    "created_at": "2026-02-15 10:00:00"
  }
}
```

### `POST /auth/login`
Authenticate existing user and obtain JWT token.

**Request Body:**
```json
{
  "email": "analyst@textile.org",
  "password": "Password@123"
}
```

### `GET /auth/me`
Retrieve profile of currently authenticated user.
*Requires `Authorization: Bearer <token>` header.*

---

## 2. Prediction Endpoints

### `POST /predict`
Analyze a textile news excerpt.

**Request Body:**
```json
{
  "text": "The Cotton Corporation of India has announced the Minimum Support Price procurement schedule across Gujarat and Maharashtra to support domestic farmers.",
  "title": "Cotton MSP Procurement Initiated",
  "source": "Textile Ministry Bulletin"
}
```

**Response (200 OK):**
```json
{
  "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "prediction": "REAL",
  "raw_label": "REAL",
  "confidence": 0.942,
  "confidence_percentage": 94.2,
  "model": "Logistic Regression",
  "category": "Cotton",
  "important_signals": [
    {
      "feature": "cotton",
      "weight": 0.1367,
      "indicator": "Credible Indicator"
    },
    {
      "feature": "support",
      "weight": 0.0886,
      "indicator": "Credible Indicator"
    }
  ],
  "notice": "Important notice: This prediction is generated from machine-learning patterns and should not be treated as definitive proof that the claim is true or false.",
  "created_at": "2026-02-15 10:30:00",
  "text_snippet": "The Cotton Corporation of India has announced the Minimum Support Price procurement schedule...",
  "title": "Cotton MSP Procurement Initiated",
  "source": "Textile Ministry Bulletin"
}
```

### `GET /model/performance`
Retrieve live model benchmark comparison and confusion matrix.

---

## 3. History Endpoints

### `GET /history`
Retrieve paginated, searchable history for the authenticated user.
*Query Parameters:*
- `page`: Integer (default 1)
- `limit`: Integer (default 10)
- `search`: String (optional search query)
- `prediction`: `REAL` or `FAKE`
- `category`: Textile subsector (e.g. `Cotton`, `Silk`, `Yarn`)

### `DELETE /history/{id}`
Delete a prediction record from history.

---

## 4. Dashboard Endpoints

### `GET /dashboard/stats`
Retrieve aggregated KPI statistics and time-series series for Recharts.

---

## 5. Admin Endpoints

### `GET /admin/users`
List all enrolled users *(Admin role required)*.

### `GET /admin/statistics`
Platform-wide system health and inference counts *(Admin role required)*.
