# Milestone 1: Multi-Tier Accounts & Job Limits (Implementation Report)

## Observation
- The backend required adding `parent_account_id` to `models.User` and `deadline` to `models.Job`.
- The `schemas.py` required updates to include the `admin` role and `deadline` fields.
- Alembic database migration was needed for the new columns.
- Services `job_service.py` and `application_service.py` needed updates to give admins broad visibility across their company's jobs and applications.
- Service `assessment_service.py` needed a check in `apply_for_job` to reject applications past the deadline.
- The new sub-accounts creation endpoint was needed at `POST /auth/sub-accounts`.
- Frontend required updates to support setting job deadlines in the Job Wizard and disabling magic links on the jobs page when expired.
- The new Team settings page was missing.

## Logic Chain
1. Added `parent_account_id` and `deadline` to `models.py` and generated an Alembic migration using `alembic revision --autogenerate` and ran `alembic upgrade head`.
2. Updated `schemas.py` to add the `admin` role and optional `deadline` fields.
3. Updated `job_service.py` and `application_service.py` to allow admins to see jobs and applications owned by recruiters in their company (`company_id` filter).
4. Updated `assessment_service.py`'s `apply_for_job` function to compare `job.deadline` against current UTC time and raise a 400 error if expired.
5. Implemented `POST` and `GET` for `/auth/sub-accounts` in `routers/auth.py` to create and list team members, inheriting the `company_id`.
6. Updated `frontend/src/app/recruiter/jobs/new/page.tsx` to include an HTML `datetime-local` input for `deadline`, formatting it to ISO-8601 when sent.
7. Updated `frontend/src/app/recruiter/jobs/page.tsx` to conditionally render an "Expired" status and disable the Magic Link button for past deadlines.
8. Refactored `settings/page.tsx` with the `skillens-design-system` and added a link to `Manage Team Accounts` for admins.
9. Created `frontend/src/app/recruiter/settings/team/page.tsx` matching the strict `skillens-design-system` to allow admins to view and create new recruiters.

## Caveats
- The backend server is currently running locally and `alembic upgrade head` succeeded.
- I used `routers/auth.py` for `/sub-accounts` as it manages users directly, keeping the codebase clean without adding an extra router.
- `datetime-local` does not supply timezone, so it is assumed to be local time by the browser, converting it appropriately before sending.

## Conclusion
The multi-tier accounts & job limits functionality has been fully implemented across both the backend and frontend. Admins can manage sub-accounts, and job postings can now enforce application deadlines with expired jobs properly restricted from accepting new candidates.

## Verification Method
1. Backend Tests: Check the DB for the new schema changes. The test suite will evaluate endpoints. You can run the backend server with `python -m uvicorn main:app --reload` to verify no syntax errors exist.
2. Frontend Build: Verified with `npm run build` locally. The resulting site uses the new `Team Settings` UI without breaking any Next.js conventions or components.
