# Handoff Report: Milestone 2 - Candidate Registration & KKM Tracking

## 1. Observation
- **Models (`backend/models.py`)**: `CandidateProfile` currently only has text fields (`bio`, `experience`) and a string `resume_url` (used for LinkedIn/Portfolio links). There is no structure for storing multiple documents (CV, certificates). `Job` lacks KKM (Kriteria Ketuntasan Minimal) configuration fields. `Application` lacks fields for `kkm_score` or rank.
- **Routers (`backend/routers/`)**: There is no dedicated candidate router (e.g., `candidates.py`) handling registration or document uploads. The endpoints specified in `SCOPE.md` (`/api/candidates/register`, `/api/candidates/upload`) are missing.
- **Frontend (`frontend/src/app/candidate/profile/page.tsx`)**: The UI only allows editing basic text and a single URL. There is no multi-document upload component.
- **Candidate Dashboard (`frontend/src/app/candidate/dashboard/`)**: Lacks real-time status, anonymous rank display, and in-app notifications.

## 2. Logic Chain
- **Multiple Documents**: To support CVs and certificates, we must introduce a `CandidateDocument` SQLAlchemy model linking to `User` or `CandidateProfile`, and implement a file upload mechanism (e.g., using FastAPI's `UploadFile` saving to an `uploads/` directory).
- **KKM Configuration**: `Job` needs new columns (e.g., `kkm_criteria` (Text) and `kkm_minimum_score` (Integer)). The Pydantic schemas (`JobCreate`, `JobUpdate`) must be updated so recruiters can set these when posting a job.
- **Auto-Ranking**: When a candidate applies, the system needs to evaluate their uploaded documents against the job's `kkm_criteria`. This should be an asynchronous Celery task (similar to `ai_evaluator.py` logic) that populates a new `kkm_score` column on `Application`.
- **Anonymous Rank**: To provide an anonymous rank, the backend should calculate a candidate's position by comparing their `kkm_score` against others in the same job, returning this derived `rank` in `ApplicationResponse`.
- **Frontend Updates**: The candidate UI needs a document upload section in the profile/registration flow. The dashboard requires polling or SWR to fetch real-time application status and rank. For notifications, a simple polling mechanism fetching from a new `/notifications` endpoint or toast alerts on status change is needed.

## 3. Caveats
- **File Storage**: The implementation will use local file storage (`backend/uploads/`) rather than cloud storage (S3/GCS) to keep it simple, assuming local deployment for now.
- **Real-time implementation**: True real-time might imply WebSockets, but short-polling the application status endpoint from the frontend is likely sufficient and less complex for the current architecture.
- **Text Extraction**: Ranking candidate documents requires extracting text from PDFs/images. A library like `PyPDF2` or `pdfplumber` will need to be added to `requirements.txt`.

## 4. Conclusion
**Recommended Implementation Strategy:**
1. **Backend Models & Schemas**: Create `CandidateDocument` model. Add `kkm_criteria` and `kkm_minimum_score` to `Job`. Add `kkm_score` to `Application`.
2. **Backend API**: Create `routers/candidates.py` with `/register`, `/upload` (handling multipart/form-data), and `/applications` (returning status and calculated rank).
3. **Background Task**: Implement `tasks.evaluate_kkm_score(application_id)` which extracts text from candidate docs and uses an LLM prompt to score it against the job's KKM, saving the result.
4. **Frontend UI**: Build a multi-file upload component in the Candidate profile/registration flow. Update the Candidate Dashboard to poll for application updates and display the anonymous rank (e.g., "Rank 3 of 15").

## 5. Verification Method
- **Backend Tests**: Run `pytest` (if available) or start the server and use `curl`/Swagger to upload a test PDF to `/api/candidates/upload`. Verify the `CandidateDocument` record is created.
- **Ranking Test**: Apply to a Job with KKM criteria, wait for the Celery worker to finish, and check the DB (or API response) to ensure `Application.kkm_score` is populated and `rank` is computed.
- **Frontend Test**: Log in as a candidate, upload docs, apply for a job, and verify the dashboard shows the correct real-time rank.
