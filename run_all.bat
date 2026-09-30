@echo off
title Textile Fake News Detection - Launcher
echo ========================================================
echo   Textile Industry Fake News Detection System
echo ========================================================
echo.
echo Launching Backend server (FastAPI)...
start "Backend (FastAPI)" cmd /c "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
echo Launching Frontend server (React + Vite)...
start "Frontend (Vite)" cmd /c "%~dp0run_frontend.bat"
echo.
echo ========================================================
echo System is launching!
echo Backend Docs:  http://127.0.0.1:8000/docs
echo Frontend App:  http://localhost:5173
echo ========================================================
echo.
pause
