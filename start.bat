@echo off
title FoodLoop Surplus Food Redistribution Platform
echo ========================================================
echo   FoodLoop - Next-Gen Surplus Food Network
echo ========================================================
echo.
echo [1/2] Launching browser at http://localhost:3001 ...
start http://localhost:3001
echo.
echo [2/2] Starting FoodLoop API & Web Server...
echo.
node server.js
pause
