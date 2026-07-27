import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import time
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///./challenger.db"
os.environ["JWT_SECRET_KEY"] = "test_secret_that_is_at_least_32_characters_long"

from database import Base
from main import app
from unittest.mock import patch

# Mock celery task to avoid hanging
patcher = patch('services.job_service.generate_assessment_for_job.delay')
patcher.start()

engine = create_engine(os.environ["DATABASE_URL"], connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_failure_modes():
    # 1. Admin signs up
    admin_data = {
        "email": "admin@example.com",
        "password": "Password123!",
        "full_name": "Admin User",
        "role": "admin",
        "company_name": "Test Company"
    }
    r = client.post("/auth/signup", json=admin_data)
    assert r.status_code == 200, r.text
    
    # login as admin
    r = client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123!"})
    admin_token = r.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 2. Admin creates a sub-account
    sub_data = {
        "email": "sub1@example.com",
        "password": "Password123!",
        "full_name": "Sub User",
        "role": "recruiter"
    }
    r = client.post("/auth/sub-accounts", json=sub_data, headers=admin_headers)
    assert r.status_code == 200
    sub1_id = r.json()["id"]
    
    # login as sub-account
    r = client.post("/auth/login", data={"username": "sub1@example.com", "password": "Password123!"})
    sub1_token = r.json()["access_token"]
    sub1_headers = {"Authorization": f"Bearer {sub1_token}"}
    
    # 3. Sub-account creates a job
    job_data = {
        "title": "Sub Job",
        "description": "Sub Job Desc",
        "expected_outcomes": "outcome1",
        "specific_skills": "skill1",
        "deadline": None
    }
    r = client.post("/jobs", json=job_data, headers=sub1_headers)
    assert r.status_code == 200, r.text
    job_id = r.json()["id"]
    
    # 4. Admin tries to update the sub-account's job
    update_data = {
        "title": "Sub Job Updated"
    }
    r = client.put(f"/jobs/{job_id}", json=update_data, headers=admin_headers)
    
    # Does admin have permission to update child account's job?
    if r.status_code != 200:
        print(f"FAIL: Admin cannot update sub-account's job! Expected 200, got {r.status_code}. Response: {r.text}")
    else:
        print("PASS: Admin updated sub-account's job.")
        
    # 5. Check deadline enforcement
    from datetime import datetime, timedelta, timezone
    future_deadline = (datetime.now(timezone.utc) + timedelta(seconds=1)).isoformat()
    job_data_2 = {
        "title": "Deadline Job",
        "description": "Desc",
        "expected_outcomes": "outcome1",
        "specific_skills": "skill1",
        "deadline": future_deadline
    }
    r = client.post("/jobs", json=job_data_2, headers=admin_headers)
    assert r.status_code == 200
    job_id_2 = r.json()["id"]
    
    print("Waiting 2 seconds for job to expire...")
    time.sleep(2)
    
    app_data = {
        "name": "Applicant",
        "email": "applicant@example.com"
    }
    r = client.post(f"/assessment/{job_id_2}/apply", json=app_data)
    if r.status_code == 400:
        print("PASS: Deadline correctly enforced.")
    else:
        print(f"FAIL: Deadline not enforced. Expected 400, got {r.status_code}. Response: {r.text}")

if __name__ == "__main__":
    test_failure_modes()
