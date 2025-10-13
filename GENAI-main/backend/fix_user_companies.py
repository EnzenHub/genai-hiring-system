#!/usr/bin/env python3
"""
Simple script to fix user company assignments
"""

import sys
import os
sys.path.append('/app')

from app.database import SessionLocal
from app.models.user import User

def fix_user_companies():
    """Fix user company assignments"""
    
    db = SessionLocal()
    
    try:
        # Update all users to have company_id = 1
        users = db.query(User).all()
        updated_count = 0
        
        for user in users:
            if user.company_id is None:
                user.company_id = 1
                updated_count += 1
                print(f"Updated user {user.email} (ID: {user.id}) to have company_id = 1")
        
        db.commit()
        print(f"\n✅ Successfully updated {updated_count} users")
        
        # Verify the changes
        print("\n📋 Current user assignments:")
        users = db.query(User).all()
        for user in users:
            print(f"  User {user.id}: {user.email} | Type: {user.user_type} | Company: {user.company_id}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Fixing user company assignments...")
    fix_user_companies()
