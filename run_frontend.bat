@echo off
title Textile Fake News Detection - Frontend (Vite React)
echo Starting React Vite Frontend server...
cd /d "%~dp0frontend"
node .\node_modules\vite\bin\vite.js --host 127.0.0.1 --port 5173
pause
