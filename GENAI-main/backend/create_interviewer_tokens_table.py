from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@db:5432/genai_db")

def create_interviewer_tokens_table():
    engine = create_engine(DATABASE_URL)
    conn = None
    try:
        conn = engine.connect()
        logger.info("🔄 Creating interviewer_tokens table...")
        
        # Create interviewer_tokens table
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS interviewer_tokens (
                id SERIAL PRIMARY KEY,
                token VARCHAR(255) UNIQUE NOT NULL,
                interviewer_email VARCHAR(255) NOT NULL,
                interviewer_name VARCHAR(255) NOT NULL,
                application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
                interviewer_type VARCHAR(50) NOT NULL,
                expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                is_used BOOLEAN DEFAULT FALSE,
                used_at TIMESTAMP WITH TIME ZONE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """))
        logger.info("✅ Executed: CREATE TABLE interviewer_tokens")
        
        # Create indexes
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_interviewer_tokens_token ON interviewer_tokens(token);"))
        logger.info("✅ Executed: CREATE INDEX idx_interviewer_tokens_token")
        
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_interviewer_tokens_application_id ON interviewer_tokens(application_id);"))
        logger.info("✅ Executed: CREATE INDEX idx_interviewer_tokens_application_id")
        
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_interviewer_tokens_email ON interviewer_tokens(interviewer_email);"))
        logger.info("✅ Executed: CREATE INDEX idx_interviewer_tokens_email")
        
        conn.commit()
        logger.info("✅ interviewer_tokens table created successfully!")
        logger.info("🎉 Database migration completed successfully!")
        
    except SQLAlchemyError as e:
        logger.error(f"❌ Database error during migration: {e}")
        if conn:
            conn.rollback()
    except Exception as e:
        logger.error(f"❌ An unexpected error occurred: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    create_interviewer_tokens_table()
