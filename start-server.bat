@echo off
chcp 65001 > nul
title Дадлага.mn Full-Stack Сервер
echo ========================================================
echo   🚀 Дадлага.mn Full-Stack Серверийг асааж байна...
echo   📦 SQLite Сан: dadlaga.db
echo   🌐 Хаяг: http://localhost:3000
echo ========================================================
echo.
echo Веб сайтыг хөтөч дээр нээж байна...
start http://localhost:3000
echo.
echo Серверийг ажиллуулж байна. Цонхыг хаавал сервер унтарна.
node server.js
pause
