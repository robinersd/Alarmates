@echo off
title AlarmMates Real-Time Website & APK Hub Server
cd /d "%~dp0"
echo ============================================================================
echo   Starting AlarmMates Official Website + Real-Time APK Download Server...
echo   Opening http://localhost:3000 in your default browser...
echo ============================================================================
start "" "http://localhost:3000"
node server.mjs
pause
