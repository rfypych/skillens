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
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_admin.db"
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

admin_data = {
    "email": "admin2@example.com",
    "password": "Password123",
    "role": "admin",
    "full_name": "Admin User",
    "company_name": "Test Company 2"
}
client.post("/auth/signup", json=admin_data)
response = client.post("/auth/login", data={"username": "admin2@example.com", "password": "Password123"})
admin_token = response.json()["access_token"]
admin_headers = {"Authorization": f"Bearer {admin_token}"}

sub_account_data = {
    "email": "recruiter2@example.com",
    "password": "Password123",
    "full_name": "Recruiter User"
}
client.post("/auth/sub-accounts", json=sub_account_data, headers=admin_headers)

response = client.post("/auth/login", data={"username": "recruiter2@example.com", "password": "Password123"})
rec_token = response.json()["access_token"]
rec_headers = {"Authorization": f"Bearer {rec_token}"}

future_deadline = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=7)).isoformat()
job_data = {
    "title": "Recruiter Job",
    "description": "Test",
    "expected_outcomes": "None",
    "specific_skills": "None",
    "compliance_criteria": "None",
    "language": "English",
    "location": "Remote",
    "salary_range": "100k",
    "job_type": "Full-time",
    "deadline": future_deadline
}
response = client.post("/jobs/", json=job_data, headers=rec_headers)
job_id = response.json()["id"]

print("Attempting to update job as admin...")
update_data = {"title": "Admin Edited"}
resp = client.put(f"/jobs/{job_id}", json=update_data, headers=admin_headers)
print("Update response:", resp.status_code, resp.json())
if resp.status_code != 200:
    print("FAILED: Admin cannot update recruiter's job.")

print("Attempting to delete job as admin...")
resp = client.delete(f"/jobs/{job_id}", headers=admin_headers)
print("Delete response:", resp.status_code, resp.json())
if resp.status_code != 200:
    print("FAILED: Admin cannot delete recruiter's job.")
