# Milestone 1: Multi-Tier Accounts & Job Limits Review

## Observation
1. In `backend/services/job_service.py` (`create_job`), the `models.Job` instantiation manually maps fields from `schemas.JobCreate`. The newly added `deadline` field, along with `kkm_score` and `max_questions`, are completely omitted from the constructor.
2. In `backend/services/job_service.py` (e.g., `update_job`, `delete_job`), `backend/services/application_service.py` (e.g., `get_application`, `update_application`), and `backend/services/assessment_service.py`, operations strictly enforce `job.owner_id == current_user.id` or `job.owner_id != current_user.id`.
3. In `backend/routers/auth.py` and `frontend/src/app/recruiter/settings/team/page.tsx`, functionality exists to list and create sub-accounts, but there are no endpoints or UI components to update, deactivate, or delete them.

## Logic Chain
1. Because `deadline`, `kkm_score`, and `max_questions` are omitted during Job creation, they are never saved to the database. Consequently, the deadline validation logic in `assessment_service.py` (`if job.deadline and ...`) will never trigger, rendering the job limits feature a facade implementation that looks correct but fails to implement real logic.
2. Because the detail, update, and delete endpoints check specifically against the `owner_id`, an Admin user will receive a 403 Forbidden or 404 Not Found when attempting to view or manage jobs and applications created by their sub-account recruiters. The multi-tier visibility is incomplete, applying only to list queries (`get_my_jobs`, `get_applications`).
3. Because the team settings page and API lack edit/delete functionality, the requirement to "manage access for sub-accounts" is not fully met (it only supports adding access).

## Caveats
- No tests were run due to `pytest` being unavailable in the global environment, but static code analysis confirms the missing data mapping and permission blocks.

## Conclusion
REQUEST_CHANGES. There is a Critical integrity violation (facade implementation) where the core `deadline` feature is silently dropped during creation. Furthermore, multi-tier permissions are incomplete, leaving Admins unable to manage sub-account jobs or manage sub-account access.

## Verification Method
1. Inspect `backend/services/job_service.py` lines 13-26 to confirm `deadline`, `max_questions`, and `kkm_score` are missing from the `models.Job` instantiation.
2. Inspect `backend/services/application_service.py` line 70 (`if job.owner_id != current_user.id:`) to confirm Admins are blocked from updating applications on sub-account jobs.
3. Review `frontend/src/app/recruiter/settings/team/page.tsx` to confirm the absence of edit/delete actions for sub-accounts.
