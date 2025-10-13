# 🚀 GenAI Hiring System - Getting Started Guide

Welcome to the GenAI Hiring System! This guide will help you set up and run the complete application on your local machine.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Prerequisites Installation](#prerequisites-installation)
- [Quick Setup (5 Minutes)](#quick-setup-5-minutes)
- [Detailed Setup Steps](#detailed-setup-steps)
- [First-Time Configuration](#first-time-configuration)
- [Accessing the Application](#accessing-the-application)
- [Common Issues & Solutions](#common-issues--solutions)
- [Next Steps](#next-steps)

---

## 💻 System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- **RAM**: 4GB (8GB recommended)
- **Storage**: 5GB free space
- **Internet**: Required for initial setup and email features

### Recommended Specifications
- **RAM**: 8GB+ for smooth operation
- **Storage**: SSD for better database performance
- **CPU**: Multi-core processor for faster builds

---

## 🔧 Prerequisites Installation

### 1. Install Git
**Windows:**
- Download from: https://git-scm.com/download/windows
- Run installer with default settings

**macOS:**
```bash
# Using Homebrew
brew install git

# Or download from: https://git-scm.com/download/mac
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install git
```

### 2. Install Docker Desktop
**All Platforms:**
- Download from: https://www.docker.com/products/docker-desktop
- Install with default settings
- **Important**: Ensure Docker Desktop is running before proceeding

**System Configuration:**
- Allocate at least 4GB RAM to Docker
- Enable WSL2 (Windows users)

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd GENAI-main
```

### Step 2: Run the Setup Script
**Windows:**
```cmd
start.bat
```

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

### Step 3: Configure Environment
The script will automatically:
1. Create `.env` file from template
2. Open it for editing
3. Wait for you to configure required settings

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

**That's it! Your system should be running.** 🎉

---

## 📝 Detailed Setup Steps

### 1. Clone and Navigate
```bash
# Clone the repository
git clone <your-repository-url>
cd GENAI-main

# Verify files are present
ls -la  # Linux/Mac
dir     # Windows
```

### 2. Environment Configuration
The system will create a `.env` file from `env.example`. You **must** configure these settings:

#### Required Settings (System won't work without these):
```env
# Database credentials
POSTGRES_PASSWORD=your_secure_password_here

# Email configuration (for notifications)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security keys
SECRET_KEY=generate-a-long-random-string-here
JWT_SECRET_KEY=another-long-random-string-here
```

#### Optional Settings (can be changed later):
```env
# Ports (change if defaults conflict)
POSTGRES_PORT=5432
BACKEND_PORT=8000
FRONTEND_PORT=3000

# Application settings
ENVIRONMENT=development
DEBUG=true
```

### 3. Start the System
The `start.bat` (Windows) or `start.sh` (Linux/Mac) script will:
1. ✅ Check Docker is running
2. ✅ Create necessary directories
3. ✅ Build Docker containers
4. ✅ Start all services
5. ✅ Wait for services to be ready
6. ✅ Open the application in your browser

---

## 🔑 First-Time Configuration

### 1. Email Setup (Required)
For the system to send notifications, configure email:

**Gmail Example:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password": https://support.google.com/accounts/answer/185833
3. Use these settings in `.env`:
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_USE_TLS=true
EMAIL_FROM=your-email@gmail.com
```

**Other Email Providers:**
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Use your provider's settings

### 2. Create Admin User
After the system starts:
1. Go to http://localhost:3000
2. Click "Register" to create your first account
3. Use these recommended roles:
   - **Admin**: Full system access
   - **HR**: Manage applications and interviews
   - **Account Manager**: Manage jobs and candidates

### 3. Test the System
1. **Create a test job posting**
2. **Upload a sample resume** (PDF/DOC/DOCX)
3. **Verify email notifications work**
4. **Check the database connection**

---

## 🌐 Accessing the Application

### Main URLs
| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application interface |
| **Backend API** | http://localhost:8000 | REST API endpoints |
| **API Documentation** | http://localhost:8000/docs | Interactive API docs |
| **Health Check** | http://localhost:8000/health | System status |

### Default Test Users
After setup, create users with these roles:
- **admin@yourcompany.com** - System Administrator
- **hr@yourcompany.com** - HR Representative  
- **manager@yourcompany.com** - Account Manager

---

## 🐛 Common Issues & Solutions

### Issue 1: "Docker is not running"
**Solution:**
1. Start Docker Desktop
2. Wait for it to fully initialize (green icon)
3. Run the setup script again

### Issue 2: Port conflicts (Address already in use)
**Solution:**
```env
# In .env file, change conflicting ports
FRONTEND_PORT=3001
BACKEND_PORT=8001
POSTGRES_PORT=5433
```

### Issue 3: Email not sending
**Symptoms:** No notification emails received
**Solution:**
1. Verify email settings in `.env`
2. Check spam/junk folders
3. Test with Gmail app password
4. Restart backend: `docker-compose restart backend`

### Issue 4: Database connection failed
**Solution:**
```bash
# Check PostgreSQL status
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# View logs
docker-compose logs postgres
```

### Issue 5: Frontend not loading
**Solution:**
```bash
# Check frontend status
docker-compose ps frontend

# Restart frontend
docker-compose restart frontend

# Clear browser cache and reload
```

### Issue 6: Slow performance
**Solutions:**
1. **Increase Docker memory**: Docker Desktop → Settings → Resources → Memory → 6GB+
2. **Close other applications** to free up RAM
3. **Use SSD storage** if available
4. **Enable WSL2** (Windows users)

---

## 🔧 Management Commands

### Daily Operations
```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Restart all services
docker-compose restart

# Stop all services (data preserved)
docker-compose down

# Start services
docker-compose up -d
```

### Database Management
```bash
# Create database backup
backup-database.bat        # Windows
./backup-database.sh       # Linux/Mac

# Generate SQL dump
generate-sql-dump.bat      # Windows
./generate-sql-dump.sh     # Linux/Mac

# Connect to database directly
docker-compose exec postgres psql -U postgres -d genai_hiring
```

### Maintenance
```bash
# Update containers
docker-compose pull
docker-compose build --no-cache
docker-compose up -d

# Clean up unused Docker resources
docker system prune -a

# Reset everything (WARNING: Deletes all data)
docker-compose down -v
docker-compose up -d
```

---

## 📁 Important Directories

After setup, your project structure will include:

```
GENAI-main/
├── .env                    # Your configuration (DO NOT commit to Git)
├── uploads/               # Uploaded resumes and files
├── logs/                  # Application logs
├── database/
│   ├── init/             # Database initialization scripts
│   └── backups/          # Database backups
├── models/               # LLM models (if using local AI)
├── frontend/             # React.js application
├── backend/              # Python FastAPI application
├── start.bat            # Windows startup script
├── start.sh             # Linux/Mac startup script
└── GETTING_STARTED.md   # This file
```

---

## 🎯 Next Steps

### 1. Customize the System
- **Company Branding**: Update logos and colors
- **Email Templates**: Customize notification emails
- **Job Categories**: Add your industry-specific job types
- **Scoring Criteria**: Adjust resume scoring weights

### 2. Optional Enhancements
- **Google Meet API**: Enable automatic meeting creation
- **Local AI**: Set up Ollama for offline AI features
- **SSL/HTTPS**: Configure for production deployment
- **Monitoring**: Add health monitoring and alerts

### 3. Production Deployment
- **Environment**: Change `ENVIRONMENT=production`
- **Security**: Use strong passwords and keys
- **Backup**: Set up automated database backups
- **Monitoring**: Configure logging and monitoring

### 4. User Training
- **Create user accounts** for your team
- **Train HR staff** on the interview scheduling workflow
- **Set up job posting** templates
- **Configure scoring** thresholds for your needs

---

## 🆘 Getting Help

### If you encounter issues:

1. **Check the logs**:
   ```bash
   docker-compose logs -f
   ```

2. **Verify environment configuration**:
   - Ensure `.env` file has all required settings
   - Check email credentials are correct
   - Verify ports are not conflicting

3. **Restart services**:
   ```bash
   docker-compose restart
   ```

4. **Check system resources**:
   - Ensure Docker has enough memory (4GB+)
   - Close other applications if needed

5. **Review this guide** for common solutions

### Support Resources
- **Docker Documentation**: https://docs.docker.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Documentation**: https://reactjs.org/docs/

---

## ✅ Success Checklist

Confirm these items work:

- [ ] All containers are running (`docker-compose ps`)
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000/health
- [ ] You can create a user account
- [ ] Email notifications are sent
- [ ] You can create a job posting
- [ ] File upload works (resume upload)
- [ ] Database is storing data

**🎉 Congratulations! Your GenAI Hiring System is ready to use!**

---

*Need help? Check the troubleshooting section above or review the application logs for specific error messages.*
