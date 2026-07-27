## Review Summary

**Verdict**: REQUEST_CHANGES

## Findings

### Critical Finding 1: INTEGRITY VIOLATION - Facade Implementation of Deadline
- **What**: The core feature of Job deadlines is a facade. The `deadline` is accepted in the API request payload (`JobCreate` schema) and frontend UI, but is silently discarded when saving the record to the database.
- **Where**: `backend/services/job_service.py` -> `create_job` (lines 13-26). The `models.Job` constructor is missing the `deadline` parameter.
- **Why**: This is a dummy implementation that looks correct on the surface (schema and UI are updated) but implements no real logic in the core creation flow. The API returns `deadline: null` for all newly created jobs.
- **Suggestion**: Update `create_job` to pass `deadline=job.deadline` into the `models.Job` constructor.

### Critical Finding 2: Cross-Company Information Leak (Security)
- **What**: The `get_application` function bypasses authorization checks entirely for the `admin` role, allowing any Admin to fetch ANY application across ANY company in the system if they know the application ID.
- **Where**: `backend/services/application_service.py` -> `get_application` (lines 53-61).
- **Why**: The function has `if current_user.role == "candidate"` and `if current_user.role == "recruiter"`, but no checks for `admin`. 
- **Suggestion**: Add a check for `admin` role to ensure they can only view applications belonging to jobs owned by members of their `company_id`.

### Major Finding 3: Incomplete Multi-Tier Permissions
- **What**: Admins cannot manage (update or delete) jobs or applications created by their sub-accounts. Attempting to do so results in a 404 Not Found or 403 Forbidden.
- **Where**: 
  - `backend/services/job_service.py` -> `update_job` & `delete_job`
  - `backend/services/application_service.py` -> `update_application` & `delete_application`
- **Why**: The queries explicitly filter for `models.Job.owner_id == current_user.id`. For multi-tier functionality, Admins must be able to manage resources owned by members of their company.
- **Suggestion**: In these update/delete routes, if the user is an admin, check against the user's `company_id` rather than strictly checking `owner_id == current_user.id`.

### Major Finding 4: Incomplete Sub-Account Management
- **What**: The UI and API only allow creating and listing sub-accounts. There is no functionality to update, deactivate, or delete a sub-account.
- **Where**: `backend/routers/auth.py`, `frontend/src/app/recruiter/settings/team/page.tsx`.
- **Why**: SCOPE.md requires the Admin to "manage access for sub-accounts", which requires full lifecycle management, not just creation.
- **Suggestion**: Implement update/delete endpoints in `/auth/sub-accounts` and corresponding UI actions in the Team Settings page.

## Verified Claims

- **Frontend Build**: Verified that Next.js UI compiles, but the UI is missing edit/delete functionality for sub-accounts.
- **Backend Migrations**: Verified that `parent_account_id` and `deadline` exist in the database schema.

## Coverage Gaps
- **Job Status Enforcement**: When a job expires, its status should ideally be updated to `closed` automatically, or the frontend should handle "expired" gracefully. Currently, it relies on frontend conditional rendering and an API block in `apply_for_job`. We need to ensure active applications on an expired job are not inadvertently broken.

## Verification Method
- **Backend Tests**: Run `python test_m1_1.py` inside `backend/`. This script explicitly tests creating a job with a deadline, and it currently fails because the deadline is `None` in the response.
- **Challenger Tests**: Run `python challenger_test.py` inside `backend/`. It verifies multi-tier access and fails, outputting `VULNERABILITY: Admin cannot update sub-account's job!`.

## Conclusion
The implementation is incomplete and contains a critical integrity violation (facade feature). Changes must be requested to address the dropped `deadline` parameter, incomplete multi-tier permissions, cross-company data leakage, and incomplete team management UI.
