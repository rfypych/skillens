# Handoff Report: Milestone 1 Iteration 2 Fix Strategy

## 1. Observation
1. **Interface Contract Violation**: 
   - `backend/routers/auth.py` contains the `POST /sub-accounts` and `GET /sub-accounts` endpoints, making them `/auth/sub-accounts`. 
   - `backend/main.py` includes routers without the `/api` prefix (e.g., `app.include_router(jobs.router)` where `jobs.py` defines `prefix="/jobs"`).
2. **Broken Access Control (Mutations)**:
   - In `backend/services/job_service.py` (`update_job` and `delete_job`, lines 72 & 87), the query uses `filter(models.Job.id == job_id, models.Job.owner_id == current_user.id)`. This blocks admins from managing jobs created by their sub-accounts.
3. **Critical Security Vulnerability (IDOR)**:
   - In `backend/services/application_service.py` (`get_application`, line 56), ownership check exists for recruiters, but for admins it is completely skipped. `update_application` and `delete_application` only check `job.owner_id == current_user.id`, blocking admins.
   - In `backend/services/assessment_service.py` (`get_assessment_prompt`, `submit_assessment`, `chat_assessment`), the code only checks `if app.user_id != current_user.id and current_user.role not in ["recruiter", "admin"]`. It fails to verify if the job belongs to the admin/recruiter.
4. **Timezone Bug**:
   - In `backend/services/assessment_service.py` (`apply_for_job`, line 33), `datetime.now(timezone.utc)` (offset-aware) is compared against `job.deadline` (offset-naive from SQLite), causing a TypeError.
5. **Admin Signup Bug**:
   - In `backend/services/auth_service.py` (`signup_user`, line 13), the condition `if user.role == "recruiter" and user.company_name:` provisions a company. It ignores "admin" signups, leaving their `company_id` as None.

## 2. Logic Chain
- **Contract Violation**: Because `main.py` doesn't enforce the `/api` global prefix and sub-account routes live in `auth.py`, frontend requests to `/api/users/sub-accounts` and `/api/jobs` 404.
- **Broken Access Control**: The strict SQL filter `owner_id == current_user.id` on mutations bypasses the hierarchical nature of admins.
- **IDOR**: Bypassing ownership checks for users with `admin` or `recruiter` roles without asserting their `company_id` allows horizontal access across tenants.
- **Timezone Bug**: Python strictly prevents comparison between naive and aware datetimes, failing the job expiration logic.
- **Admin Signup Bug**: Admins require a `company_id` to function as group owners. The missing condition causes them to be orphaned in the DB.

## 3. Caveats
- No caveats. The issues were directly located in the respective service and router files.

## 4. Conclusion (Fix Strategy)
1. **Interface Fixes**:
   - Extract `sub-accounts` routes from `auth.py` into a new `backend/routers/users.py` router with `prefix="/users"`.
   - In `backend/main.py`, include all routers (except possibly auth if it shouldn't have it, but standard practice is all API routes) with `prefix="/api"`, e.g., `app.include_router(jobs.router, prefix="/api")`.
2. **Access Control Fix**:
   - In `job_service.py`, modify `update_job` and `delete_job` to fetch the job first. Authorize if `job.owner_id == current_user.id` OR `(current_user.role == "admin" and job_owner.company_id == current_user.company_id)`.
3. **IDOR Fix**:
   - Apply the exact same authorization logic in `application_service.py` (`get_application`, `update_application`, `delete_application`) and `assessment_service.py` (`get_assessment_prompt`, `submit_assessment`, `chat_assessment`). Ensure recruiters can only access their own jobs, and admins can access jobs within their company.
4. **Timezone Fix**:
   - In `assessment_service.py`, change `datetime.now(timezone.utc)` to `datetime.utcnow()` or `datetime.now(timezone.utc).replace(tzinfo=None)`.
5. **Admin Signup Fix**:
   - In `auth_service.py`, update line 13 to `if user.role in ["recruiter", "admin"] and user.company_name:`.

## 5. Verification Method
- **Routing**: Test `curl http://localhost:8000/api/users/sub-accounts` and `/api/jobs`.
- **RBAC & IDOR**: Write pytest test cases to log in as Company A admin and attempt to read/update an application or job from Company B (expect 403). Log in as Company A admin and update Company A recruiter's job (expect 200).
- **Timezone**: Run an application submission via API to a job with a deadline.
- **Signup**: Register a new admin and query SQLite to verify `company_id IS NOT NULL`.
