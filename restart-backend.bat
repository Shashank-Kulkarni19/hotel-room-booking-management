@echo off
echo ========================================
echo Restarting Hotel Booking Backend
echo ========================================
echo.

echo Step 1: Stopping existing backend process...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul

echo.
echo Step 2: Please restart the backend from your IDE
echo        (IntelliJ IDEA / Eclipse / VS Code)
echo.
echo OR if you have Maven installed:
echo   cd backend
echo   mvn clean spring-boot:run
echo.
echo ========================================
pause
