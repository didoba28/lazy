@echo off
REM Helper Windows : double-clique pour lancer un build de production (npm run build).
SET "PATH=C:\Users\user\Downloads\node-extracted\node-v25.9.0-win-x64;%PATH%"
cd /d "%~dp0"
npm run build
pause
