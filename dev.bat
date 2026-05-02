@echo off
REM Helper Windows : double-clique ce fichier pour lancer le dev server.
REM Il ajoute Node (portable) au PATH puis lance "npm run dev".
SET "PATH=C:\Users\user\Downloads\node-extracted\node-v25.9.0-win-x64;%PATH%"
cd /d "%~dp0"
echo.
echo === TKA driver - dev server ===
echo Site dispo sur http://localhost:3000  (redirige vers /fr)
echo Ctrl+C pour arreter.
echo.
npm run dev
pause
