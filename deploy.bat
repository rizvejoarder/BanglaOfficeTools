@echo off
echo 🚀 Building BanglaOfficeTools for deployment...
echo.

call npm run build:deploy

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

echo.
echo ✅ Build successful!
echo 📁 Files are ready in the 'dist' folder
echo.
echo 📋 Next steps:
echo 1. Open your hosting control panel or FTP client
echo 2. Upload ALL contents of the 'dist' folder to your domain root
echo 3. Do NOT upload the 'dist' folder itself, only its contents
echo 4. Your app will be available at your domain
echo.
echo 🌐 For subdomain deployment, see DEPLOYMENT-GUIDE.md
echo.
pause
