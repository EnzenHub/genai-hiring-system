from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import create_tables
from .config import settings
from .api import auth, jobs, applications, companies, users, interviews, interviewer_auth
import os

# Create FastAPI app
app = FastAPI(
    title="GenAI Hiring System",
    description="AI-Powered Candidate Shortlisting System",
    version="1.0.0",
    debug=settings.debug
)

# Configure CORS - Dynamic origins based on environment
origins = [
    "http://149.102.158.71:6003",
    "http://127.0.0.1:3000",
    "http://149.102.158.71:6003",
    "http://127.0.0.1:6003",
    f"http://{settings.api_host}:6003",
]

# Add FRONTEND_URL from environment if set
if hasattr(settings, 'frontend_url') and settings.frontend_url:
    frontend_url = settings.frontend_url
    if frontend_url not in origins:
        origins.append(frontend_url)
    # Also add without trailing slash
    if frontend_url.endswith('/'):
        origins.append(frontend_url.rstrip('/'))

# Add common production origins
production_origins = [
    "http://149.102.158.71:6003",
    "http://149.102.158.71:3000",
]
for origin in production_origins:
    if origin not in origins:
        origins.append(origin)

print(f"🌐 CORS allowed origins: {origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600  # Cache preflight requests for 1 hour
)

# Create upload directory
os.makedirs(settings.upload_dir, exist_ok=True)

# Mount static files for resume uploads
app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(interviews.router, prefix="/api/interviews", tags=["Interviews"])
app.include_router(interviewer_auth.router, prefix="/api/interviewer", tags=["Interviewer Authentication"])

# Import and include resume update router
from .api import resume_update, scheduler
app.include_router(resume_update.router, prefix="/api", tags=["Resume Update"])
app.include_router(scheduler.router, prefix="/api", tags=["Scheduler"])

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "GenAI Hiring System API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Create database tables on startup
@app.on_event("startup")
async def startup_event():
    create_tables()
    
    # Start the background scheduler for resume update emails
    import asyncio
    from .services.scheduler_service import run_background_scheduler
    asyncio.create_task(run_background_scheduler())
    print("✅ Background scheduler started for resume update emails")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )
