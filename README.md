# Textile Industry Fake News Detection System

[![Python Version](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.0+-61DAFB.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-646CFF.svg)](https://vitejs.dev/)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-1.4+-F7931E.svg)](https://scikit-learn.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg)](https://tailwindcss.com/)

A production-style academic Capstone Project designed to detect whether textile-industry-related news and claims are **REAL** or **POTENTIALLY MISLEADING / FAKE** using Natural Language Processing (NLP) and Machine Learning (ML).

---

## Table of Contents
- [Problem Statement & Objective](#problem-statement--objective)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Dataset & NLP Pipeline](#dataset--nlp-pipeline)
- [Empirical Model Benchmarks](#empirical-model-benchmarks)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Academic Disclosures & Limitations](#academic-disclosures--limitations)
- [Future Enhancements](#future-enhancements)
- [Project Team](#project-team)

---

## Problem Statement & Objective
The textile and apparel industry is heavily influenced by rapid market rumors regarding Minimum Support Prices (MSP), sudden export/import tariff changes, fictitious subsidy programs, and synthetic fabric health scares. These rumors cause market panic and financial losses for farmers, spinning mills, and exporters.

This project delivers an end-to-end web system that ingests textile news, runs deterministic NLP preprocessing, vectorizes text via TF-IDF, classifies content using a primary **Logistic Regression** model, extracts feature log-odds explainability signals, and logs inferences to MongoDB for audit history and executive analytics.

---

## System Architecture

```text
User / Analyst
      │
      ▼
React 18 + Tailwind CSS + Lucide Icons + Recharts (Vite SPA)
      │
      ▼  REST API (JWT Bearer Token / HTTP JSON)
FastAPI Backend (Uvicorn / Pydantic v2 / Async Routers)
      │
      ├───────────────────────────────┐
      ▼                               ▼
NLP Preprocessing & TF-IDF Vectorizer   MongoDB Database
      │                               (users, predictions, model_metrics)
      ▼
Machine Learning Model (Logistic Regression)
      │
      ▼
Confidence Score + Feature Explainability Signals
```

---

## Key Features
1. **Interactive Detection Console**: Large text ingestion with 1-click sample news pre-loaders (Cotton MSP, Export Ban hoaxes, Silk Cocoon reports, Exploding Polyester hoaxes).
2. **Feature Explainability Signals**: Extracts mathematical log-odds token weights indicating *Credible Indicators* vs *Misleading Indicators*.
3. **Executive Analytics Dashboard**: Interactive Recharts visualizations (Real vs Misleading Donut Chart, Daily Timeline Area Chart, Confidence Distribution Bar Chart, and Category Distribution Chart).
4. **Comprehensive Audit History**: Paginated, searchable, and filterable history with full-detail inspection modals and deletion controls.
5. **Role-Based Authentication**: JWT-based authentication supporting **Analysts** (Users) and **System Administrators** (Admins) with pre-seeded demo accounts.
6. **Administrator Portal**: Platform-wide telemetry, user management, and health diagnostics.
7. **Empirical Benchmarks**: Live analytics comparing Logistic Regression, Multinomial Naive Bayes, and Random Forest models on identical stratified splits.

---

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Custom Dark Glassmorphic Theme)
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios with JWT Interceptors
- **Routing**: React Router v6

### Backend
- **Framework**: Python 3.12 + FastAPI
- **Server**: Uvicorn (ASGI)
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Security**: Direct Bcrypt password hashing + `python-jose` JWT tokens

### Machine Learning & NLP
- **Libraries**: Scikit-Learn, Pandas, NumPy, Joblib
- **Text Representation**: `TfidfVectorizer` (Sublinear TF, Unigrams + Bigrams, 976 vocabulary features)
- **Primary Classifier**: `LogisticRegression` (C=1.0, max_iter=1000)
- **Benchmarked Classifiers**: `MultinomialNB`, `RandomForestClassifier`

### Database
- **Database**: MongoDB (via PyMongo) with a built-in resilient In-Memory fallback store for zero-setup execution.

---

## Dataset & NLP Pipeline

### 14 Textile Sectors Covered
- **Natural Fibers**: Cotton, Silk, Wool
- **Processing**: Yarn & Spinning, Fabrics & Weaving, Garments & Apparel
- **Engineering & Trade**: Machinery & Automation, Technology & Smart Textiles, Exports & Logistics
- **Governance & Policy**: Government Subsidies (PM MITRA, TUFS), Trade Policies (RoDTEP, FTAs), Commodity Prices, Sustainability & ESG, Labour Standards

### Preprocessing Protocol
1. HTML Entity Unescaping and Tag Stripping (`<.*?>`)
2. URL Removal (`https?://\S+|www\.\S+`)
3. Unicode NFKD Normalization and Special Character Removal (`[^a-zA-Z0-9\s]`)
4. Tokenization and Standard Stopword Stripping (179 stop words)

---

## Empirical Model Benchmarks

Evaluation performed on an unseen 20% stratified test split (Zero Data Leakage):

| Model Architecture | Accuracy | Precision (Fake) | Recall (Fake) | F1-Score | Role |
|---|---|---|---|---|---|
| **Logistic Regression** | **100.00%** | **100.00%** | **100.00%** | **100.00%** | **Primary Engine** |
| Multinomial Naive Bayes | 100.00% | 100.00% | 100.00% | 100.00% | Benchmarked |
| Random Forest Classifier | 94.64% | 100.00% | 88.46% | 93.88% | Benchmarked |

---

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) MongoDB 6.0+ or Docker

### 1. Clone & Set Up Python Virtual Environment
```bash
# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

### 2. Set Up Environment Variables
Copy `.env.example` to `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=textile_fake_news
JWT_SECRET=textile_secure_jwt_secret_key_change_in_production_2026
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:5173
PROJECT_NAME="Textile Fake News Detection System"
```

---

## Running the Project

### Step 1: Train ML Models (Generates Model Artifacts)
```powershell
# 1. Train primary Logistic Regression model
python ml/train.py

# 2. Benchmark all 3 candidate models
python ml/compare_models.py

# 3. Test prediction and explainability
python ml/test_prediction.py
```

### Step 2: Start FastAPI Backend
```powershell
cd backend
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
Backend will be live at `http://127.0.0.1:8000`.
Interactive API docs at `http://127.0.0.1:8000/docs`.

### Step 3: Start React Frontend
```powershell
cd frontend
npm install
npm run dev
```
Frontend will be live at `http://localhost:5173`.

### Pre-seeded Demo Credentials
- **Standard Analyst**: `user@textile.org` / `User@123`
- **System Administrator**: `admin@textile.org` / `Admin@123`

---

## API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health status | Public |
| `POST` | `/api/v1/auth/register` | Register user account | Public |
| `POST` | `/api/v1/auth/login` | Authenticate user & issue JWT | Public |
| `GET` | `/api/v1/auth/me` | Current user profile | Authenticated |
| `POST` | `/api/v1/predict` | Predict news credibility & signals | Public / Auth |
| `GET` | `/api/v1/model/performance` | Live benchmark & confusion matrix | Public |
| `GET` | `/api/v1/history` | Paginated, filterable history | Authenticated |
| `DELETE` | `/api/v1/history/{id}` | Delete prediction record | Authenticated |
| `GET` | `/api/v1/dashboard/stats` | Aggregated dashboard KPI metrics | Authenticated |
| `GET` | `/api/v1/admin/users` | List enrolled users | Admin Only |
| `GET` | `/api/v1/admin/statistics` | Global platform metrics | Admin Only |

---

## Testing

Run the automated backend test suite:
```powershell
pytest backend/tests/test_api.py -v
```

---

## Academic Disclosures & Limitations
1. **Statistical Nature**: The system classifies text based on learned lexical and stylistic patterns. Predictions do not constitute mathematical proof of real-world factual veracity.
2. **Domain Boundary**: Articles discussing non-textile domains (e.g. general celebrity gossip) may produce lower confidence classifications.
3. **Academic Provenance**: Curated academic benchmark datasets are used for statistical pattern modeling.

---

## Future Enhancements
- **Transformer Architectures**: Integrating fine-tuned RoBERTa / DeBERTa models.
- **Multilingual Support**: Processing vernacular regional languages (Tamil, Hindi, Gujarati).
- **Automated Web Scraping**: Ingesting live DGFT and Ministry gazette notifications.
- **Browser Extension**: Real-time credibility badges on textile trade websites.

---

## Project Team
- **Department**: Computer Science & Engineering / Data Analytics
- **Project Title**: Textile Industry Fake News Detection System
- **Academic Year**: 2025–2026
