@echo off
rem ---------------------------------------------------------------
rem  Regenerate data/screenshots.json from assets/img/screenshots/.
rem  Run this after adding or renaming screenshots.
rem
rem  Usage:  screenshots.bat
rem ---------------------------------------------------------------
setlocal
chcp 65001 >nul

where node >nul 2>nul
if errorlevel 1 (
    echo.
    echo   ERROR: Node.js not found.
    echo   Install it from https://nodejs.org/ and run this again.
    echo.
    pause
    exit /b 1
)

node "%~dp0tools\screenshots.js"
set "EXITCODE=%ERRORLEVEL%"

if not "%EXITCODE%"=="0" (
    echo.
    echo   Failed with code %EXITCODE%.
    echo.
    pause
)

endlocal & exit /b %EXITCODE%
