# 🚀 Deploying Fake News Detection System on Render

This guide provides step-by-step instructions to deploy both the **FastAPI Backend** and the **React (Vite) Frontend** on [Render](https://render.com).

---

## 📋 Prerequisites

1. A **[GitHub](https://github.com/)** or **[GitLab](https://gitlab.com/)** repository with this project pushed.
2. A free account on **[Render.com](https://render.com/)**.
3. *(Optional)* A free **[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)** cluster. *(If not provided, the backend automatically uses its built-in in-memory datastore fallback).*

---

## ⚡ Method 1: Automatic Deployment using Render Blueprints (Recommended)

Render supports Infrastructure-as-Code via the [`render.yaml`](../render.yaml) file already configured in this repository.

1. Go to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top right and select **Blueprint**.
3. Connect your GitHub repository (`Fake-News-Detection`).
4. Render will read `render.yaml` and configure:
   - **`fake-news-backend`** (Python Web Service)
   - **`fake-news-frontend`** (Static Site with SPA rewrite rules)
5. Under `fake-news-backend` environment variables:
   - *(Optional)* Add `MONGODB_URI` with your MongoDB Atlas connection string.
6. Click **Apply**.
7. Render will build and deploy both services!

---

## 🛠️ Method 2: Manual Dashboard Setup

If you prefer setting up each service manually on Render's dashboard:

### Step 1: Deploy the FastAPI Backend (Web Service)

1. On the Render Dashboard, click **New +** → **Web Service**.
2. Select your repository.
3. Configure the settings:
   - **Name**: `fake-news-backend`
   - **Language**: `Python`
   - **Branch**: `main`
   - **Region**: Any (e.g., `Oregon (US West)` or closest to you)
   - **Root Directory**: *(Leave empty)*
   - **Build Command**:
     ```bash
     pip install --upgrade pip && pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   | Key | Value | Notes |
   |---|---|---|
   | `PYTHON_VERSION` | `3.12.0` | Python runtime version |
   | `PROJECT_NAME` | `Textile Fake News Detection System` | App Name |
   | `API_V1_PREFIX` | `/api/v1` | API Route Prefix |
   | `JWT_SECRET` | *(Click "Generate" or type a secret key)* | JWT encryption key |
   | `JWT_ALGORITHM` | `HS256` | Standard signing |
   | `JWT_EXPIRE_MINUTES` | `1440` | Token expiration |
   | `DATABASE_NAME` | `textile_fake_news` | MongoDB DB Name |
   | `MONGODB_URI` | `mongodb+srv://<user>:<pass>@cluster.mongodb.net` | *(Optional MongoDB Atlas URI)* |
5. Click **Deploy Web Service**.
6. Note your backend URL (e.g., `https://fake-news-backend.onrender.com`).

---

### Step 2: Deploy the React Frontend (Static Site)

1. On the Render Dashboard, click **New +** → **Static Site**.
2. Select your repository.
3. Configure the settings:
   - **Name**: `fake-news-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:
   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://fake-news-backend.onrender.com` |
   *(Replace with your actual backend URL from Step 1)*
5. Configure **Redirects / Rewrites** (under Static Site Settings):
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - *(This ensures React Router page reloads like `/detect` and `/history` work without 404s).*
6. Click **Deploy Static Site**.

---

## 🔑 Default Login Credentials

Once deployed, you can log in immediately using the pre-seeded admin or user accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@textile.org` | `Admin@123` |
| **Demo User** | `user@textile.org` | `User@123` |

*(Or register a new account on the register page).*

---

## 💡 Important Production Notes

1. **Free Tier Cold Starts**: Render's free tier spins down idle web services after 15 minutes of inactivity. The first request after sleep may take ~30-50 seconds to warm up.
2. **Database Fallback**: If you don't provide a `MONGODB_URI`, the backend automatically runs in **In-Memory Datastore** mode, complete with seeded demo data and models.
3. **ML Artifacts**: Pretrained model files (`model.pkl`, `vectorizer.pkl`, `metadata.json`) in `ml/models/` are bundled and loaded automatically at startup.
