# NEREUS Marine Intelligence & AI Platform — Persistent Runner
$HostDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $HostDir

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   NEREUS Marine Intelligence & AI Platform (Persistent 24/7)   " -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Cyan

# Test if port 8000 is already active
$portActive = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if (-not $portActive) {
    Write-Host "[*] Starting FastAPI Backend on 0.0.0.0:8000..." -ForegroundColor Yellow
    Start-Process -FilePath "python" -ArgumentList "-m uvicorn backend.main:app --host 0.0.0.0 --port 8000" -WindowStyle Hidden
} else {
    Write-Host "[+] FastAPI Backend is already running on port 8000." -ForegroundColor Green
}

# Test if ngrok is running
$ngrokProc = Get-Process -Name "ngrok" -ErrorAction SilentlyContinue
if (-not $ngrokProc) {
    Write-Host "[*] Starting ngrok Public Tunnel..." -ForegroundColor Yellow
    Start-Process -FilePath "C:\Users\kadir\ngrok-new\ngrok.exe" -ArgumentList "http 8000 --log=stdout" -WindowStyle Hidden
} else {
    Write-Host "[+] ngrok is already running." -ForegroundColor Green
}

Start-Sleep -Seconds 3
Write-Host "`nAll services active." -ForegroundColor Green
Write-Host "Local URL:   http://localhost:8000" -ForegroundColor White
Write-Host "Network URL: http://10.202.45.254:8000" -ForegroundColor White
Write-Host "Tunnel Info: http://127.0.0.1:4040" -ForegroundColor White
