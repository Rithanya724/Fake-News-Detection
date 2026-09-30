# System Architecture Document

## 1. System Overview
The **Textile Industry Fake News Detection System** is an end-to-end Machine Learning web application designed to evaluate the statistical credibility of textile-related news articles, trade announcements, policy notices, and market rumors.

```text
┌─────────────────────────────────────────────────────────┐
│                     USER / ANALYST                      │
└───────────────────────────┬─────────────────────────────┘
                            │ (HTTPS / REST)
                            ▼
┌─────────────────────────────────────────────────────────┐
│               REACT + TAILWIND FRONTEND                 │
│  - Vite Single-Page Application (SPA)                   │
│  - Component Hierarchy (Navbar, Console, Charts, Table) │
│  - JWT Bearer Authentication & Protected Routing        │
│  - Recharts Visualizations (Donut, Area, Bar)           │
└───────────────────────────┬─────────────────────────────┘
                            │ (JSON over HTTP /api/v1)
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 FASTAPI BACKEND SERVER                  │
│  - Uvicorn ASGI Web Server                              │
│  - Pydantic v2 Request/Response Schema Validation       │
│  - Dependency Injection (Authentication / RBAC)         │
│  - CORS Middleware & Centralized Error Handlers         │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────────────┐ ┌─────────────────────────┐
│      NLP & ML PIPELINE       │ │     MONGODB STORAGE     │
│  - Lowercasing & RegEx Clean │ │  - `users` Collection   │
│  - Tokenization & Stopwords  │ │  - `predictions` Logs   │
│  - TF-IDF Sparse Matrix      │ │  - `model_metrics`      │
│  - Logistic Regression Model │ │  - Indexed Queries      │
│  - Log-Odds Explainability   │ └─────────────────────────┘
└──────────────────────────────┘
```

## 2. Component Layers

### Layer 1: Client Presentation (Frontend)
- **Framework**: React 18+ with Vite tooling.
- **Styling**: Tailwind CSS with custom glassmorphism design tokens.
- **State Management**: React Context API (`AuthContext`) managing user session tokens and access states.
- **Charting**: Recharts for dynamic visual rendering of category distributions, confidence spreads, and activity timelines.

### Layer 2: API Gateway & Business Logic (Backend)
- **Framework**: FastAPI (Async Python ASGI framework).
- **Security**: Direct `bcrypt` password hashing with auto-generated salts; `python-jose` for signed HMAC-SHA256 JWT tokens with 24-hour expiration.
- **Modular Routers**:
  - `/auth`: Registration, login, and user profile.
  - `/predict`: News classification and signal explanation.
  - `/history`: Paginated and filtered prediction records.
  - `/dashboard`: Real-time aggregated KPIs and chart series.
  - `/admin`: Role-protected user management and platform health.

### Layer 3: Natural Language Processing & Machine Learning
- **Preprocessing Engine**: Pure-Python deterministic string transformation stripping HTML entities, URLs, punctuation, and 179 standard English stopwords.
- **Feature Extraction**: Scikit-Learn `TfidfVectorizer` (Sublinear TF enabled, Unigrams + Bigrams, max 3000 features).
- **Inference Engine**: `LogisticRegression` (L2 regularization, `C=1.0`, `max_iter=1000`).
- **Explainability Engine**: Mathematical product of non-zero TF-IDF token weights and model hyperplane coefficients ($w_i \cdot x_i$), categorizing tokens as *Credible Indicators* ($>0$) or *Misleading Indicators* ($<0$).

### Layer 4: Persistence (MongoDB)
- **Database**: MongoDB 6.0+ via PyMongo driver.
- **Resilience Engine**: Built-in in-memory fallback layer to allow seamless demo operation even when local MongoDB daemon is offline.
- **Indexes**: Unique index on user emails, compound and single indexes on `user_id`, `created_at`, `category`, and `raw_label`.
