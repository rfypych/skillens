# 📘 Skillens AI Platform - Complete API Documentation

Dokumentasi lengkap RESTful API untuk **Skillens AI Platform** — Platform Penilai Bakat AI Interaktif.

---

## 🌐 Environment & Base URLs

| Environment | Base URL |
| :--- | :--- |
| **Production API (Railway)** | `https://skillens-backend-production.up.railway.app` |
| **Production Web App (Vercel)** | `https://skillens-app.vercel.app` |
| **Local Development** | `http://127.0.0.1:8000` |
| **Swagger Interactive Docs** | `https://skillens-backend-production.up.railway.app/docs` |

---

## 🔑 Autentikasi & Header

Sebagian besar endpoint memerlukan token **JWT Bearer** di dalam HTTP Header `Authorization`.

```http
Authorization: Bearer <YOUR_ACCESS_TOKEN>
Accept: application/json
Content-Type: application/json
```

---

## 🔐 1. Authentication Endpoints (`/auth`)

### 1.1 Register Account (Signup)
Membuat akun baru sebagai kandidat (`candidate`) atau rekruter (`recruiter`).

- **HTTP Method**: `POST`
- **Endpoint**: `/auth/signup`
- **Auth Required**: No

**Request Body (`application/json`)**:
```json
{
  "email": "kandidat@skillens.com",
  "password": "password123",
  "full_name": "Budi Santoso",
  "role": "candidate"
}
```
*(Untuk rekruter, tambahkan `"role": "recruiter"` dan `"company_name": "Nama Perusahaan"`)*

**Response (200 OK)**:
```json
{
  "id": 1,
  "email": "kandidat@skillens.com",
  "full_name": "Budi Santoso",
  "role": "candidate",
  "company_id": null,
  "created_at": "2026-07-28T13:58:24.123456Z"
}
```

---

### 1.2 Login Account
Melakukan autentikasi dan mendapatkan `access_token` JWT serta HTTP-only cookie.

- **HTTP Method**: `POST`
- **Endpoint**: `/auth/login`
- **Auth Required**: No
- **Content-Type**: `application/x-www-form-urlencoded`

**Request Body (Form Data)**:
```text
username=kandidat@skillens.com
password=password123
```

**Response (200 OK)**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkX...",
  "token_type": "bearer"
}
```

---

### 1.3 Get Profile Information (`/auth/me`)
Mendapatkan profil pengguna yang sedang login berdasarkan Bearer Token.

- **HTTP Method**: `GET`
- **Endpoint**: `/auth/me`
- **Auth Required**: Yes (`Bearer Token`)

**Response (200 OK)**:
```json
{
  "id": 1,
  "email": "kandidat@skillens.com",
  "full_name": "Budi Santoso",
  "role": "candidate",
  "company_name": null,
  "created_at": "2026-07-28T13:58:24.123456Z"
}
```

---

### 1.4 Refresh Token & Logout
- `POST /auth/refresh`: Memperbarui access token yang kadaluarsa.
- `POST /auth/logout`: Menghapus session cookie dan me-revoke token.

---

## 💼 2. Job Openings Endpoints (`/jobs`)

### 2.1 Get All Jobs
Mendapatkan daftar lowongan pekerjaan yang sedang aktif.

- **HTTP Method**: `GET`
- **Endpoint**: `/jobs`
- **Auth Required**: No

**Response (200 OK)**:
```json
[
  {
    "id": 1,
    "title": "Senior Frontend Engineer (React / Next.js)",
    "description": "Kami mencari Senior Frontend Engineer berpengalaman...",
    "expected_outcomes": "Mengembangkan UI responsive modern...",
    "specific_skills": "React, Next.js 16, TypeScript, Tailwind CSS, WebGL",
    "compliance_criteria": "Minimal 3+ tahun pengalaman kerja",
    "language": "Indonesian",
    "status": "active",
    "owner_id": 2,
    "company_name": "Skillens Tech Indonesia",
    "created_at": "2026-07-28T13:58:24.123456Z"
  }
]
```

---

### 2.2 Create Job Opening (Recruiter Only)
Menambahkan lowongan pekerjaan baru oleh Rekruter.

- **HTTP Method**: `POST`
- **Endpoint**: `/jobs`
- **Auth Required**: Yes (`Recruiter Role`)

**Request Body (`application/json`)**:
```json
{
  "title": "AI Assessment Specialist",
  "description": "Mengembangkan kriteria penilaian otomatis kandidat.",
  "expected_outcomes": "Membuat prompt evaluasi yang presisi.",
  "specific_skills": "Python, FastAPI, LLM, Prompt Engineering",
  "compliance_criteria": "Pengalaman 2+ tahun",
  "language": "Indonesian"
}
```

---

## 📄 3. Candidate & Resume Endpoints (`/candidates`)

### 3.1 Upload PDF Resume / Document
Mengunggah file CV / PDF resume kandidat ke server.

- **HTTP Method**: `POST`
- **Endpoint**: `/candidates/upload`
- **Auth Required**: Yes (`Candidate Role`)
- **Content-Type**: `multipart/form-data`

**Form Parameters**:
- `file`: `<FILE_BINARY>` (Format `.pdf`, `.doc`, `.docx`)
- `document_type`: `"resume"` (Optional, default `"resume"`)

**Response (200 OK)**:
```json
{
  "id": 1,
  "user_id": 1,
  "name": "curriculum_vitae.pdf",
  "document_type": "resume",
  "file_url": "/uploads/20260728070208_curriculum_vitae.pdf",
  "created_at": "2026-07-28T14:02:08.123456Z"
}
```

---

### 3.2 Get Candidate Applications
Mendapatkan status aplikasi kandidat beserta rangking dan status kelulusan KKM.

- **HTTP Method**: `GET`
- **Endpoint**: `/candidates/applications`
- **Auth Required**: Yes (`Candidate Role`)

**Response (200 OK)**:
```json
[
  {
    "id": 101,
    "job_id": 1,
    "user_id": 1,
    "status": "completed",
    "rank": 1,
    "passed_kkm": true,
    "created_at": "2026-07-28T14:00:00.000000Z"
  }
]
```

---

## 🤖 4. AI Interactive Interview Endpoints (`/interviews`)

### 4.1 Initialize AI Interview Session
Memulai sesi wawancara AI interaktif untuk lamaran pekerjaan tertentu.

- **HTTP Method**: `POST`
- **Endpoint**: `/interviews/initialize`
- **Auth Required**: Yes (`Candidate Role`)

**Request Body (`application/json`)**:
```json
{
  "application_id": 101
}
```

**Response (200 OK)**:
```json
{
  "session_id": "sess_89412a0f-1234",
  "initial_question": "Halo Budi! Selamat datang di wawancara AI Skillens. Ceritakan pengalaman Anda saat membangun antarmuka web dengan React dan Next.js?",
  "status": "in_progress"
}
```

---

### 4.2 Send Interview Response Message
Mengirimkan jawaban kandidat dan menerima evaluasi / pertanyaan lanjutan dari AI Interviewer (Llama 3.3 70B via Groq).

- **HTTP Method**: `POST`
- **Endpoint**: `/interviews/message`
- **Auth Required**: Yes (`Candidate Role`)

**Request Body (`application/json`)**:
```json
{
  "session_id": "sess_89412a0f-1234",
  "answer_text": "Saya berpengalaman selama 4 tahun membangun web app dengan Next.js App Router, Tailwind CSS, serta mengoptimalkan WebGL Shaders."
}
```

**Response (200 OK)**:
```json
{
  "session_id": "sess_89412a0f-1234",
  "ai_response": "Sangat menarik! Bagaimana cara Anda menangani penurunan performa pada rendering canvas WebGL pada perangkat mobile low-end?",
  "completed": false
}
```

---

### 4.3 Finish AI Interview Session
Menyelesaikan wawancara AI dan menghitung nilai penilaian otomatis (*Overall Score & Match Percentage*).

- **HTTP Method**: `POST`
- **Endpoint**: `/interviews/finish`
- **Auth Required**: Yes (`Candidate Role`)

**Request Body (`application/json`)**:
```json
{
  "session_id": "sess_89412a0f-1234"
}
```

**Response (200 OK)**:
```json
{
  "session_id": "sess_89412a0f-1234",
  "status": "completed",
  "overall_score": 92.5,
  "match_percentage": 95.0,
  "summary_feedback": "Kandidat memiliki pemahaman teknis yang sangat kuat tentang Next.js dan optimasi WebGL mobile."
}
```

---

## 📊 5. AI Assessment & Analytics Endpoints (`/assessment`)

### 5.1 Get Assessment Results (Recruiter & Candidate)
Mendapatkan rincian skor hasil wawancara AI dan penilaian kualifikasi.

- **HTTP Method**: `GET`
- **Endpoint**: `/assessment/results/{application_id}`
- **Auth Required**: Yes

**Response (200 OK)**:
```json
{
  "application_id": 101,
  "overall_score": 92.5,
  "match_percentage": 95.0,
  "skill_breakdown": {
    "Technical Knowledge": 94,
    "Problem Solving": 90,
    "Communication": 93.5
  },
  "feedback": "Kandidat sangat direkomendasikan untuk tahap penawaran kerja."
}
```

---

## 💻 6. Contoh Perintah cURL Terminal

### A. Login & Ambil Access Token
```bash
curl -X POST "https://skillens-backend-production.up.railway.app/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=kandidat@skillens.com&password=password123"
```

### B. Cek Profile User Saat Ini
```bash
curl -X GET "https://skillens-backend-production.up.railway.app/auth/me" \
  -H "Authorization: Bearer <TOKEN_ANDA>"
```

### C. Upload Document PDF Resume
```bash
curl -X POST "https://skillens-backend-production.up.railway.app/candidates/upload" \
  -H "Authorization: Bearer <TOKEN_ANDA>" \
  -F "file=@/path/to/cv.pdf" \
  -F "document_type=resume"
```

---

## 🧪 7. Script Tes Python Otomatis Terminal
Anda dapat menjalankan script tes otomatis terminal yang berada di repository:

```bash
python backend/test_api_endpoints.py
```
