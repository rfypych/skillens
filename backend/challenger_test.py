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

SQLALCHEMY_DATABASE_URL = "sqlite:///./challenger.db"
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

def run():
    setup_db()

    # 1. Admin Creation
    admin_data = {
        "email": "admin@example.com",
        "password": "Password123",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    }
    r = client.post("/auth/signup", json=admin_data)
    assert r.status_code == 200, f"Admin signup failed: {r.text}"
    
    r = client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123"})
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    admin_token = r.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # 2. Sub-account Creation by Admin
    sub_data = {
        "email": "sub1@example.com",
        "password": "Password123",
        "full_name": "Sub User 1"
    }
    r = client.post("/auth/sub-accounts", json=sub_data, headers=admin_headers)
    assert r.status_code == 200, f"Sub-account creation failed: {r.text}"
    
    # 3. Sub-account creating Sub-account? Should fail!
    r = client.post("/auth/login", data={"username": "sub1@example.com", "password": "Password123"})
    sub1_token = r.json()["access_token"]
    sub1_headers = {"Authorization": f"Bearer {sub1_token}"}
    
    sub2_data = {
        "email": "sub2@example.com",
        "password": "Password123",
        "full_name": "Sub User 2"
    }
    r = client.post("/auth/sub-accounts", json=sub2_data, headers=sub1_headers)
    if r.status_code == 200:
        print("VULNERABILITY: Sub-account can create other sub-accounts!")
    else:
        print("SUCCESS: Sub-account cannot create sub-accounts. Status:", r.status_code)
    
    # 4. Job Deadline Limits
    future = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)).isoformat()
    r = client.post("/jobs/", json={
        "title": "Future Job", "description": "D", "expected_outcomes": "O",
        "specific_skills": "S", "compliance_criteria": "C", "language": "E",
        "location": "R", "salary_range": "1", "job_type": "F", "deadline": future
    }, headers=admin_headers)
    assert r.status_code == 200
    job_future_id = r.json()["id"]
    
    past = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
    r = client.post("/jobs/", json={
        "title": "Past Job", "description": "D", "expected_outcomes": "O",
        "specific_skills": "S", "compliance_criteria": "C", "language": "E",
        "location": "R", "salary_range": "1", "job_type": "F", "deadline": past
    }, headers=admin_headers)
    assert r.status_code == 200
    job_past_id = r.json()["id"]
    
    # Also need to create assessments for these jobs since apply_for_job uses it
    db = TestingSessionLocal()
    db.add(models.Assessment(job_id=job_future_id, scenario_prompt="Future", hidden_prompt="Future"))
    db.add(models.Assessment(job_id=job_past_id, scenario_prompt="Past", hidden_prompt="Past"))
    db.commit()
    db.close()
    
    # Apply as candidate
    c_data = {"email": "cand@ex.com", "password": "Password123", "full_name": "Cand"}
    client.post("/auth/signup", json=c_data)
    r = client.post("/auth/login", data={"username": "cand@ex.com", "password": "Password123"})
    cand_token = r.json()["access_token"]
    cand_headers = {"Authorization": f"Bearer {cand_token}"}
    
    r_past = client.post(f"/assessment/{job_past_id}/apply", headers=cand_headers)
    if r_past.status_code == 200:
         print("VULNERABILITY: Can apply to expired job!")
    else:
         print("SUCCESS: Cannot apply to expired job. Status:", r_past.status_code, r_past.text)
         
    r_future = client.post(f"/assessment/{job_future_id}/apply", headers=cand_headers)
    if r_future.status_code != 200:
         print("BUG: Failed to apply to future job! Status:", r_future.status_code, r_future.text)
    else:
         print("SUCCESS: Applied to future job.")
    
    print("ALL TESTS COMPLETED.")
    
if __name__ == '__main__':
    run()
