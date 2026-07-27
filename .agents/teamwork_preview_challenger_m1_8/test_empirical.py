import os
import sys
import subprocess
import time
import requests
import datetime

# Define base URL for the backend
BASE_URL = "http://127.0.0.1:8000"

def start_backend():
    print("Starting backend server...")
    backend_dir = os.path.join("d:\\projects\\JHIC-rev", "backend")
    env = os.environ.copy()
    env["ENVIRONMENT"] = "test"
    proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "main:app", "--port", "8000"],
        cwd=backend_dir,
        env=env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    # Wait for server to start
    for _ in range(30):
        try:
            r = requests.get(f"{BASE_URL}/health")
            if r.status_code == 200:
                print("Backend started.")
                return proc
        except requests.exceptions.ConnectionError:
            time.sleep(1)
    print("Failed to start backend.")
    proc.terminate()
    return None

def test_endpoints():
    errors = []
    
    # 1. Check if the required contract POST /api/users/sub-accounts exists.
    # Note: If the backend is running without an /api prefix but NextJS proxies it, we should check if `/users/sub-accounts` or `/api/users/sub-accounts` exists.
    # Based on the worker's handoff, they put it at `/auth/sub-accounts`. This is a failure in the contract.
    r = requests.post(f"{BASE_URL}/api/users/sub-accounts", json={})
    if r.status_code == 404:
        r2 = requests.post(f"{BASE_URL}/users/sub-accounts", json={})
        if r2.status_code == 404:
            errors.append("Contract violation: POST /api/users/sub-accounts (or /users/sub-accounts) not found. Endpoint implemented at /auth/sub-accounts instead.")

    # Let's perform a functional test using the actual implemented endpoints to verify logic
    # Create an admin user
    admin_email = f"admin_{int(time.time())}@test.com"
    r = requests.post(f"{BASE_URL}/auth/signup", json={
        "email": admin_email,
        "password": "Password123!",
        "role": "admin",
        "full_name": "Admin User",
        "company_name": "Test Company"
    })
    
    if r.status_code != 200:
        errors.append(f"Failed to create admin user: {r.text}")
        return errors

    admin_data = r.json()
    
    # Login admin
    r = requests.post(f"{BASE_URL}/auth/login", data={
        "username": admin_email,
        "password": "Password123!"
    })
    if r.status_code != 200:
        errors.append("Admin login failed")
        return errors
        
    admin_token = r.json().get("access_token")
    admin_headers = {"Authorization": f"Bearer {admin_token}"}
    
    # Verify the admin's role
    r = requests.get(f"{BASE_URL}/auth/me", headers=admin_headers)
    if r.json().get("role") != "admin":
        errors.append("Created user is not an admin")

    # Create sub-account
    sub_email = f"sub_{int(time.time())}@test.com"
    # Using the implemented endpoint instead of the contracted one to test the logic
    r = requests.post(f"{BASE_URL}/auth/sub-accounts", json={
        "email": sub_email,
        "password": "Password123!",
        "full_name": "Sub User"
    }, headers=admin_headers)
    
    if r.status_code != 200:
        errors.append(f"Admin failed to create sub-account: {r.text}")
    else:
        sub_data = r.json()
        if sub_data.get("role") != "recruiter":
            errors.append("Sub-account should have 'recruiter' role")
            pass
            
        # Login sub-account
        r = requests.post(f"{BASE_URL}/auth/login", data={
            "username": sub_email,
            "password": "Password123!"
        })
        sub_token = r.json().get("access_token")
        sub_headers = {"Authorization": f"Bearer {sub_token}"}
        
        # Test 2: Sub-account cannot create another sub-account
        sub2_email = f"sub2_{int(time.time())}@test.com"
        r = requests.post(f"{BASE_URL}/auth/sub-accounts", json={
            "email": sub2_email,
            "password": "Password123!",
            "full_name": "Sub2 User"
        }, headers=sub_headers)
        if r.status_code == 200:
            errors.append("VULNERABILITY: Sub-account (recruiter) was able to create another sub-account")
            
    # Test 3: Job Deadline logic
    # Create a job with past deadline
    past_deadline = (datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(days=1)).isoformat()
    r = requests.post(f"{BASE_URL}/jobs/", json={
        "title": "Expired Job",
        "description": "desc",
        "expected_outcomes": "none",
        "specific_skills": "none",
        "requirements": "req",
        "location": "Remote",
        "salary_range": "100k",
        "job_type": "Full-time",
        "deadline": past_deadline
    }, headers=admin_headers)
    
    if r.status_code != 200:
        errors.append(f"Failed to create job with deadline: {r.text}")
    else:
        job_id = r.json()["id"]
        # Candidate tries to apply
        r = requests.post(f"{BASE_URL}/assessment/{job_id}/apply", json={
            "candidate_name": "Cand",
            "candidate_email": f"cand_{int(time.time())}@test.com",
            "resume_url": "http://test.com/resume.pdf"
        })
        if r.status_code == 200:
            errors.append("VULNERABILITY: Candidate could apply to an expired job")
        elif r.status_code == 400 and "deadline" in r.json().get("detail", "").lower():
            pass # Expected
        elif r.status_code == 400 and "expired" in r.json().get("detail", "").lower():
            pass
        else:
            errors.append(f"Unexpected response when applying to expired job: {r.status_code} {r.text}")

    return errors

if __name__ == "__main__":
    proc = start_backend()
    if not proc:
        sys.exit(1)
        
    try:
        errors = test_endpoints()
        if errors:
            print("FAILED")
            for e in errors:
                print(f"- {e}")
            sys.exit(1)
        else:
            print("PASSED")
            sys.exit(0)
    finally:
        proc.terminate()
