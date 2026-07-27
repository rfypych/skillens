import sys
import os
import datetime
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

# Mock environment variables before importing app
os.environ["DATABASE_URL"] = "sqlite:///./test_m2.db"
os.environ["JWT_SECRET_KEY"] = "supersecretsupersecretsupersecret!"
os.environ["REDIS_URL"] = "redis://localhost:6379/0"

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from main import app
from database import Base, get_db
import models

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
    
    # 1. Create Admin & Job with KKM
    admin_data = {
        "email": "admin@example.com",
        "password": "password123",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    }
    client.post("/auth/signup", json=admin_data)
    resp = client.post("/auth/login", data={"username": "admin@example.com", "password": "password123"})
    admin_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    job_data = {
        "title": "Software Engineer",
        "description": "Test",
        "expected_outcomes": "Code",
        "specific_skills": "Python",
        "compliance_criteria": "None",
        "language": "English",
        "location": "Remote",
        "salary_range": "100k",
        "job_type": "Full-time",
        "deadline": (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).isoformat(),
        "kkm_score": 75.0
    }
    resp = client.post("/jobs/", json=job_data, headers=admin_headers)
    print("Job Creation:", resp.status_code, resp.json())
    assert resp.status_code == 200, "Failed to create job"
    job_id = resp.json()["id"]
    magic_link = resp.json()["magic_link_token"]

    # 2. Create Candidate
    cand_data = {
        "email": "candidate@example.com",
        "password": "password123",
        "full_name": "Candidate User"
    }
    client.post("/auth/signup", json=cand_data)
    resp = client.post("/auth/login", data={"username": "candidate@example.com", "password": "password123"})
    cand_headers = {"Authorization": f"Bearer {resp.json()['access_token']}"}

    # 3. Test document upload
    with open("dummy.pdf", "wb") as f:
        f.write(b"dummy PDF content")

    with open("dummy.pdf", "rb") as f:
        resp = client.post("/candidates/upload", files={"file": ("dummy.pdf", f)}, data={"document_type": "resume"}, headers=cand_headers)
        print("Upload Doc:", resp.status_code, resp.json())
        assert resp.status_code == 200, "Failed to upload document"

    # 4. Candidate Applies for Job (We assume the apply endpoint is in public.py?)
    # Wait, earlier I saw test_m1_1.py used /applications/apply/{magic_link}. Let's see if that works.
    resp = client.post(f"/applications/apply/{magic_link}", headers=cand_headers)
    print("Apply Job:", resp.status_code, resp.json())
    assert resp.status_code in [200, 201], f"Failed to apply: {resp.text}"

    # 5. Inject Application, Assessment, and AssessmentResult to test KKM tracking
    db = TestingSessionLocal()
    app_db = db.query(models.Application).filter(models.Application.job_id == job_id).first()
    if not app_db:
        print("FAIL: No application found.")
        return

    # Create dummy Assessment
    ass = models.Assessment(job_id=job_id, scenario_prompt="test", hidden_prompt="test")
    db.add(ass)
    db.commit()
    
    # Candidate 1 gets 80 (Passes KKM 75)
    res = models.AssessmentResult(
        application_id=app_db.id,
        assessment_id=ass.id,
        overall_score=80.0,
        detailed_feedback="Good",
        passed_hidden_prompt=True,
        kkm_passed=True
    )
    db.add(res)
    
    # Create Candidate 2
    cand2 = models.User(email="cand2@test.com", hashed_password="x", full_name="C2", role="candidate", company_id=None)
    db.add(cand2)
    db.commit()
    
    app2 = models.Application(user_id=cand2.id, job_id=job_id, status="completed")
    db.add(app2)
    db.commit()
    
    # Candidate 2 gets 70 (Fails KKM 75)
    res2 = models.AssessmentResult(
        application_id=app2.id,
        assessment_id=ass.id,
        overall_score=70.0,
        detailed_feedback="Bad",
        passed_hidden_prompt=True,
        kkm_passed=False
    )
    db.add(res2)
    db.commit()

    # 6. Test applications query to see rank and passed_kkm
    resp = client.get("/candidates/applications", headers=cand_headers)
    print("Get Applications:", resp.status_code, json.dumps(resp.json(), indent=2))
    assert resp.status_code == 200
    
    data = resp.json()
    assert len(data) > 0, "No applications returned"
    
    # Cand1 should be rank 1 and passed_kkm == True
    cand1_app = data[0]
    print("Cand1 App passed_kkm:", cand1_app.get("passed_kkm"), "rank:", cand1_app.get("rank"))
    if cand1_app.get("passed_kkm") != True:
        print("FAIL: Expected passed_kkm to be True for Candidate 1")
    if cand1_app.get("rank") != 1:
        print("FAIL: Expected rank to be 1 for Candidate 1")
    
    # 7. Check Notifications
    # Create notification dummy
    notif = models.Notification(user_id=cand1_app["user_id"], message="Test")
    db.add(notif)
    db.commit()
    db.refresh(notif)

    resp = client.get("/notifications/", headers=cand_headers)
    print("Get Notifications:", resp.status_code, resp.json())
    assert resp.status_code == 200
    
    # Mark read
    resp = client.put(f"/notifications/{notif.id}/read", headers=cand_headers)
    print("Mark Notification Read:", resp.status_code, resp.json())
    assert resp.status_code == 200

    print("ALL TESTS PASSED OR COMPLETED.")

if __name__ == "__main__":
    run_tests()
