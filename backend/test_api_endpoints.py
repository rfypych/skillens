import urllib.request
import urllib.parse
import json
import os

BASE_URL = "https://skillens-backend-production.up.railway.app"

def test_api():
    print(f"=== TESTING LIVE PRODUCTION API: {BASE_URL} ===\n")

    # 1. Test Health / OpenAPI Specs
    print("1. Testing GET /docs (OpenAPI Swagger Docs)...")
    try:
        req = urllib.request.Request(f"{BASE_URL}/docs")
        with urllib.request.urlopen(req) as resp:
            print(f"   [SUCCESS] Status: {resp.status}")
    except Exception as e:
        print(f"   [FAILED] {e}")

    # 2. Test Login API (OAuth2 Form Data)
    print("\n2. Testing POST /auth/login (Candidate Credential)...")
    login_data = urllib.parse.urlencode({
        "username": "kandidat@skillens.com",
        "password": "password123"
    }).encode('utf-8')
    
    token = None
    try:
        req = urllib.request.Request(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            token = data.get("access_token")
            print(f"   [SUCCESS] Status: {resp.status}")
            print(f"   Token Received: {token[:30]}...")
    except Exception as e:
        print(f"   [FAILED] {e}")

    # 3. Test Auth Me API
    if token:
        print("\n3. Testing GET /auth/me (Protected Route with Bearer Token)...")
        try:
            req = urllib.request.Request(
                f"{BASE_URL}/auth/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            with urllib.request.urlopen(req) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                print(f"   [SUCCESS] Status: {resp.status}")
                print(f"   User Info: Email={data.get('email')}, Role={data.get('role')}, Name={data.get('full_name')}")
        except Exception as e:
            print(f"   [FAILED] {e}")

    # 4. Test PDF Document Upload API (/candidates/upload)
    if token:
        print("\n4. Testing POST /candidates/upload (PDF File Upload via Terminal)...")
        dummy_pdf_content = b"%PDF-1.4 sample pdf resume document content for terminal upload test"
        boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
        
        body = (
            f"--{boundary}\r\n"
            f'Content-Disposition: form-data; name="file"; filename="curriculum_vitae.pdf"\r\n'
            f"Content-Type: application/pdf\r\n\r\n"
        ).encode('utf-8') + dummy_pdf_content + (
            f"\r\n--{boundary}\r\n"
            f'Content-Disposition: form-data; name="document_type"\r\n\r\n'
            f"resume"
            f"\r\n--{boundary}--\r\n"
        ).encode('utf-8')

        try:
            req = urllib.request.Request(
                f"{BASE_URL}/candidates/upload",
                data=body,
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": f"multipart/form-data; boundary={boundary}"
                }
            )
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read().decode('utf-8'))
                print(f"   [SUCCESS] Status: {resp.status}")
                print(f"   Uploaded Document ID: {result.get('id')}")
                print(f"   Document Name: {result.get('name')}")
                print(f"   Stored File URL: {result.get('file_url')}")
        except Exception as e:
            print(f"   [FAILED] {e}")

    # 5. Test Candidate Applications API
    if token:
        print("\n5. Testing GET /candidates/applications (Candidate Applications List)...")
        try:
            req = urllib.request.Request(
                f"{BASE_URL}/candidates/applications",
                headers={"Authorization": f"Bearer {token}"}
            )
            with urllib.request.urlopen(req) as resp:
                apps = json.loads(resp.read().decode('utf-8'))
                print(f"   [SUCCESS] Status: {resp.status}")
                print(f"   Total Candidate Applications: {len(apps)}")
        except Exception as e:
            print(f"   [FAILED] {e}")

    print("\n=== ALL TERMINAL API TESTS COMPLETED ===")

if __name__ == "__main__":
    test_api()
