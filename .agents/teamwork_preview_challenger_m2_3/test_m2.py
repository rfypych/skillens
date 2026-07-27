import sys
import os
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from backend.main import app
from backend.database import Base, get_db
import backend.models as models
from backend.tasks import run_ai_eval_sync_task
import asyncio

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_m2.db"
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
    
    # 1. Register Candidate
    print("Test 1: Candidate Registration")
    cand1_data = {
        "email": "cand1@example.com",
        "password": "Password123",
        "role": "candidate",
        "full_name": "Candidate One"
    }
    client.post("/auth/signup", json=cand1_data)
    
    cand2_data = {
        "email": "cand2@example.com",
        "password": "Password123",
        "role": "candidate",
        "full_name": "Candidate Two"
    }
    client.post("/auth/signup", json=cand2_data)

    db = TestingSessionLocal()
    cand1 = db.query(models.User).filter(models.User.email == "cand1@example.com").first()
    if not cand1 or not cand1.profile:
        print("FAIL: Candidate 1 profile not created.")
        sys.exit(1)
    
    # Login cand1
    res = client.post("/auth/login", data={"username": "cand1@example.com", "password": "Password123"})
    cand1_token = res.json()["access_token"]
    cand1_headers = {"Authorization": f"Bearer {cand1_token}"}
    
    # Login cand2
    res = client.post("/auth/login", data={"username": "cand2@example.com", "password": "Password123"})
    cand2_token = res.json()["access_token"]
    cand2_headers = {"Authorization": f"Bearer {cand2_token}"}
    
    # 2. Upload Document
    print("Test 2: Candidate Uploads Resume")
    with open("dummy.txt", "w") as f:
        f.write("dummy content")
    with open("dummy.txt", "rb") as f:
        res = client.post("/candidates/upload", files={"file": ("dummy.txt", f, "text/plain")}, data={"document_type": "resume"}, headers=cand1_headers)
    if res.status_code != 200:
        print("FAIL: Document upload failed", res.json())
        sys.exit(1)
    doc_url = res.json()["file_url"]
    print("Uploaded document URL:", doc_url)

    # Admin to create job
    admin_data = {
        "email": "admin@example.com",
        "password": "Password123",
        "role": "admin",
        "full_name": "Admin User"
    }
    client.post("/auth/signup", json=admin_data)
    res = client.post("/auth/login", data={"username": "admin@example.com", "password": "Password123"})
    admin_token = res.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # 3. Create Job with KKM
    print("Test 3: Create Job with KKM")
    job_data = {
        "title": "Software Engineer",
        "description": "Backend Developer",
        "expected_outcomes": "None",
        "specific_skills": "None",
        "kkm_score": 75.0
    }
    res = client.post("/jobs/", json=job_data, headers=admin_headers)
    if res.status_code != 200:
        print("FAIL: Job creation failed", res.json())
        sys.exit(1)
    job_id = res.json()["id"]
    magic_link = res.json()["magic_link_token"]
    
    # 4. Candidates apply
    print("Test 4: Candidates Apply")
    res1 = client.post(f"/applications/apply/{magic_link}", headers=cand1_headers)
    app1_id = res1.json()["id"]
    res2 = client.post(f"/applications/apply/{magic_link}", headers=cand2_headers)
    app2_id = res2.json()["id"]
    
    # 5. Simulate Assessment Results directly in DB
    print("Test 5: Simulate Assessment Results and Rank/KKM")
    cand1_res = models.AssessmentResult(
        application_id=app1_id,
        candidate_answer="Answer 1",
        overall_score=80.0,
        ai_cheating_detected=False
    )
    cand2_res = models.AssessmentResult(
        application_id=app2_id,
        candidate_answer="Answer 2",
        overall_score=70.0,
        ai_cheating_detected=False
    )
    db.add(cand1_res)
    db.add(cand2_res)
    db.commit()
    
    db.refresh(cand1_res)
    
    # Run the run_ai_eval_sync_task to test notification logic. Wait, run_ai_eval_sync_task does an actual AI call if we don't mock it. 
    # But wait, we can just check if notification is inserted by looking at tasks.py logic. The logic inserts a notification. Let's mock evaluate_candidate_answer_task.
    
    # Test GET /candidates/applications
    res = client.get("/candidates/applications", headers=cand1_headers)
    apps = res.json()
    print("Cand 1 applications:", apps)
    app1 = apps[0]
    if app1["rank"] != 1:
        print(f"FAIL: Cand1 should be rank 1 but got {app1.get('rank')}")
        sys.exit(1)
    if not app1["passed_kkm"]:
        print("FAIL: Cand1 should have passed KKM")
        sys.exit(1)
        
    res = client.get("/candidates/applications", headers=cand2_headers)
    apps = res.json()
    print("Cand 2 applications:", apps)
    app2 = apps[0]
    if app2["rank"] != 2:
        print(f"FAIL: Cand2 should be rank 2 but got {app2.get('rank')}")
        sys.exit(1)
    if app2["passed_kkm"]:
        print("FAIL: Cand2 should not have passed KKM")
        sys.exit(1)
        
    print("All tests passed!")

if __name__ == "__main__":
    run_tests()
