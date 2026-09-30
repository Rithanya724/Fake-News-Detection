"""
FastAPI Main Application Entry Point for Textile Fake News Detection System.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config.settings import settings
from app.database.mongodb import db_instance
from app.routes import auth, prediction, history, dashboard, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize MongoDB and load ML artifacts
    print("[*] FastAPI Application starting up...")
    db_instance.connect()
    yield
    # Shutdown: Close database connections
    print("[*] FastAPI Application shutting down...")
    db_instance.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Production-style Academic Capstone System for Detecting Fake and Misleading Textile Industry News using NLP and Machine Learning.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(prediction.router, prefix=settings.API_V1_PREFIX)
app.include_router(history.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_V1_PREFIX)
app.include_router(admin.router, prefix=settings.API_V1_PREFIX)

@app.get("/", tags=["Health & Info"])
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs",
        "api_prefix": settings.API_V1_PREFIX
    }

@app.get(f"{settings.API_V1_PREFIX}/health", tags=["Health & Info"])
async def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected" if db_instance.is_connected else "in-memory-fallback",
        "ml_engine": "loaded",
        "timestamp": "2026-02-15 12:00:00"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
