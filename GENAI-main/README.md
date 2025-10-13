# 🤖 GenAI Hiring System

An intelligent, AI-powered hiring and recruitment management system built with modern technologies.

## ✨ Features

- 🎯 **Smart Resume Screening** - AI-powered resume parsing and scoring
- 📝 **Job Management** - Create, edit, and manage job postings
- 👥 **Application Tracking** - Complete applicant lifecycle management
- 📅 **Interview Scheduling** - Automated interview scheduling with Google Meet integration
- 📧 **Email Notifications** - Automated candidate and HR notifications
- 📊 **Analytics Dashboard** - Hiring metrics and insights
- 🔐 **Role-based Access** - Admin, HR, and Account Manager roles
- 🌐 **Modern UI** - Responsive React.js frontend

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning)
- 4GB+ RAM recommended

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd GENAI-main

# Run the setup script
# Windows:
start.bat

# Linux/Mac:
chmod +x start.sh && ./start.sh
```

### Access the Application
- **Frontend**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📚 Documentation

- **[Getting Started Guide](GETTING_STARTED.md)** - Complete setup instructions
- **[Docker Setup Guide](DOCKER_SETUP.md)** - Container configuration details
- **[Project Structure](project-structure.md)** - Codebase overview

## 🛠️ Technology Stack

### Frontend
- **React.js** - User interface
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **SQLAlchemy** - Database ORM
- **PostgreSQL** - Primary database
- **Redis** - Caching and sessions

### AI/ML
- **Ollama** - Local LLM integration
- **Resume Parsing** - Automated data extraction
- **Scoring Engine** - AI-powered candidate matching

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy (production)

## 🔧 Configuration

### Required Environment Variables
```env
# Database
POSTGRES_PASSWORD=your_secure_password

# Email (required for notifications)
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
```

See [GETTING_STARTED.md](GETTING_STARTED.md) for complete configuration details.

## 📊 System Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│   Backend   │────│ PostgreSQL  │
│  (React)    │    │  (FastAPI)  │    │ (Database)  │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                    ┌─────────────┐    ┌─────────────┐
                    │    Redis    │    │   Ollama    │
                    │  (Cache)    │    │   (LLM)     │
                    └─────────────┘    └─────────────┘
```

## 🔐 Default User Roles

- **Admin** - Full system access and configuration
- **HR** - Application management and interview scheduling
- **Account Manager** - Job posting and candidate management

## 📝 Key Workflows

### 1. Job Posting
1. Account Manager creates job posting
2. Admin approves and publishes
3. Job becomes available for applications

### 2. Application Processing
1. Candidate applies with resume
2. AI parses and scores resume
3. System determines candidate status
4. HR receives notifications for qualified candidates

### 3. Interview Scheduling
1. HR schedules interview for qualified candidates
2. System generates Google Meet link
3. Email notifications sent to all participants
4. Interview feedback collected post-interview

## 🗄️ Database

The system includes a complete PostgreSQL database with:
- User management and authentication
- Job postings and requirements
- Application tracking and scoring
- Interview scheduling and reviews
- Company and role management

**Database dump**: `genai_hiring_database_dump.sql` (565KB)

## 🚀 Deployment

### Development
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production
See [DOCKER_SETUP.md](DOCKER_SETUP.md) for production deployment guidelines.

## 🔧 Maintenance

### Database Backup
```bash
# Windows
backup-database.bat

# Linux/Mac
./backup-database.sh
```

### System Updates
```bash
# Pull latest changes
git pull

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

## 🐛 Troubleshooting

Common issues and solutions are documented in [GETTING_STARTED.md](GETTING_STARTED.md#common-issues--solutions).

### Quick Fixes
```bash
# Restart all services
docker-compose restart

# Check service status
docker-compose ps

# View service logs
docker-compose logs [service-name]
```

## 📈 Performance

### System Requirements
- **Minimum**: 4GB RAM, 5GB storage
- **Recommended**: 8GB RAM, SSD storage
- **Production**: 16GB+ RAM, dedicated server

### Optimization Tips
- Allocate 6GB+ RAM to Docker Desktop
- Use SSD storage for database
- Enable WSL2 on Windows
- Regular database maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For setup issues:
1. Check [GETTING_STARTED.md](GETTING_STARTED.md)
2. Review container logs: `docker-compose logs`
3. Verify environment configuration
4. Ensure Docker Desktop is running

---

**🎉 Ready to revolutionize your hiring process? Get started now!**