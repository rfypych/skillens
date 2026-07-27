import sys
import os

sys.path.append(os.path.abspath("d:/projects/JHIC-rev/backend"))

from fastapi.testclient import TestClient
from main import app
from database import Base, engine, get_db
import schemas
import models
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import sessionmaker

# Setup test database
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def run_tests():
    # 1. Create an admin user
    signup_data = {
        "email": "admin_test@example.com",
        "password": "Password1",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    }
    res = client.post("/auth/signup", json=signup_data)
    if res.status_code != 200:
        print(f"Failed to signup admin: {res.json()}")
        return False
    
    # Login to get token
    login_data = {
        "username": "admin_test@example.com",
        "password": "Password1"
    }
    res = client.post("/auth/login", data=login_data)
    token = res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 2. Create a job with deadline, max_questions, kkm_score
    future_deadline = (datetime.now(timezone.utc) + timedelta(days=5)).isoformat()
    job_data = {
        "title": "Test Job",
        "description": "Test Desc",
        "expected_outcomes": "Outcome 1",
        "specific_skills": "Skill 1",
        "language": "English",
        "max_questions": 10,
        "kkm_score": 85.5,
        "deadline": future_deadline
    }
    
    res = client.post("/jobs", json=job_data, headers=headers)
    if res.status_code != 200:
        print(f"Failed to create job: {res.json()}")
        return False
        
    job_response = res.json()
    print("Job Created successfully.")
    print("Job Response:", job_response)
    
    # 3. Verify that deadline, max_questions, kkm_score are correctly saved
    failed = False
    
    # Note: deadline might not be in the response if the response model doesn't return it? 
    # Let's check schemas.JobResponse
    
    # Wait, let's fetch from DB to be absolutely sure
    db = TestingSessionLocal()
    job_id = job_response["id"]
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    
    print(f"DB Job Max Questions: {db_job.max_questions}")
    print(f"DB Job KKM Score: {db_job.kkm_score}")
    print(f"DB Job Deadline: {db_job.deadline}")
    
    if db_job.deadline is None:
        print("FAIL: Deadline was not saved to the database.")
        failed = True
        
    if db_job.max_questions != 10:
        print("FAIL: max_questions was not saved correctly.")
        failed = True
        
    if db_job.kkm_score != 85.5:
        print("FAIL: kkm_score was not saved correctly.")
        failed = True
        
    db.close()
    
    return not failed

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    success = run_tests()
    if not success:
        print("\nTest failed.")
        sys.exit(1)
    else:
        print("\nTest passed.")
        sys.exit(0)
