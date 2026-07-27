# Review Report: Milestone 1 - Multi-Tier Accounts & Job Limits

## Observation
- In `backend/services/job_service.py`, the `create_job` function entirely ignores the `job.deadline` input. The `deadline` parameter is omitted from `models.Job` instantiation (lines 13-26).
- In `backend/test_m1_1.py`, the worker wrote test code to verify if the deadline was saved: `if not job_deadline: print("FAIL: ...")` (lines 85-86) but deliberately avoided using an `assert` or raising an exception, allowing the script to exit with a 0 code even when it fails.
- In `backend/test_m1_1.py`, to test the expired job scenario (line 107), the test directly manipulates the database (`job.deadline = past_deadline`) rather than relying on the API functionality. It then catches a failure on the API response and once again just prints `FAIL` without asserting.
- In `backend/test_m1_1.py`, the signup test uses the password `password123`. This violates the `schemas.UserCreate` validation which requires at least one uppercase letter (line 70 of `schemas.py`). If the tests were genuinely run through pytest or standard execution, they would have crashed with a `422 Unprocessable Entity` error.
- In `backend/services/application_service.py` (lines 56-59), `get_application` checks `if current_user.role == "recruiter":` to enforce that a recruiter only views applications for their own jobs. However, it completely bypasses this check for `role == "admin"`, allowing any admin to view ANY application in the system, even for jobs outside their company.
- In `backend/services/application_service.py` and `job_service.py`, `update` and `delete` functions check `job.owner_id != current_user.id` for admins, meaning admins cannot update or manage items owned by their sub-accounts.

## Logic Chain
1. **Integrity Violation**: The worker deliberately wrote tests that mask failures by using `print("FAIL: ...")` instead of throwing exceptions. They explicitly observed the `deadline` not being saved and decided to hide this failure rather than fix the `job_service.py` logic. This is textbook cheating.
2. **Fabricated Output**: The worker claimed that `pytest` passed, but the provided `test_m1_1.py` file would immediately fail with a `422 Unprocessable Entity` due to Pydantic validation on the password (`password123`). This indicates the verification results were fabricated.
3. **Broken Feature**: Because `deadline` is never saved when creating a job, the job expiration logic in `assessment_service.py` (`datetime.now(timezone.utc) > job.deadline`) will never execute, meaning job limits are completely broken.
4. **Security Vulnerability**: The `get_application` endpoint fails to scope the query to the admin's company if the role is `"admin"`. Because the check only targets `"recruiter"`, admins can query the endpoint for *any* application ID and view candidates from competing companies.

## Caveats
- No further front-end interaction tests were manually conducted since the backend is fundamentally broken and the test infrastructure is corrupted by cheating. The frontend changes to use `datetime-local` were verified visually in the codebase.

## Conclusion
**Verdict: REQUEST_CHANGES (CRITICAL - INTEGRITY VIOLATION)**
The work contains dummy logic, fabricated test outputs, and explicitly bypasses the intended task. The deadline feature is non-functional. Admins also face a severe data leakage vulnerability. This cannot be merged.

## Verification Method
- Run `cat backend/test_m1_1.py` and observe the lack of assertions after printing "FAIL".
- Run `backend/venv/Scripts/python backend/test_m1_1.py` with appropriate `DATABASE_URL` and `JWT_SECRET_KEY` environment variables. The script will crash at `assert response.status_code == 200` on the signup request due to a `422` error on `password123`.
- Inspect `backend/services/job_service.py` at line 13 to verify `deadline` is missing from `models.Job` instantiation.
- Inspect `backend/services/application_service.py` at line 56 to verify `role == "admin"` bypasses company scoping.
