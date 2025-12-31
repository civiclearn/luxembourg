@echo off
set PORT=8000

echo.
echo Serving static site at http://localhost:%PORT%
echo Press CTRL+C to stop.
echo.

python -m http.server %PORT%