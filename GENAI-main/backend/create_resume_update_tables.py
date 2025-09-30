#!/usr/bin/env python3
"""
Create resume update tracking tables
Run this script to add the new tables for resume update flow
"""

import sys
import os
sys.path.append('/app' if os.path.exists('/app') else '.')

from sqlalchemy import create_engine, text
from app.config import settings
from app.database import Base
from app.models.resume_update_tracking import ResumeUpdateRequest, ResumeUpdateHistory, LLMEvaluationLog
from app.models.application import Application  # Import to ensure relationship is loaded

def create_tables():
    """Create the resume update tracking tables"""
    try:
        # Create engine
        engine = create_engine(settings.database_url)
        
        print("🗄️ Creating resume update tracking tables...")
        
        # Create all tables (will only create new ones)
        Base.metadata.create_all(bind=engine)
        
        print("✅ Resume update tracking tables created successfully!")
        
        # Verify tables exist
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name IN ('resume_update_requests', 'resume_update_history', 'llm_evaluation_logs')
                ORDER BY table_name
            """))
            
            tables = [row[0] for row in result]
            print(f"📋 Created tables: {', '.join(tables)}")
            
            if len(tables) == 3:
                print("🎉 All resume update tables created successfully!")
                return True
            else:
                print(f"⚠️ Expected 3 tables, but found {len(tables)}")
                return False
                
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

if __name__ == "__main__":
    success = create_tables()
    sys.exit(0 if success else 1)
