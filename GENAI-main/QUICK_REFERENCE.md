# 🚀 GenAI Hiring System - Quick Reference

Essential commands and URLs for daily operation of the GenAI Hiring System.

## 🌐 Application URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Main Application** | http://localhost:3000 | User interface |
| **API Endpoints** | http://localhost:8000 | REST API |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Health Check** | http://localhost:8000/health | System status |

## 🔧 Essential Commands

### Starting the System
```bash
# Windows
start.bat

# Linux/Mac
./start.sh
```

### Daily Operations
```bash
# Check all services status
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis
docker-compose logs -f frontend

# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stopping the System
```bash
# Stop all services (keeps data)
docker-compose down

# Stop and remove all data (DANGEROUS)
docker-compose down -v
```

## 🗄️ Database Commands

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d genai_hiring

# Common PostgreSQL commands (inside psql):
\dt                    # List tables
\d table_name         # Describe table
\q                    # Quit
```

### Database Backup
```bash
# Create backup
backup-database.bat        # Windows
./backup-database.sh       # Linux/Mac

# Generate SQL dump
generate-sql-dump.bat      # Windows
./generate-sql-dump.sh     # Linux/Mac
```

### Database Health
```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready -U postgres

# Check Redis status
docker-compose exec redis redis-cli ping
```

## 🔍 Troubleshooting Commands

### Service Health Checks
```bash
# Check if all containers are running
docker-compose ps

# Check resource usage
docker stats

# Check Docker system info
docker system df
docker system info
```

### Log Analysis
```bash
# Search for errors in logs
docker-compose logs | grep -i error
docker-compose logs | grep -i exception

# View recent logs only
docker-compose logs --tail=50

# Follow logs in real-time
docker-compose logs -f --tail=10
```

### Container Management
```bash
# Rebuild containers
docker-compose build --no-cache

# Pull latest images
docker-compose pull

# Remove unused containers and images
docker system prune -a

# Force recreate containers
docker-compose up -d --force-recreate
```

## 🔧 Configuration Files

### Key Files to Know
```
.env                    # Environment configuration
docker-compose.yml      # Container orchestration
uploads/               # Uploaded files
logs/                  # Application logs
database/backups/      # Database backups
```

### Environment Variables (in .env)
```env
# Database
POSTGRES_PASSWORD=your_password

# Email
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-key

# Ports (if needed to change)
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000
```

## 🚨 Emergency Commands

### System Recovery
```bash
# If containers won't start
docker-compose down
docker system prune -a
docker-compose build --no-cache
docker-compose up -d

# If database is corrupted
docker-compose down -v
# Restore from backup
docker-compose up -d
```

### Quick Fixes
```bash
# Backend not responding
docker-compose restart backend

# Frontend not loading
docker-compose restart frontend

# Database connection issues
docker-compose restart postgres backend

# Clear all data and restart fresh
docker-compose down -v
docker-compose up -d
```

## 📊 Monitoring

### Health Checks
```bash
# Quick system health
curl http://localhost:8000/health
curl http://localhost:3000

# Database connectivity
docker-compose exec postgres pg_isready -U postgres

# Redis connectivity
docker-compose exec redis redis-cli ping
```

### Performance Monitoring
```bash
# Container resource usage
docker stats

# Disk usage
docker system df

# Network connectivity between containers
docker network ls
docker network inspect genai-main_genai-network
```

## 🔐 User Management

### Default User Roles
- **Admin**: Full system access
- **HR**: Application and interview management
- **Account Manager**: Job posting management

### First-Time Setup
1. Start system: `start.bat` or `./start.sh`
2. Visit: http://localhost:3000
3. Register first admin user
4. Create additional users as needed

## 📧 Email Testing

### Verify Email Configuration
```bash
# Check backend logs for email errors
docker-compose logs backend | grep -i smtp
docker-compose logs backend | grep -i email

# Test email functionality
# 1. Create a job application
# 2. Check if notification emails are sent
# 3. Verify emails in inbox/spam folder
```

## 🛠️ Development Commands

### Code Changes
```bash
# Apply code changes (containers will auto-reload)
# No restart needed for development mode

# If changes don't reflect
docker-compose restart backend  # For backend changes
docker-compose restart frontend # For frontend changes
```

### Database Migrations
```bash
# Run database migrations (if needed)
docker-compose exec backend python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

## 📱 Mobile Testing

### Access from Mobile Device
1. Find your computer's IP address
2. Update REACT_APP_API_URL in .env to use your IP
3. Restart containers
4. Access from mobile: http://YOUR_IP:3000

## 🎯 Performance Tips

### Optimization
```bash
# Allocate more memory to Docker (Settings → Resources)
# Minimum: 4GB, Recommended: 6GB+

# Use SSD storage for better database performance

# On Windows: Enable WSL2 for better performance
```

### Cleanup
```bash
# Regular cleanup (run weekly)
docker system prune

# Deep cleanup (removes everything)
docker system prune -a --volumes
```

---

## 🆘 Quick Help

### If Something Goes Wrong:
1. **Check logs**: `docker-compose logs -f`
2. **Restart services**: `docker-compose restart`
3. **Check environment**: Verify `.env` file
4. **Verify Docker**: Ensure Docker Desktop is running
5. **Check ports**: Make sure no conflicts exist

### Get System Status:
```bash
# One command to check everything
docker-compose ps && echo "=== HEALTH CHECKS ===" && curl -s http://localhost:8000/health && echo "" && docker-compose exec -T postgres pg_isready -U postgres && docker-compose exec -T redis redis-cli ping
```

---

**💡 Bookmark this page for quick access to essential commands!**

*For detailed setup instructions, see [GETTING_STARTED.md](GETTING_STARTED.md)*
