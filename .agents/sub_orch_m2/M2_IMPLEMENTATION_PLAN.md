# M2 Implementation Plan

## 1. Database (Alembic / SQLite)
- Add CandidateDocument model (id, user_id, document_type, ile_url, 
ame, created_at). (Note: Link to User or CandidateProfile).
- Add kkm_score (Float, default=0.0) to Job model.
- Add Notification model (id, user_id, message, is_read, created_at).
- Generate and apply Alembic migrations.

## 2. Backend APIs & Logic
- Create ackend/routers/candidates.py:
  - POST /upload - Handle multipart/form-data uploads, save to ackend/uploads/, create CandidateDocument.
  - GET /applications - Return candidate's applications, joined with Job and AssessmentResult. Compute ank (by sorting all applicants for that job by overall_score) and passed_kkm (overall_score >= job.kkm_score).
- Create ackend/routers/notifications.py:
  - GET / - Fetch unread notifications.
  - PUT /{id}/read - Mark as read.
- Trigger Notifications:
  - In ackend/tasks.py (after AI eval finishes), create a Notification for the user.
- Update ackend/main.py to include new routers.
- Update Job schemas to accept kkm_score.

## 3. Frontend Candidate UI
- candidate/profile/page.tsx: Replace simple URL input with a file upload input. Call POST /api/candidates/upload. Display uploaded docs.
- candidate/dashboard/page.tsx: Use GET /api/candidates/applications. Display the ank (e.g., "#3 of 10") and passed_kkm status visually.
- components/Header.tsx (or similar layout): Add a Notification bell that fetches from /api/notifications and displays a dropdown.

## 4. Frontend Recruiter UI
- ecruiter/jobs/new/page.tsx: Add input for KKM passing criteria (score).
