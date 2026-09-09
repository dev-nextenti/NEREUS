@echo off
TITLE NEREUS Marine Intelligence & AI Platform
echo ================================================================
echo    Starting NEREUS Marine Intelligence & AI Voice Agent (24/7)
echo ================================================================

cd /d "%~dp0"

:: 1. Launch FastAPI Backend Daemon
echo [*] Starting FastAPI Backend on 0.0.0.0:8000...
start "NEREUS-Backend" /min cmd /c "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000"

:: 2. Launch ngrok Public Tunnel
echo [*] Launching ngrok Public Web Tunnel on port 8000...
start "NEREUS-Ngrok" /min cmd /c ""C:\Users\kadir\ngrok-new\ngrok.exe" http 8000 --log=stdout"

timeout /t 3 /nobreak >nul

echo.
echo ================================================================
echo    NEREUS is ONLINE!
echo    Local Access:  http://localhost:8000
echo    Network IP:    http://10.202.45.254:8000
echo    Check ngrok:   http://127.0.0.1:4040
echo ================================================================
