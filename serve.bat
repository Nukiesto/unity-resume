@echo off
rem ---------------------------------------------------------------
rem  Local launcher for the portfolio site.
rem  All logic lives in tools\serve.ps1 (kept ASCII here so the
rem  batch parser never mangles non-latin characters).
rem
rem  Usage:  serve.bat          (default port 8080)
rem          serve.bat 9000     (custom port)
rem ---------------------------------------------------------------
setlocal
chcp 65001 >nul
set "SCRIPT=%~dp0tools\serve.ps1"

if not exist "%SCRIPT%" (
    echo.
    echo   ERROR: tools\serve.ps1 not found.
    echo   Make sure you run this file from the repository root.
    echo.
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT%" %*
set "EXITCODE=%ERRORLEVEL%"

if not "%EXITCODE%"=="0" (
    echo.
    echo   Launcher exited with code %EXITCODE%.
    echo.
    pause
)

endlocal & exit /b %EXITCODE%
