import sys
import os
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend')))
from main import app
from database import Base, get_db
import models

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_m1_challenger.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

def get_client():
    return TestClient(app)

def setup_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

def run_tests():
    setup_db()
    results = []

    def assert_cond(cond, msg):
        if not cond:
            results.append(f"FAIL: {msg}")
            print(f"FAIL: {msg}")
        else:
            results.append(f"PASS: {msg}")
            print(f"PASS: {msg}")

    # 1. Create Admin
    admin_client = get_client()
    admin_data = {
        "email": "admin@example.com",
        "password": "Password123",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    }
    r = admin_client.post("/auth/signup", json=admin_data)
    assert_cond(r.status_code == 200, f"Admin signup: expected 200, got {r.status_code}. Response: {r.json()}")
    
    # 2. Login Admin
    r = admin_client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123"})
    assert_cond(r.status_code == 200, f"Admin login: expected 200, got {r.status_code}")
    admin_token = r.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 3. Create Sub-Account as Admin
    sub_account_data = {
        "email": "recruiter@example.com",
        "password": "Password123",
        "full_name": "Recruiter User"
    }
    r = admin_client.post("/auth/sub-accounts", json=sub_account_data, headers=admin_headers)
    assert_cond(r.status_code == 200, f"Create sub-account: expected 200, got {r.status_code}. Response: {r.json()}")
    
    # 4. Recruiter tries to create sub-account (should fail)
    recruiter_client = get_client()
    r = recruiter_client.post("/auth/login", data={"username": "recruiter@example.com", "password": "Password123"})
    recruiter_token = r.json()["access_token"]
    recruiter_headers = {"Authorization": f"Bearer {recruiter_token}"}
    
    r = recruiter_client.post("/auth/sub-accounts", json={"email": "recruiter2@example.com", "password": "Password123", "full_name": "R2"}, headers=recruiter_headers)
    assert_cond(r.status_code == 403, f"Recruiter creating sub-account: expected 403, got {r.status_code}")
    
    # 5. Admin can list sub-accounts
    r = admin_client.get("/auth/sub-accounts", headers=admin_headers)
    assert_cond(r.status_code == 200 and len(r.json()) > 0, f"Admin list sub-accounts: expected 200 and >0 items, got {r.status_code}")
    
    # 6. Recruiter creates a job
    future_deadline = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).isoformat()
    job_data = {
        "title": "Recruiter Job",
        "description": "Test",
        "expected_outcomes": "None",
        "specific_skills": "None",
        "language": "English",
        "deadline": future_deadline
    }
    r = recruiter_client.post("/jobs/", json=job_data, headers=recruiter_headers)
    assert_cond(r.status_code == 200, f"Recruiter job creation: expected 200, got {r.status_code}")
    job_id = r.json()["id"]
    magic_link = r.json()["magic_link_token"]
    
    # 7. Admin views all jobs (should see recruiter's job)
    r = admin_client.get("/jobs/my-jobs", headers=admin_headers)
    assert_cond(r.status_code == 200, f"Admin get jobs: expected 200, got {r.status_code}")
    if r.status_code == 200:
        titles = [j["title"] for j in r.json()]
        assert_cond("Recruiter Job" in titles, f"Admin sees recruiter job, titles: {titles}")
    
    # 8. Candidate applies to job with future deadline
    cand_client = get_client()
    cand_data = {
        "email": "cand@example.com",
        "password": "Password123",
        "full_name": "Cand"
    }
    cand_client.post("/auth/signup", json=cand_data)
    r = cand_client.post("/auth/login", data={"username": "cand@example.com", "password": "Password123"})
    cand_token = r.json()["access_token"]
    cand_headers = {"Authorization": f"Bearer {cand_token}"}
    
    r = cand_client.post(f"/applications/apply/{magic_link}", headers=cand_headers)
    assert_cond(r.status_code == 200, f"Apply to future job: expected 200, got {r.status_code}. Response: {r.json()}")
    
    # 9. Admin creates job with past deadline
    past_deadline = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
    job_data["title"] = "Expired Job"
    job_data["deadline"] = past_deadline
    r = admin_client.post("/jobs/", json=job_data, headers=admin_headers)
    assert_cond(r.status_code == 200, "Admin creates expired job")
    expired_magic_link = r.json()["magic_link_token"]
    
    # 10. Candidate applies to expired job
    r = cand_client.post(f"/applications/apply/{expired_magic_link}", headers=cand_headers)
    assert_cond(r.status_code == 400, f"Apply to expired job: expected 400, got {r.status_code}. Response: {r.json()}")
    
    with open("test_results.txt", "w") as f:
        f.write("\n".join(results))

if __name__ == "__main__":
    run_tests()
