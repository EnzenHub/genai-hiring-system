import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database Configuration
    database_url: str = "postgresql://postgres:postgres@localhost:5432/genai_hiring"
    postgres_user: str = "postgres"
    postgres_password: str = "Maahi123"
    postgres_db: str = "genai_hiring"
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379"
    redis_host: str = "localhost"
    redis_port: int = 6379
    
    # API Configuration
    api_host: str = "localhost"
    api_port: int = 8000
    api_base_url: str = "http://localhost:8000"
    
    # JWT Configuration
    jwt_secret_key: str = "your-super-secret-jwt-key-change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # === Ollama LLM configuration ===
    use_ollama: bool = True
    ollama_base_url: str = "http://host.docker.internal:11434"
    ollama_model: str = "qwen2.5:3b-instruct"
    llm_temperature: float = 0.3
    llm_max_tokens: int = 300         # per response
    llm_timeout_seconds: int = 120

    # (Optional) Local llama.cpp fallback (not required now, but kept if you want)
    model_path: Optional[str] = None
    llm_n_ctx: int = 2048
    llm_n_threads: int = 4
    llm_n_batch: int = 64
    llm_seed: int = 42
    chat_format: Optional[str] = None    # only for direct llama.cpp fallback
    
    # Email Configuration
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_username: str = "voyageuraryan@gmail.com"
    smtp_password: str = "lqlp aymq texs efrk"
    email_from: str = "voyageuraryan@gmail.com"
    
    # File Upload Configuration
    max_file_size: int = 10485760  # 10MB
    upload_dir: str = "uploads"
    
    # Application Settings
    debug: bool = True
    environment: str = "development"
    secret_key: str = "your-super-secret-key-change-this-in-production"
    
    # Scoring Configuration
    match_score_weight: float = 0.5
    ats_score_weight: float = 0.5
    shortlist_threshold: int = 70
    requalify_threshold: int = 60
    
    # Frontend URL for generating review links
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Ignore extra fields from environment

settings = Settings()
