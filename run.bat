@echo off
setlocal enabledelayedexpansion

title TRACE-X Local Launcher

echo ===================================================
echo     TRACE-X - Criminal Network Analysis Platform
echo ===================================================
echo.

cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not detected in PATH.
    echo Please install Node.js (v18+) to run TRACE-X.
    echo.
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo [INFO] First-time setup: Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Dependency installation failed.
        pause
        exit /b 1
    )
)

echo [INFO] Starting TRACE-X development server...
echo [INFO] Local URL: http://localhost:5173/
echo.

start "" http://localhost:5173/
call npm run dev

pause
