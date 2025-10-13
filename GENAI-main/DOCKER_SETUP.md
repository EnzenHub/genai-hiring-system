# 🐳 GenAI Hiring System - Docker Setup Guide

This guide explains the complete Docker containerization setup for the GenAI Hiring System.

## 📋 Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Container Architecture](#container-architecture)
- [Environment Configuration](#environment-configuration)
- [Database Management](#database-management)
- [Maintenance Scripts](#maintenance-scripts)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The GenAI Hiring System is fully containerized using Docker Compose with the following services:

- **Frontend**: React.js application (Port 3000)
- **Backend**: FastAPI Python application (Port 8000)
- **PostgreSQL**: Database server (Port 5432)
- **Redis**: Caching and session storage (Port 6379)
- **Ollama**: Optional local LLM service (Port 11434)

## 📦 Prerequisites

1. **Docker Desktop**: Install from [docker.com](https://www.docker.com/products/docker-desktop)
2. **Git**: For cloning the repository
3. **4GB+ RAM**: Recommended for smooth operation
4. **5GB+ Disk Space**: For containers and data

## 🚀 Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd GENAI-main
```

### 2. Start the System
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Container Architecture

### Network Configuration
All services run on a custom Docker network `genai-network` for secure inter-container communication.

### Service Dependencies
```
Frontend → Backend → PostgreSQL + Redis
              ↓
           Ollama (Optional)
```

### Health Checks
All services include health checks with automatic restart policies:
- **PostgreSQL**: `pg_isready` check
- **Redis**: `redis-cli ping` check
- **Backend**: HTTP health endpoint
- **Frontend**: HTTP availability check

## ⚙️ Environment Configuration

### Required Environment Variables

Copy `env.example` to `.env` and configure:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=genai_hiring

# Email (Required for notifications)
SMTP_SERVER=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security
SECRET_KEY=your-super-secure-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
```

### Optional Configurations

```env
# Ports (if defaults conflict)
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000
REDIS_PORT=6379

# Ollama LLM
OLLAMA_PORT=11434
OLLAMA_MODEL=qwen2.5:3b-instruct
```

## 🗄️ Database Management

### Automatic Backups
```bash
# Create database backup
backup-database.bat

# Generate SQL dump
generate-sql-dump.bat
```

### Manual Database Operations
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d genai_hiring

# View database logs
docker-compose logs postgres

# Reset database (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d postgres
```

### Database Dump Location
Generated SQL dumps are saved as:
- **File**: `genai_hiring_database_dump.sql`
- **Size**: ~565KB (current database)
- **Contains**: Complete schema and data

## 🛠️ Maintenance Scripts

### Start System
```bash
start.bat                    # Full startup with health checks
```

### Database Operations
```bash
backup-database.bat          # Create timestamped backup
generate-sql-dump.bat        # Generate complete SQL dump
```

### Docker Management
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## 📊 Container Resources

### Resource Allocation
- **PostgreSQL**: 256MB RAM, persistent storage
- **Redis**: 256MB RAM limit, AOF persistence
- **Backend**: 1 worker process, health monitoring
- **Frontend**: Development server, hot reload
- **Ollama**: GPU acceleration if available

### Volume Mounts
- `postgres_data`: Database files
- `redis_data`: Redis persistence
- `./uploads`: File uploads
- `./logs`: Application logs
- `./models`: LLM models

## 🔧 Advanced Configuration

### Production Deployment
For production, modify:

```yaml
# docker-compose.prod.yml
environment:
  - ENVIRONMENT=production
  - DEBUG=false
command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### SSL/HTTPS Setup
Add reverse proxy (nginx) for SSL termination:

```yaml
nginx:
  image: nginx:alpine
  ports:
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/nginx/ssl
```

### Monitoring
Add monitoring services:

```yaml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
```

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep :3000

# Change ports in .env
FRONTEND_PORT=3001
BACKEND_PORT=8001
```

#### 2. Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose ps postgres

# View database logs
docker-compose logs postgres

# Reset database connection
docker-compose restart postgres backend
```

#### 3. Memory Issues
```bash
# Check container memory usage
docker stats

# Increase Docker Desktop memory allocation
# Settings → Resources → Memory → 4GB+
```

#### 4. Build Failures
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose build --no-cache
```

### Log Locations

- **Application Logs**: `./logs/`
- **Container Logs**: `docker-compose logs [service]`
- **Database Logs**: `docker-compose logs postgres`
- **System Logs**: Docker Desktop → Containers

### Performance Optimization

1. **Increase Docker Memory**: 4GB+ recommended
2. **Use SSD Storage**: For database performance
3. **Enable WSL2**: On Windows for better performance
4. **Prune Unused Images**: `docker system prune -a`

## 📋 Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Email settings tested
- [ ] Database backup created
- [ ] SSL certificates ready (production)
- [ ] Resource limits set

### Post-deployment
- [ ] Health checks passing
- [ ] Application accessible
- [ ] Database migrations applied
- [ ] Test users created
- [ ] Monitoring configured

## 🆘 Support

For issues:
1. Check container logs: `docker-compose logs`
2. Verify environment variables
3. Ensure Docker Desktop is running
4. Check port availability
5. Review this troubleshooting guide

---

**🎉 Your GenAI Hiring System is now fully containerized and ready for production!**
