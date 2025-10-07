# GenAI Hiring System

A comprehensive AI-powered hiring and recruitment management system built with React, FastAPI, and PostgreSQL. This system streamlines the entire hiring process from job posting to candidate selection and interview scheduling.

## 🚀 Quick Start

### Windows
```bash
# Run the start script
start.bat
```

### Linux/macOS
```bash
# Make script executable and run
chmod +x start.sh
./start.sh
```

## 📋 System Overview

The GenAI Hiring System provides:

- **Job Management**: Create, edit, and publish job postings
- **Application Processing**: Automated resume parsing and scoring
- **AI-Powered Screening**: LLM-based candidate evaluation
- **Interview Scheduling**: Automated interview coordination with Google Meet integration
- **Multi-Role Dashboard**: Separate interfaces for HR, Account Managers, and Admins
- **Email Automation**: Automated notifications throughout the hiring process
- **Resume Update Flow**: AI-guided resume improvement for borderline candidates

## 🏗️ Architecture

### Services
- **Frontend**: React.js application with Tailwind CSS
- **Backend**: FastAPI with SQLAlchemy ORM
- **Database**: PostgreSQL for data persistence
- **Cache**: Redis for session management and caching
- **LLM**: Ollama integration for AI-powered features
- **Email**: SMTP integration for automated communications

### Key Features
- **Containerized Deployment**: Full Docker Compose setup
- **AI Resume Scoring**: Automated candidate evaluation
- **Google Meet Integration**: Seamless interview scheduling
- **Multi-Tenant Support**: Company-based data isolation
- **Real-time Updates**: Live status updates and notifications
- **File Management**: Secure resume upload and storage

## 📁 Project Structure

```
genai-hiring-system/
├── backend/                 # FastAPI backend application
│   ├── app/                # Main application code
│   │   ├── api/           # API endpoints
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── Dockerfile         # Backend container config
│   └── requirements.txt   # Python dependencies
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   ├── Dockerfile         # Frontend container config
│   └── package.json       # Node.js dependencies
├── database/              # Database initialization
├── redis/                 # Redis configuration
├── docker-compose.yml     # Container orchestration
├── start.bat             # Windows startup script
├── start.sh              # Linux/macOS startup script
└── setup_guide.md        # Detailed setup instructions
```

## 🔧 Prerequisites

- **Docker Desktop** (Windows/macOS) or **Docker Engine + Docker Compose** (Linux)
- **Git** for cloning the repository
- **Web Browser** (Chrome, Firefox, Safari, Edge)

## 📚 Documentation

- **[setup_guide.md](setup_guide.md)**: Complete installation and configuration guide
- **[project_summary.md](project_summary.md)**: Detailed system workflow and features

## 🌐 Access Points

Once running, access the system at:

- **Main Application**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **API Health Check**: http://localhost:8000/health

## 👥 Default User Roles

The system supports three user types:

1. **Account Manager**: Job creation and candidate pipeline management
2. **HR Representative**: Application review and interview coordination
3. **System Admin**: Full system access and user management

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Secure file upload handling
- Environment-based configuration
- Database connection security

## 🛠️ Development

For development setup and customization, refer to the setup_guide.md for detailed instructions on:

- Environment configuration
- Database setup
- Email configuration
- Google Meet integration
- LLM model setup

## 📞 Support

For issues or questions:

1. Check the setup_guide.md for troubleshooting
2. Review Docker logs: `docker-compose logs -f`
3. Verify service health at http://localhost:8000/health

## 📄 License

This project is proprietary software. All rights reserved.
