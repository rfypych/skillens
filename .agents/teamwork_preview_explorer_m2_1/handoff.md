# Handoff Report: Milestone 2 (Candidate Registration & KKM Tracking)

## 1. Observation
- **Backend Models & Schemas (`backend/models.py`, `backend/schemas.py`)**: 
  - `Job` model lacks a KKM configuration field (e.g., `kkm_score`).
  - `CandidateProfile` model has `resume_url` but lacks support for multiple documents (e.g., `certificates`).
  - `Application` model lacks computed attributes for `rank` and `passed_kkm`.
  - There is no `Notification` model for in-app notifications.
- **Backend API (`backend/routers/auth.py`, `backend/routers/applications.py`, `backend/routers/jobs.py`)**:
  - Profile updates currently go through `PUT /auth/me`. There is no dedicated `/api/candidates/register` or `/api/candidates/upload` API.
  - `applications.py` returns `GET /applications`, but `SCOPE.md` specifies `/api/candidates/applications`.
  - `job_service.py` handles job creation but does not accept or process KKM settings.
  - `application_service.py` fetches applications but does not calculate anonymous rank or KKM pass/fail status.
- **Frontend UI (`frontend/src/app/candidate/`)**:
  - `profile/page.tsx` has inputs for Bio, Experience, and a single URL for resume. It lacks file upload capabilities for CV and certificates.
  - `dashboard/page.tsx` displays applications and their statuses, but doesn't show an anonymous rank or KKM pass/fail badge.
  - `layout.tsx` has a hardcoded `Notification` bell icon that is purely visual and lacks a functional dropdown or API integration.
- **Frontend Recruiter UI (`frontend/src/app/recruiter/jobs/new/page.tsx`)**:
  - Job creation wizard lacks an input for KKM passing criteria under the AI parameters step.

## 2. Logic Chain
1. To support **multiple docs (CV, certificates)**, the backend needs a file upload endpoint (`POST /api/candidates/upload`) that stores files in `uploads/` and returns URLs. The `CandidateProfile` model must be extended to store these URLs (e.g., adding a `certificates` JSON/Text column). 
2. The frontend `profile/page.tsx` needs to replace the simple URL input with a multi-file upload component that interacts with the new upload endpoint.
3. To support **KKM configuration**, `kkm_score` (Float) must be added to the `Job` model and schemas. The recruiter's job creation wizard (`recruiter/jobs/new/page.tsx`) must be updated to capture this score.
4. To support **auto-ranking against KKM**, `application_service.py` must compute each application's rank relative to others for the same job (by comparing `overall_score` in `AssessmentResult`), and determine `passed_kkm` by comparing the score against the job's `kkm_score`. These fields must be added to `ApplicationResponse`.
5. The frontend `dashboard/page.tsx` must consume these new fields (`rank`, `passed_kkm`) to display the real-time status and anonymous rank (e.g., "Rank: #2 | Passed").
6. To support **in-app notifications**, a `Notification` backend model and corresponding API (`GET /api/notifications`, `PUT /api/notifications/{id}/read`) must be built. Notifications should be generated when candidates apply or when their test is evaluated. The frontend bell icon in `layout.tsx` needs to be wired to a dropdown displaying these notifications.

## 3. Caveats
- I assumed KKM translates to a simple minimum passing score (`kkm_score`). If KKM also involves quotas (e.g., "Rank 1-90 passes"), the rank computation logic in `application_service.py` needs to check if the rank is within the `kkm_quota`.
- I assumed the `/api/candidates/...` endpoints described in `SCOPE.md` can be implemented as a new `routers/candidates.py` router rather than altering the existing `auth` router too drastically, in order to maintain separation of concerns.
- The `Notification` model will need a relationship to `User`, and we need background logic to trigger notifications (e.g., when an `Application` is created, trigger a "Please take the test" notification).

## 4. Conclusion
The implementation strategy for M2 should be:
1. **Database Migrations**: Add `certificates` to `CandidateProfile`, `kkm_score` to `Job`, and create a `Notification` table.
2. **Backend API**: Add `routers/candidates.py` (for file uploads and registration), `routers/notifications.py`, and update schemas. Update `application_service.py` to inject `rank` and `passed_kkm` into the response.
3. **Frontend Candidate UI**: Build file upload logic in `profile/page.tsx`. Add rank/KKM badges to `dashboard/page.tsx`. Wire up the notification bell in `layout.tsx`.
4. **Frontend Recruiter UI**: Add KKM score input to `jobs/new/page.tsx` and `jobs/[id]/page.tsx`.

## 5. Verification Method
- **Backend Tests**: Verify schema updates by running `pytest` (if available) or by manually creating a job with `kkm_score` via Swagger UI. Verify that `GET /applications` returns `rank` and `passed_kkm`.
- **Frontend Tests**: Inspect `profile/page.tsx` for file inputs. Check the candidate dashboard for rank/status UI. Check the recruiter wizard for KKM inputs. Run `npm run build` and `npm run test` in `frontend/`.
