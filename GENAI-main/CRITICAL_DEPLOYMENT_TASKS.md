# 🚨 CRITICAL TASKS - MUST COMPLETE BEFORE DEPLOYMENT

## ⚠️ IMMEDIATE ACTIONS REQUIRED

### 1. 🔐 SECURITY CONFIGURATION (CRITICAL)

#### Generate Strong Security Keys
```bash
# Generate secure keys (run these commands)
openssl rand -base64 32  # For SECRET_KEY
openssl rand -base64 32  # For JWT_SECRET_KEY
```

#### Update .env File with Production Values
```bash
# CRITICAL: Replace these placeholder values in .env
SECRET_KEY=your_generated_secret_key_here
JWT_SECRET_KEY=your_generated_jwt_secret_key_here
POSTGRES_PASSWORD=your_secure_database_password_here
```

### 2. 🌐 DOMAIN CONFIGURATION (CRITICAL)

#### DNS Setup Required
- [ ] Purchase domain (e.g., `yourdomain.com`)
- [ ] Configure DNS A records:
  - `yourdomain.com` → Your server IP
  - `api.yourdomain.com` → Your server IP
  - `www.yourdomain.com` → Your server IP

#### Update Environment Variables
```bash
# Update these in .env file
FRONTEND_URL=https://yourdomain.com
API_BASE_URL=https://api.yourdomain.com
REACT_APP_API_URL=https://api.yourdomain.com
ALLOWED_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com","https://api.yourdomain.com"]
```

### 3. 📧 EMAIL CONFIGURATION (CRITICAL)

#### Gmail Setup (Recommended)
1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update .env**:
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your_16_character_app_password
EMAIL_FROM=your-email@gmail.com
```

### 4. 🐳 DOCKER CONFIGURATION (CRITICAL)

#### Create Production Docker Compose File
You need to create `docker-compose.prod.yml` based on the CONTABO_DEPLOYMENT_GUIDE.md

#### Update Dockerfile for Production
- Create `frontend/Dockerfile.prod` for optimized production builds
- Update backend Dockerfile for production optimizations

### 5. 🔧 BACKEND CODE CHANGES (CRITICAL)

#### Implement Dynaconf Configuration
- [ ] Update `backend/requirements.txt` to include `dynaconf==3.2.4`
- [ ] Replace `backend/app/config.py` with Dynaconf implementation
- [ ] Create `backend/settings.toml` for environment-specific settings

#### Update All Localhost References
- [ ] Update `backend/app/main.py` for production CORS and security
- [ ] Update `backend/app/utils/email.py` for dynamic URLs
- [ ] Update all API endpoints to use environment-based URLs

### 6. 🎨 FRONTEND CODE CHANGES (CRITICAL)

#### Update Configuration Management
- [ ] Update `frontend/src/utils/config.js` for dynamic environment detection
- [ ] Update `frontend/src/services/api.js` for production URLs
- [ ] Create production build configuration

#### Update Package.json
- [ ] Update proxy settings for production
- [ ] Add production build scripts

### 7. 🗄️ DATABASE SETUP (CRITICAL)

#### Create Database Initialization Scripts
- [ ] Update `backend/init_db.py` for production
- [ ] Create database migration scripts
- [ ] Set up backup procedures

### 8. 🔒 SSL/HTTPS SETUP (CRITICAL)

#### Nginx Configuration
- [ ] Create `nginx/nginx.conf` for production
- [ ] Set up SSL certificate automation
- [ ] Configure security headers

#### SSL Certificate Setup
- [ ] Install Certbot on server
- [ ] Configure automatic SSL renewal
- [ ] Set up Let's Encrypt certificates

### 9. 📊 MONITORING & LOGGING (IMPORTANT)

#### Set Up Monitoring
- [ ] Create monitoring scripts
- [ ] Set up log rotation
- [ ] Configure health checks

#### Backup Configuration
- [ ] Set up automated database backups
- [ ] Configure file backup procedures
- [ ] Test backup and restore procedures

### 10. 🚀 DEPLOYMENT SCRIPTS (IMPORTANT)

#### Create Deployment Automation
- [ ] Create `deploy.sh` script for server deployment
- [ ] Set up environment detection
- [ ] Configure service management

## 📋 PRE-DEPLOYMENT CHECKLIST

### Server Preparation
- [ ] Ubuntu 22.04 LTS installed
- [ ] Docker and Docker Compose installed
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] SSH access configured
- [ ] Domain DNS configured

### Code Preparation
- [ ] All localhost references updated
- [ ] Environment variables configured
- [ ] Production Docker files created
- [ ] SSL configuration ready
- [ ] Email configuration tested

### Security Preparation
- [ ] Strong passwords generated
- [ ] Security keys configured
- [ ] CORS settings updated
- [ ] SSL certificates ready
- [ ] Firewall rules configured

## 🚨 CRITICAL FILES TO CREATE/UPDATE

### Must Create:
1. `docker-compose.prod.yml` - Production Docker configuration
2. `frontend/Dockerfile.prod` - Production frontend build
3. `nginx/nginx.conf` - Production web server config
4. `backend/settings.toml` - Dynaconf configuration
5. `deploy.sh` - Server deployment script

### Must Update:
1. `backend/app/config.py` - Implement Dynaconf
2. `backend/app/main.py` - Production security settings
3. `frontend/src/utils/config.js` - Dynamic configuration
4. `frontend/src/services/api.js` - Production URLs
5. `.env` - Production environment variables

## ⚡ QUICK START FOR SERVER DEPLOYMENT

### 1. Server Setup (Run on your Contabo server)
```bash
# Connect to server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Create application user
useradd -m -s /bin/bash genai
usermod -aG docker genai
```

### 2. Application Deployment
```bash
# Switch to application user
su - genai

# Clone repository
git clone https://github.com/your-username/genai-hiring-system.git
cd genai-hiring-system

# Configure environment
cp .env.production .env
nano .env  # Edit with your values

# Deploy
chmod +x start.sh
./start.sh
```

### 3. SSL Setup
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

## 🆘 EMERGENCY CONTACTS & RESOURCES

### If You Get Stuck:
1. **Docker Issues**: Check `docker-compose logs -f`
2. **Database Issues**: Check `docker-compose logs postgres`
3. **Email Issues**: Test with `docker-compose exec backend python -c "from app.utils.email import send_email; print(send_email(['test@example.com'], 'Test', 'Test message'))"`
4. **SSL Issues**: Check `sudo certbot certificates`

### Critical Commands:
```bash
# View all logs
docker-compose logs -f

# Restart services
docker-compose restart

# Check service health
curl http://localhost:8000/health

# Access database
docker-compose exec postgres psql -U postgres -d genai_hiring
```

## ⚠️ WARNING: DO NOT DEPLOY WITHOUT COMPLETING THESE TASKS

**The application will NOT work in production without:**
1. ✅ Strong security keys
2. ✅ Proper domain configuration
3. ✅ Email setup
4. ✅ SSL certificates
5. ✅ Production Docker configuration
6. ✅ Updated localhost references

**Complete these tasks in order, then test locally before deploying to server.**
