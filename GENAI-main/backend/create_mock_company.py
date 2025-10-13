#!/usr/bin/env python3
"""
Script to create a mock company in the database
Run this to fix the "No companies available" error when creating jobs
"""

import sys
import os
sys.path.append('/app')

from app.database import SessionLocal, engine
from app.models.company import Company
from sqlalchemy import text

def create_mock_company():
    """Create a mock company in the database"""
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Check if companies table exists
        result = db.execute(text("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'companies')"))
        table_exists = result.scalar()
        
        if not table_exists:
            print("❌ Companies table does not exist. Please run database migrations first.")
            return False
        
        # Check if any companies already exist
        existing_company = db.query(Company).first()
        if existing_company:
            print(f"✅ Company already exists: {existing_company.name} (ID: {existing_company.id})")
            return True
        
        # Create mock company
        mock_company = Company(
            name="TechCorp Solutions",
            description="A leading technology company specializing in innovative software solutions and digital transformation services.",
            website="https://techcorp-solutions.com",
            industry="Technology",
            company_size="100-500",
            location="San Francisco, CA",
            theme_color="#2563eb",
            is_active=True
        )
        
        # Add to database
        db.add(mock_company)
        db.commit()
        db.refresh(mock_company)
        
        print(f"✅ Successfully created mock company:")
        print(f"   ID: {mock_company.id}")
        print(f"   Name: {mock_company.name}")
        print(f"   Industry: {mock_company.industry}")
        print(f"   Location: {mock_company.location}")
        print(f"   Website: {mock_company.website}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating mock company: {e}")
        db.rollback()
        return False
    finally:
        db.close()

def create_sample_user():
    """Create a sample admin user if none exists"""
    
    from app.models.user import User
    from app.utils.auth import get_password_hash
    
    db = SessionLocal()
    
    try:
        # Check if any users exist
        existing_user = db.query(User).first()
        if existing_user:
            print(f"✅ User already exists: {existing_user.email}")
            return True
        
        # Get the company we just created
        company = db.query(Company).first()
        if not company:
            print("❌ No company found. Please create a company first.")
            return False
        
        # Create sample admin user
        sample_user = User(
            email="admin@techcorp.com",
            password_hash=get_password_hash("admin123"),
            first_name="Admin",
            last_name="User",
            user_type="admin",
            company_id=company.id,
            is_active=True
        )
        
        db.add(sample_user)
        db.commit()
        db.refresh(sample_user)
        
        print(f"✅ Successfully created sample admin user:")
        print(f"   Email: {sample_user.email}")
        print(f"   Password: admin123")
        print(f"   Type: {sample_user.user_type}")
        print(f"   Company: {company.name}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample user: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🚀 Creating mock company and sample user...")
    print("=" * 50)
    
    # Create mock company
    if create_mock_company():
        print("\n" + "=" * 50)
        # Create sample user
        create_sample_user()
        
        print("\n" + "=" * 50)
        print("🎉 Setup complete! You can now:")
        print("   1. Login with: admin@techcorp.com / admin123")
        print("   2. Create jobs without the 'No companies available' error")
        print("   3. Use all the AI features in your hiring system")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
