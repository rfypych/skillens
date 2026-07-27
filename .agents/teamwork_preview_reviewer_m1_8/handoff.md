# Milestone 1: Multi-Tier Accounts & Job Limits (Review Report)

## Observation
- The worker implemented sub-account creation at `POST /auth/sub-accounts` instead of the required `POST /api/users/sub-accounts`.
- In `services/job_service.py`, `update_job` and `delete_job` query filters restrict operations to `models.Job.owner_id == current_user.id`.
- In `services/application_service.py`, `get_application` only validates `job.owner_id != current_user.id` if the role is `"recruiter"`. For `"admin"`, it completely bypasses the ownership check.
- In `services/application_service.py`, `update_application` restricts modifications to `job.owner_id == current_user.id` even for `"admin"`.
- In `services/assessment_service.py`, `get_job_assessment` restricts access to `models.Job.owner_id == current_user.id`, while `get_assessment_prompt` bypasses authorization entirely if the role is `"admin"`.

## Logic Chain
1. The implementation of `POST /auth/sub-accounts` violates the explicit interface contract in `SCOPE.md` which requires `POST /api/users/sub-accounts`.
2. The "parent-child (admin/recruiter) permissions" logic is functionally broken for mutation actions: while an admin can *list* jobs and applications within their company, any attempt by an admin to edit or delete a job or application owned by a recruiter (sub-account) will fail with a 403 or 404 because the queries enforce `owner_id == current_user.id`.
3. The authorization checks introduce critical security vulnerabilities (IDOR). Because `get_application` and `get_assessment_prompt` bypass ownership checks when the user is an `admin` (omitting any `company_id` verification), an admin from Company A can view applications and assessments belonging to Company B simply by guessing the ID.

## Caveats
- The frontend uses the `api` utility which defaults to `/api`, resulting in requests to `/api/auth/sub-accounts` -> `/auth/sub-accounts`. The backend router was configured with `prefix="/auth"`.
- The `deadline` feature appears functionally present and checks properly against UTC time in `assessment_service.py`.

## Conclusion
The implementation FAILS the review. The work product contains severe authorization flaws, critical security vulnerabilities (IDOR), and directly violates the interface contract for sub-accounts.

## Verification Method
1. Verify Interface Contract: Inspect `routers/auth.py` and `main.py` to confirm the route is `POST /auth/sub-accounts` instead of `POST /api/users/sub-accounts`.
2. Verify IDOR/Auth bypass: Review `get_application` in `services/application_service.py` to observe that if `current_user.role == "admin"`, it skips the check `job.owner_id != current_user.id`, exposing all applications globally.
3. Verify broken parent-child mutations: Inspect `update_job` in `services/job_service.py` and `update_application` in `services/application_service.py` to see that `job.owner_id == current_user.id` is strictly enforced, preventing admins from managing sub-account resources.
