import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
import models
import schemas
from services import auth_service, job_service, application_service, assessment_service
from datetime import datetime, timedelta, timezone

# Use a test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_m1_challenger.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def main():
    setup_db()
    db = TestingSessionLocal()
    
    try:
        # Create company
        company = models.Company(name="Test Corp")
        db.add(company)
        db.commit()
        db.refresh(company)

        # Create Admin
        from utils.auth import get_password_hash
        admin_user = models.User(
            email="admin@test.com",
            hashed_password=get_password_hash("Password123!"),
            role="admin",
            company_id=company.id
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        # Admin creates sub-account
        sub_account_payload = schemas.UserCreate(
            email="recruiter@test.com",
            password="Password123!",
            full_name="Recruiter"
        )
        from routers.auth import create_sub_account
        recruiter_user = create_sub_account(sub_account_payload, db, admin_user)
        
        # Recruiter creates a job
        job_payload = schemas.JobCreate(
            title="Software Engineer",
            description="Test",
            expected_outcomes="Test",
            specific_skills="Test",
            compliance_criteria="Test"
        )
        job = job_service.create_job(db, job_payload, recruiter_user)
        print(f"Job created by recruiter. Job ID: {job.id}")
        
        # Admin attempts to view job
        try:
            admin_jobs = job_service.get_my_jobs(db, admin_user)
            print(f"Admin sees {len(admin_jobs)} jobs.")
            assert len(admin_jobs) == 1, "Admin should see the recruiter's job"
        except Exception as e:
            print(f"Error checking admin jobs: {e}")
            
        # Admin attempts to update job
        try:
            update_payload = schemas.JobUpdate(title="Updated Title")
            job_service.update_job(db, job.id, update_payload, admin_user)
            print("Admin successfully updated recruiter's job.")
        except Exception as e:
            print(f"Error updating job as admin: {e}")
            
        # Test applying for job with past deadline
        job.deadline = datetime.now(timezone.utc) - timedelta(days=1)
        db.commit()
        db.refresh(job)
        
        app_payload = schemas.ApplicationCreate(
            name="Candidate 1",
            email="cand1@test.com"
        )
        try:
            assessment_service.apply_for_job(db, job.id, app_payload, current_user=None)
            print("Candidate applied successfully, but deadline was passed! (BUG)")
        except Exception as e:
            print(f"Candidate apply result: {e}")

        # Test applying for job with future deadline
        job.deadline = datetime.now(timezone.utc) + timedelta(days=1)
        db.commit()
        db.refresh(job)
        
        app_payload2 = schemas.ApplicationCreate(
            name="Candidate 2",
            email="cand2@test.com"
        )
        try:
            assessment_service.apply_for_job(db, job.id, app_payload2, current_user=None)
            print("Candidate applied successfully (future deadline).")
        except Exception as e:
            print(f"Candidate apply result (future deadline): {e}")

    finally:
        db.close()

if __name__ == "__main__":
    main()
