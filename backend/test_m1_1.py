import sys
import os
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app
from database import Base, get_db
import models

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_m1.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def run_tests():
    setup_db()

    print("Test 1: Create an admin user")
    admin_data = {
        "email": "admin@example.com",
        "password": "Password123",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    }
    response = client.post("/auth/signup", json=admin_data)
    print("Signup response:", response.status_code, response.json())
    assert response.status_code == 200
    
    print("Test 2: Login as admin")
    response = client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123"})
    print("Login response:", response.status_code, response.json())
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    
    print("Test 3: Create a sub-account as admin")
    sub_account_data = {
        "email": "recruiter@example.com",
        "password": "Password123",
        "full_name": "Recruiter User"
    }
    response = client.post("/auth/sub-accounts", json=sub_account_data, headers=headers)
    print("Create sub-account response:", response.status_code, response.json())
    if response.status_code != 200:
        print("FAIL: Sub-account creation failed.")
    
    print("Test 4: Create a job with a deadline as admin")
    future_deadline = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).isoformat()
    job_data = {
        "title": "Test Job",
        "description": "Test Description",
        "expected_outcomes": "None",
        "specific_skills": "None",
        "compliance_criteria": "None",
        "language": "English",
        "location": "Remote",
        "salary_range": "$100k-$120k",
        "job_type": "Full-time",
        "deadline": future_deadline
    }
    response = client.post("/jobs/", json=job_data, headers=headers)
    print("Create job response:", response.status_code, response.json())
    job_id = response.json()["id"]
    job_deadline = response.json().get("deadline")
    print("Job deadline returned:", job_deadline)
    if not job_deadline:
        print("FAIL: Job deadline is null, the deadline field was not saved.")
        
    print("Test 5: View jobs created by recruiter as admin")
    # Login as recruiter
    response = client.post("/auth/login", data={"username": "recruiter@example.com", "password": "Password123"})
    rec_access_token = response.json()["access_token"]
    rec_headers = {"Authorization": f"Bearer {rec_access_token}"}
    
    # Recruiter creates a job
    job_data["title"] = "Recruiter Job"
    response = client.post("/jobs/", json=job_data, headers=rec_headers)
    print("Recruiter job creation response:", response.status_code)
    
    # Admin gets their jobs
    response = client.get("/jobs/my-jobs", headers=headers)
    print("Admin view jobs response:", response.status_code)
    job_titles = [j["title"] for j in response.json()]
    print("Admin saw jobs:", job_titles)
    if "Recruiter Job" not in job_titles:
        print("FAIL: Admin cannot see recruiter's job.")
        
    print("Test 6: Apply to an expired job")
    # We update the DB directly to make the job expired
    db = TestingSessionLocal()
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    past_deadline = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)
    job.deadline = past_deadline
    db.commit()
    magic_link = job.magic_link_token
    db.close()
    
    # Login as candidate
    cand_data = {
        "email": "candidate@example.com",
        "password": "Password123",
        "full_name": "Candidate User"
    }
    client.post("/auth/signup", json=cand_data)
    response = client.post("/auth/login", data={"username": "candidate@example.com", "password": "Password123"})
    cand_headers = {"Authorization": f"Bearer {response.json()['access_token']}"}
    
    # Apply
    response = client.post(f"/assessment/{job_id}/apply", headers=cand_headers)
    print("Apply response:", response.status_code, response.json())
    if response.status_code != 400 or "expire" not in response.json().get("detail", "").lower():
        print("FAIL: Job application did not enforce deadline correctly.")
    
if __name__ == "__main__":
    run_tests()
