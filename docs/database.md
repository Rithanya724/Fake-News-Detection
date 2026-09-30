# Database Architecture Document

## 1. Database Overview
- **Database Engine**: MongoDB
- **Database Name**: `textile_fake_news`
- **Driver**: PyMongo (`pymongo>=4.6.0`)
- **Connection URI**: Configured via `MONGODB_URI` in `.env`

---

## 2. Collections & Document Schemas

### A. `users` Collection
Stores registered user accounts with encrypted credentials and role-based permissions.

```json
{
  "_id": "uuid-string-or-objectid",
  "name": "Student Analyst",
  "email": "analyst@textile.org",
  "password_hash": "$2b$12$K8yXv1...",
  "role": "user",
  "created_at": "2026-02-15 09:30:00"
}
```

**Indexes:**
- `email`: Unique Index (`ASCENDING`)

---

### B. `predictions` Collection
Stores historical inference results with feature signals and classification metadata.

```json
{
  "_id": "uuid-string",
  "user_id": "uuid-of-user-or-anonymous",
  "title": "Cotton MSP Procurement Schedule",
  "text": "The Cotton Corporation of India has announced...",
  "text_snippet": "The Cotton Corporation of India has announced...",
  "source": "Direct Input",
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
    }
  ],
  "notice": "Important notice: This prediction is generated from...",
  "created_at": "2026-02-15 10:30:00"
}
```

**Indexes:**
- `user_id`: Index (`ASCENDING`)
- `created_at`: Index (`DESCENDING`)
- `category`: Index (`ASCENDING`)
- `raw_label`: Index (`ASCENDING`)

---

### C. `model_metrics` Collection
Stores versioned training run statistics, hyperparameter configurations, and comparison matrices.

```json
{
  "_id": "uuid-string",
  "model_name": "Logistic Regression",
  "model_version": "1.0.0",
  "trained_date": "2026-02-15 19:31:02",
  "dataset_records": 279,
  "vocabulary_size": 976,
  "metrics": {
    "accuracy": 1.0,
    "precision": 1.0,
    "recall": 1.0,
    "f1_score": 1.0,
    "confusion_matrix": [[30, 0], [0, 26]]
  }
}
```

---

## 3. In-Memory Resilient Fallback Store
To guarantee 100% testability and prevent execution blockers during college viva presentations or environments where the local MongoDB service is inactive, the application includes a drop-in PyMongo emulator (`InMemoryCollection`) in [`backend/app/database/mongodb.py`](file:///d:/Fake%20News%20Detection/backend/app/database/mongodb.py) that provides identical query semantics.
