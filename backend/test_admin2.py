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

SQLALCHEMY_DATABASE_URL = "sqlite:///./test_admin2.db"
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

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = TestingSessionLocal()
company = models.Company(name="Fixed Company")
db.add(company)
db.commit()
db.refresh(company)

from utils import auth
admin_user = models.User(
    email="admin_fixed@example.com",
    hashed_password=auth.get_password_hash("Password123"),
    role="admin",
    full_name="Admin Fixed",
    company_id=company.id
)
db.add(admin_user)
db.commit()
db.refresh(admin_user)
db.close()

response = client.post("/auth/login", data={"username": "admin_fixed@example.com", "password": "Password123"})
admin_token = response.json()["access_token"]
admin_headers = {"Authorization": f"Bearer {admin_token}"}

sub_account_data = {
    "email": "recruiter_fixed@example.com",
    "password": "Password123",
    "full_name": "Recruiter User"
}
client.post("/auth/sub-accounts", json=sub_account_data, headers=admin_headers)

response = client.post("/auth/login", data={"username": "recruiter_fixed@example.com", "password": "Password123"})
rec_token = response.json()["access_token"]
rec_headers = {"Authorization": f"Bearer {rec_token}"}

job_data = {
    "title": "Recruiter Job",
    "description": "Test",
    "expected_outcomes": "None",
    "specific_skills": "None",
    "compliance_criteria": "None",
    "language": "English",
    "location": "Remote",
    "salary_range": "100k",
    "job_type": "Full-time"
}
response = client.post("/jobs/", json=job_data, headers=rec_headers)
job_id = response.json()["id"]

print("Attempting to update job as admin (with valid company_id)...")
update_data = {"title": "Admin Edited"}
resp = client.put(f"/jobs/{job_id}", json=update_data, headers=admin_headers)
print("Update response:", resp.status_code, resp.json())
if resp.status_code != 200:
    print("FAILED: Admin cannot update recruiter's job despite being in the same company.")

print("Attempting to delete job as admin (with valid company_id)...")
resp = client.delete(f"/jobs/{job_id}", headers=admin_headers)
print("Delete response:", resp.status_code, resp.json())
if resp.status_code != 200:
    print("FAILED: Admin cannot delete recruiter's job despite being in the same company.")
