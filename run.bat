@echo off
title NEW LOOK Beauty Parlour - Launch Site
cd /d "%~dp0"
echo ==============================================
echo   NEW LOOK BEAUTY PARLOUR - STARTING DEV SERVER
echo ==============================================
echo.
echo Launching local server...
call npm run dev
pause
