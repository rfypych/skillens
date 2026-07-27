import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["JWT_SECRET_KEY"] = "this_is_a_test_key_that_is_at_least_32_characters_long"
os.environ["REDIS_URL"] = "redis://localhost:6379"

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
import models
import schemas
import utils.auth
from main import app as fastapi_app
from fastapi.testclient import TestClient

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_kkm_and_rank():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        comp = models.Company(name="Test Corp")
        db.add(comp)
        db.commit()
        
        recruiter = models.User(email="recruiter@test.com", hashed_password="pw", role="recruiter", company_id=comp.id)
        db.add(recruiter)
        db.commit()
        
        job = models.Job(
            owner_id=recruiter.id,
            title="Software Engineer",
            description="desc",
            expected_outcomes="out",
            specific_skills="skills",
            kkm_score=70.0
        )
        db.add(job)
        db.commit()
        
        apps = []
        for i in range(5):
            cand = models.User(email=f"cand{i}@test.com", hashed_password="pw", role="candidate")
            db.add(cand)
            db.commit()
            
            app = models.Application(user_id=cand.id, job_id=job.id, status="evaluated")
            db.add(app)
            db.commit()
            apps.append(app)
            
        scores = [80.0, 90.0, 60.0, 80.0, None]
        for i, app in enumerate(apps):
            if scores[i] is not None:
                res = models.AssessmentResult(
                    application_id=app.id,
                    overall_score=scores[i],
                    ai_cheating_detected=False,
                    candidate_answer="My answer is XYZ"
                )
                db.add(res)
        db.commit()
        
        def override_get_db():
            try:
                yield db
            finally:
                pass
                
        fastapi_app.dependency_overrides[get_db] = override_get_db
        client = TestClient(fastapi_app)
        
        for i in range(5):
            def override_get_current_user(idx=i):
                user = db.query(models.User).filter_by(email=f"cand{idx}@test.com").first()
                return user
                
            fastapi_app.dependency_overrides[utils.auth.get_current_user] = lambda idx=i: override_get_current_user(idx)
            
            response = client.get("/candidates/applications")
            print(f"Cand {i} response: {response.status_code}")
            data = response.json()
            if len(data) > 0:
                print(f"Cand {i} Rank: {data[0].get('rank')}, Passed KKM: {data[0].get('passed_kkm')}, Score: {scores[i]}")
            else:
                print(f"Cand {i} no applications returned.")
                
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

if __name__ == "__main__":
    test_kkm_and_rank()
