# ✅ GenAI Hiring System - Setup Checklist

Use this checklist to ensure you have everything set up correctly for the GenAI Hiring System.

## 📋 Pre-Setup Requirements

### System Requirements
- [ ] **Operating System**: Windows 10/11, macOS 10.15+, or Linux Ubuntu 18.04+
- [ ] **RAM**: At least 4GB available (8GB recommended)
- [ ] **Storage**: At least 5GB free space
- [ ] **Internet Connection**: Required for initial setup and email features

### Required Software
- [ ] **Git** installed and accessible from command line
  ```bash
  git --version  # Should show version number
  ```
- [ ] **Docker Desktop** installed and running
  ```bash
  docker --version  # Should show version number
  docker-compose --version  # Should show version number
  ```
- [ ] **Docker Desktop** allocated at least 4GB RAM (Settings → Resources → Memory)

## 🚀 Setup Process

### Step 1: Repository Setup
- [ ] Repository cloned successfully
  ```bash
  git clone <repository-url>
  cd GENAI-main
  ```
- [ ] All files present (verify `start.bat`, `docker-compose.yml`, `env.example` exist)

### Step 2: Environment Configuration
- [ ] `.env` file created from `env.example`
- [ ] **Database password** set (strong password recommended)
  ```env
  POSTGRES_PASSWORD=your_secure_password_here
  ```
- [ ] **Email configuration** completed
  ```env
  SMTP_USERNAME=your-email@gmail.com
  SMTP_PASSWORD=your-app-password
  ```
- [ ] **Security keys** generated (use long random strings)
  ```env
  SECRET_KEY=your-super-secure-secret-key
  JWT_SECRET_KEY=your-jwt-secret-key
  ```

### Step 3: Initial Startup
- [ ] Docker Desktop is running (green icon in system tray)
- [ ] Setup script executed successfully
  - Windows: `start.bat`
  - Linux/Mac: `./start.sh`
- [ ] All containers started without errors
  ```bash
  docker-compose ps  # All services should show "Up"
  ```

### Step 4: Service Verification
- [ ] **PostgreSQL** is healthy
  ```bash
  docker-compose exec postgres pg_isready -U postgres
  # Should return: postgres:5432 - accepting connections
  ```
- [ ] **Redis** is responding
  ```bash
  docker-compose exec redis redis-cli ping
  # Should return: PONG
  ```
- [ ] **Backend API** is accessible
  - Visit: http://localhost:8000/health
  - Should return: `{"status": "healthy"}`
- [ ] **Frontend** is loading
  - Visit: http://localhost:3000
  - Should show the login/register page

## 🔧 Functional Testing

### Authentication System
- [ ] Can create a new user account
- [ ] Can log in with created credentials
- [ ] Can log out successfully
- [ ] Password reset functionality works (if implemented)

### Core Features
- [ ] Can create a job posting (Account Manager role)
- [ ] Can upload a resume file (PDF/DOC/DOCX)
- [ ] Resume parsing works (extracts name, email, skills)
- [ ] Email notifications are sent and received
- [ ] Can navigate between different dashboards

### Email System
- [ ] **Test email sending**:
  1. Create a job application
  2. Check if notification emails are sent
  3. Verify emails arrive in inbox (check spam folder too)
- [ ] **Email configuration verified**:
  - SMTP server connects successfully
  - No authentication errors in logs

## 🗄️ Database Verification

### Database Connection
- [ ] Can connect to PostgreSQL
  ```bash
  docker-compose exec postgres psql -U postgres -d genai_hiring
  ```
- [ ] Tables are created (run `\dt` in psql to list tables)
- [ ] Can insert and retrieve data

### Data Persistence
- [ ] Data survives container restarts
  ```bash
  docker-compose restart
  # Check if your created users/jobs still exist
  ```

## 🔍 Troubleshooting Verification

### Common Issues Resolved
- [ ] **Port conflicts**: If default ports conflict, custom ports in `.env` work
- [ ] **Memory issues**: Docker has sufficient memory allocated
- [ ] **Permission issues**: All containers can write to mounted volumes
- [ ] **Network connectivity**: Containers can communicate with each other

### Log Verification
- [ ] **No critical errors** in container logs
  ```bash
  docker-compose logs | grep -i error
  # Should show minimal or no critical errors
  ```
- [ ] **Application logs** are being generated in `./logs/` directory

## 🚀 Performance Verification

### Response Times
- [ ] **Frontend loads** within 5 seconds
- [ ] **API responses** are under 2 seconds for basic operations
- [ ] **File uploads** complete successfully
- [ ] **Database queries** execute without timeout

### Resource Usage
- [ ] **Docker containers** are not consuming excessive CPU
  ```bash
  docker stats  # Monitor resource usage
  ```
- [ ] **System remains responsive** during normal operation

## 🎯 Production Readiness (Optional)

### Security Configuration
- [ ] Strong passwords used for all accounts
- [ ] Environment variables contain no default/example values
- [ ] `.env` file is not committed to version control
- [ ] Google Meet API configured (if using automatic meeting creation)

### Backup and Recovery
- [ ] Database backup script works
  ```bash
  backup-database.bat  # Windows
  ./backup-database.sh # Linux/Mac
  ```
- [ ] SQL dump generation works
  ```bash
  generate-sql-dump.bat  # Windows
  ./generate-sql-dump.sh # Linux/Mac
  ```

### Monitoring
- [ ] Health check endpoints respond correctly
- [ ] Log files are rotating properly
- [ ] System monitoring configured (if required)

## ✅ Final Verification

### Complete System Test
1. **Create a complete workflow**:
   - [ ] Create user accounts (Admin, HR, Account Manager)
   - [ ] Create a job posting
   - [ ] Submit an application with resume
   - [ ] Verify scoring and status updates
   - [ ] Schedule an interview (if implemented)
   - [ ] Check all email notifications

2. **Verify data persistence**:
   - [ ] Stop all containers: `docker-compose down`
   - [ ] Start containers: `docker-compose up -d`
   - [ ] Confirm all data is still present

3. **Performance validation**:
   - [ ] System handles multiple concurrent users
   - [ ] Large file uploads work correctly
   - [ ] Database queries remain fast with sample data

## 📋 Success Criteria

### Minimum Viable Setup
- [ ] All containers running and healthy
- [ ] Frontend accessible and functional
- [ ] Backend API responding correctly
- [ ] Database connected and persistent
- [ ] Basic user authentication working
- [ ] File upload functionality working

### Full Feature Setup
- [ ] Email notifications working
- [ ] AI/LLM integration functional
- [ ] Google Meet integration configured
- [ ] All user roles and permissions working
- [ ] Complete hiring workflow functional
- [ ] Backup and maintenance scripts working

## 🎉 Completion

### When all items are checked:
- [ ] **System is ready for use**
- [ ] **Team can be onboarded**
- [ ] **Production deployment can proceed** (if applicable)
- [ ] **Documentation has been reviewed**

### Next Steps:
1. **User Training**: Train your team on the system
2. **Customization**: Customize branding and settings
3. **Integration**: Connect with existing HR tools (if needed)
4. **Monitoring**: Set up ongoing monitoring and maintenance

---

**🎊 Congratulations! Your GenAI Hiring System is fully set up and ready to revolutionize your hiring process!**

*Save this checklist for future reference and share it with team members who need to set up the system.*
