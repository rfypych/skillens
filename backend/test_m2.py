import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timezone

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from main import app
from database import Base, get_db
import models

# Use a test database
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

def setup_module(module):
    Base.metadata.create_all(bind=engine)

def teardown_module(module):
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_m2.db"):
        os.remove("./test_m2.db")

def test_m2_kkm_and_ranking():
    db = TestingSessionLocal()
    
    # 1. Create a recruiter
    recruiter = models.User(email="recruiter@test.com", hashed_password="pwd", role="recruiter")
    db.add(recruiter)
    db.commit()
    db.refresh(recruiter)
    
    # 2. Create a job with KKM score
    job = models.Job(owner_id=recruiter.id, title="Test Job", description="Test desc", 
                     expected_outcomes="Test out", specific_skills="Test skills", 
                     kkm_score=75.0, status="open")
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # 3. Create three candidates
    c1 = models.User(email="c1@test.com", hashed_password="pwd", role="candidate")
    c2 = models.User(email="c2@test.com", hashed_password="pwd", role="candidate")
    c3 = models.User(email="c3@test.com", hashed_password="pwd", role="candidate")
    db.add_all([c1, c2, c3])
    db.commit()
    
    # 4. Create applications for them
    app1 = models.Application(user_id=c1.id, job_id=job.id, status="evaluated")
    app2 = models.Application(user_id=c2.id, job_id=job.id, status="evaluated")
    app3 = models.Application(user_id=c3.id, job_id=job.id, status="evaluated")
    db.add_all([app1, app2, app3])
    db.commit()
    
    # 5. Add assessment results with different scores
    # c1 gets 80 (Pass), c2 gets 70 (Fail), c3 gets 90 (Pass)
    res1 = models.AssessmentResult(application_id=app1.id, candidate_answer="A", overall_score=80.0)
    res2 = models.AssessmentResult(application_id=app2.id, candidate_answer="B", overall_score=70.0)
    res3 = models.AssessmentResult(application_id=app3.id, candidate_answer="C", overall_score=90.0)
    db.add_all([res1, res2, res3])
    db.commit()
    
    # Also add a notification for c1
    notif1 = models.Notification(user_id=c1.id, message="Test Notif")
    db.add(notif1)
    db.commit()
    
    # Log in as c1 to check applications
    from utils.auth import create_access_token
    token_c1 = create_access_token(data={"sub": c1.email})
    headers_c1 = {"Authorization": f"Bearer {token_c1}"}
    
    resp_c1 = client.get("/candidates/applications", headers=headers_c1)
    assert resp_c1.status_code == 200, resp_c1.text
    data_c1 = resp_c1.json()
    assert len(data_c1) == 1
    
    print("C1 Data:", data_c1[0])
    
    # c1 scored 80, should have rank 2 (c3 got 90, c1 got 80, c2 got 70)
    assert data_c1[0]["rank"] == 2
    assert data_c1[0]["passed_kkm"] == True
    
    # Log in as c2
    token_c2 = create_access_token(data={"sub": c2.email})
    headers_c2 = {"Authorization": f"Bearer {token_c2}"}
    
    resp_c2 = client.get("/candidates/applications", headers=headers_c2)
    data_c2 = resp_c2.json()
    
    # c2 scored 70, rank 3, passed_kkm False
    assert data_c2[0]["rank"] == 3
    assert data_c2[0]["passed_kkm"] == False
    
    # Log in as c3
    token_c3 = create_access_token(data={"sub": c3.email})
    headers_c3 = {"Authorization": f"Bearer {token_c3}"}
    
    resp_c3 = client.get("/candidates/applications", headers=headers_c3)
    data_c3 = resp_c3.json()
    
    # c3 scored 90, rank 1, passed_kkm True
    assert data_c3[0]["rank"] == 1
    assert data_c3[0]["passed_kkm"] == True
    
    print("All assertions passed!")
