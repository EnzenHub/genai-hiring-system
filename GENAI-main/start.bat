@echo off
setlocal enabledelayedexpansion
title GenAI Hiring System Launcher

echo.
echo ================================================================================
echo                          🚀 GenAI Hiring System Launcher
echo ================================================================================
echo.

REM Function to check if a command exists
where docker >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed or not in PATH
    echo 💡 Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

REM Check if Docker is running
echo 🔍 Checking Docker status...
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    echo 💡 Starting Docker Desktop... Please wait and try again.
    start "" "docker:///"
    pause
    exit /b 1
)
echo ✅ Docker is running

REM Check if .env exists
echo 🔍 Checking environment configuration...
if not exist ".env" (
    echo 📝 Creating .env file from template...
    copy env.example .env >nul
    if errorlevel 1 (
        echo ❌ Failed to create .env file
        pause
        exit /b 1
    )
    echo ✅ .env file created successfully
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file with your configuration!
    echo 🔧 Required settings:
    echo    - Database credentials (POSTGRES_USER, POSTGRES_PASSWORD)
    echo    - Email settings (SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD)
    echo    - Security keys (SECRET_KEY, JWT_SECRET_KEY)
    echo.
    echo 📝 Opening .env file for editing...
    notepad .env
    echo.
    echo Press any key after you've updated the .env file...
    pause
) else (
    echo ✅ .env file exists
)

REM Create necessary directories
echo 🔍 Creating required directories...
if not exist "logs" mkdir logs
if not exist "uploads" mkdir uploads
if not exist "database\init" mkdir database\init
echo ✅ Directories created

REM Stop any existing containers
echo 🛑 Stopping any existing containers...
docker-compose down >nul 2>&1

REM Pull latest images and build
echo 🔄 Pulling latest images and building containers...
docker-compose pull
docker-compose build --no-cache

echo 🐳 Starting services with Docker Compose...
docker-compose up -d

echo ⏳ Waiting for services to initialize...
echo    This may take 1-2 minutes for first startup...

REM Wait for PostgreSQL to be ready
echo 🔍 Waiting for PostgreSQL...
:wait_postgres
timeout /t 5 /nobreak >nul
docker-compose exec -T postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo    PostgreSQL still starting...
    goto wait_postgres
)
echo ✅ PostgreSQL is ready

REM Wait for Redis to be ready
echo 🔍 Waiting for Redis...
:wait_redis
timeout /t 2 /nobreak >nul
docker-compose exec -T redis redis-cli ping >nul 2>&1
if errorlevel 1 (
    echo    Redis still starting...
    goto wait_redis
)
echo ✅ Redis is ready

REM Wait for Backend to be ready
echo 🔍 Waiting for Backend API...
:wait_backend
timeout /t 5 /nobreak >nul
curl -f http://149.102.158.71:6002/health >nul 2>&1
if errorlevel 1 (
    echo    Backend still starting...
    goto wait_backend
)
echo ✅ Backend API is ready

REM Wait for Frontend to be ready
echo 🔍 Waiting for Frontend...
:wait_frontend
timeout /t 5 /nobreak >nul
curl -f http://149.102.158.71:6003 >nul 2>&1
if errorlevel 1 (
    echo    Frontend still starting...
    goto wait_frontend
)
echo ✅ Frontend is ready

echo.
echo ================================================================================
echo                           🎉 GenAI Hiring System Ready!
echo ================================================================================
echo.
echo 🌐 Application URLs:
echo    📱 Frontend (Main App):     http://localhost:3000
echo    🔧 Backend API:             http://localhost:8000
echo    📚 API Documentation:       http://localhost:8000/docs
echo    📊 API Health Check:        http://localhost:8000/health
echo.
echo 🗄️  Database Access:
echo    🐘 PostgreSQL:              localhost:5432
echo    📮 Redis:                   localhost:6379
echo.
echo 👥 Default Test Users (create after first login):
echo    🏢 Account Manager:         manager@example.com / password123
echo    👔 HR Representative:       hr@example.com / password123  
echo    ⚙️  System Admin:           admin@example.com / password123
echo.
echo 🔧 Management Commands:
echo    📋 View all logs:           docker-compose logs -f
echo    📋 View specific service:   docker-compose logs -f [service]
echo    🔄 Restart services:        docker-compose restart
echo    🛑 Stop all services:       docker-compose down
echo    🗑️  Remove all data:        docker-compose down -v
echo.
echo 📁 Important Directories:
echo    📤 File uploads:            ./uploads/
echo    📊 Application logs:        ./logs/
echo    🗃️  Database backups:       ./database/backups/
echo.
echo 🚀 Opening frontend in browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to exit launcher (services will continue running)...
pause >nul
