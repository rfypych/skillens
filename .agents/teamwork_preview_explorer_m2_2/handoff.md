# Handoff Report: Milestone 2 - Candidate Registration & KKM Tracking

## 1. Observation
- `backend/models.py`: `CandidateProfile` currently only has a single `resume_url`. There is no table for multiple documents. `Job` does not have a `kkm_score` field. `Application` relies on `status` to track progress, but there is no rank calculation. No `Notification` model exists.
- `backend/routers/` and `backend/main.py`: The required API endpoints (`POST /api/candidates/register`, `POST /api/candidates/upload`, `GET /api/candidates/applications`) from `SCOPE.md` do not exist. User registration is currently in `auth.py`.
- `backend/services/assessment_service.py`: `submit_assessment` sets application status to `evaluated` and triggers AI evaluation. No notification is generated after evaluation.
- `frontend/src/app/candidate/profile/page.tsx`: The UI only allows a single resume URL text input.
- `frontend/src/app/candidate/dashboard/page.tsx`: The UI shows application status but does not display any rank or KKM status.
- `frontend/src/components/Header.tsx` (inferred): Lacks a notification dropdown component.

## 2. Logic Chain
1. **Multiple Documents**: To support CVs and certificates, the database needs a one-to-many relationship (`CandidateDocument` -> `CandidateProfile`). The frontend profile page needs file inputs for these documents.
2. **KKM Configuration**: `Job` needs a `kkm_score` column. Recruiters configure this during job creation/editing. 
3. **Auto-Ranking & Candidate Applications API**: To fulfill the `SCOPE.md` contracts, a new `routers/candidates.py` must be created. The `GET /api/candidates/applications` route must calculate the candidate's anonymous rank for each application (e.g., `Rank = COUNT(other applications with higher score) + 1`) and evaluate if the `overall_score >= kkm_score`.
4. **Notifications**: In-app notifications require a new `Notification` model. A notification should be created when the AI evaluation finishes in `tasks.py`. The frontend needs a `GET /api/notifications` polling or fetching mechanism in the Header.

## 3. Caveats
- No WebSocket/SSE infrastructure is currently present for "real-time" status. Standard polling or on-mount fetching (as done in `dashboard/page.tsx`) will be used to simulate real-time updates unless the implementer adds SSE.
- `SCOPE.md` says `POST /api/candidates/register` but `routers/auth.py` already has `/auth/signup`. We should route candidate-specific registration to `/api/candidates/register` or alias it to ensure contract compliance.

## 4. Conclusion
**Implementation Strategy:**
- **Database (Alembic)**:
  - Add `CandidateDocument` model (id, profile_id, document_type, file_url, name).
  - Add `kkm_score` (Float, default=0.0) to `Job`.
  - Add `Notification` model (id, user_id, message, is_read, created_at).
- **Backend API**:
  - Create `backend/routers/candidates.py` with `/register`, `/upload` (handling multipart/form-data for multiple docs), and `/applications`.
  - In `/applications`, annotate the response with `rank`, `total_applicants`, and `kkm_passed` (boolean) by querying `AssessmentResult` and comparing against `Job.kkm_score`.
  - Create `backend/routers/notifications.py` for fetching and marking notifications as read.
  - Update `backend/tasks.py` (`run_ai_eval_sync_task`) to insert a `Notification` for the candidate once evaluation completes.
- **Frontend**:
  - Update `candidate/profile/page.tsx` to handle array-based document uploads.
  - Update `candidate/dashboard/page.tsx` to display Rank out of Total (e.g., `#3 of 10`) and KKM status (e.g., "Passed Minimum Score" badge).
  - Add a Notification bell to `components/Header.tsx`.

## 5. Verification Method
- **Backend**: Run `pytest` or check `scripts/check_schema.py` after running Alembic migrations. Start the server and `curl` the new `/api/candidates/applications` to verify `rank` and `kkm_score` fields exist.
- **Frontend**: Run `npm run dev` and navigate to the Candidate Dashboard to visually verify rank/KKM badges and the notification tray in the header. Test document upload via the Profile page.
