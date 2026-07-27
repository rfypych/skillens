# Handoff Report

## 1. Observation
- **Bug 1 (Interface Contract Violation):** 
  - `routers/auth.py` contains endpoints `@router.post("/sub-accounts")` and `@router.get("/sub-accounts")` which correspond to `/auth/sub-accounts`.
  - `routers/jobs.py` uses `prefix="/jobs"`.
- **Bug 2 (Broken Access Control - Mutations):**
  - In `services/job_service.py` (lines 72, 87), `update_job` and `delete_job` strictly filter by `models.Job.owner_id == current_user.id`. Admins cannot access jobs owned by their sub-accounts.
  - In `services/assessment_service.py` (lines 114, 125), `get_job_assessment` and `update_job_assessment` have the exact same strict `owner_id == current_user.id` check.
- **Bug 3 (IDOR):**
  - In `services/application_service.py` (`get_application`, `update_application`, `delete_application`), the logic checks `if current_user.role == "recruiter":` to enforce job ownership but entirely skips any `company_id` validation if `current_user.role == "admin"`.
  - In `services/assessment_service.py` (`get_assessment_prompt`, `submit_assessment`, `chat_assessment`), the check `app.user_id != current_user.id and current_user.role not in ["recruiter", "admin"]` grants admins bypass without validating `company_id`.
- **Bug 4 (Timezone Bug):**
  - In `services/assessment_service.py` (lines 33), `datetime.now(timezone.utc) > job.deadline` throws a TypeError because SQLite stores `job.deadline` as a naive datetime object.
- **Bug 5 (Admin Signup Bug):**
  - In `services/auth_service.py` (lines 13-21), `company_id` is only assigned via: `if user.role == "recruiter" and user.company_name:`. An `"admin"` user is left with `company_id = None`.

## 2. Logic Chain
1. **Interface Fixes:** Moving the `/sub-accounts` routes to a new `users.py` router with `prefix="/api/users"` and changing the jobs router prefix to `/api/jobs` will satisfy the missing API prefix and correct endpoint paths.
2. **Access Control (Mutations) Fixes:** Updating the `update_job`, `delete_job`, `get_job_assessment`, and `update_job_assessment` queries to use the same logic as `get_my_jobs` (allowing admins to query jobs where `owner_id` is in a subquery of users with their `company_id`) will restore admin capabilities.
3. **IDOR Fixes:** Adding specific ownership branches for the `"admin"` role in `application_service.py` and `assessment_service.py` ensures that if a user is an admin, they can only interact with applications whose associated job belongs to a user sharing the admin's `company_id`.
4. **Timezone Bug Fix:** We can patch the timezone bug by assigning a UTC timezone to the offset-naive `job.deadline` before comparison: `job.deadline.replace(tzinfo=timezone.utc)`.
5. **Admin Signup Fix:** Expanding the `company_id` assignment condition in `auth_service.py` to `if user.role in ["recruiter", "admin"] and user.company_name:` ensures admins receive their `company_id` correctly at signup.

## 3. Caveats
- Changing `routers/jobs.py` to `prefix="/api/jobs"` might require updating `main.py` if the integration tests expect the endpoints in a specific place. It is safer to apply `prefix="/api/jobs"` directly in `routers/jobs.py`.
- The new `routers/users.py` must be explicitly added to `main.py` using `app.include_router(users.router)`.
- It is assumed `models.User` correctly defines `company_id` and can be joined to verify IDOR protections.

## 4. Conclusion
We must implement a comprehensive suite of fixes spanning `main.py`, `routers/auth.py`, `routers/jobs.py`, a new `routers/users.py`, `services/job_service.py`, `services/assessment_service.py`, `services/application_service.py`, and `services/auth_service.py`. The strategy encompasses endpoint re-structuring, permission logic corrections for both mutations and IDOR, timezone conversion, and signup flow completion.

## 5. Verification Method
- **Bug 1:** Run `pytest backend/test_m1_1.py` or inspect FastAPI Swagger docs (`/docs`) to ensure the endpoints are under `/api/users/sub-accounts` and `/api/jobs`.
- **Bug 2 & 3:** Run `pytest backend/test_admin.py` or similar to verify admins can now edit sub-account jobs and that Cross-Company access yields `403 Forbidden`.
- **Bug 4:** Submit an application to a job with a deadline via API/tests and confirm it does not throw a `500 TypeError`.
- **Bug 5:** Send a POST to `/auth/signup` with role `admin` and `company_name` and verify the DB saves the generated user with a non-null `company_id`.
