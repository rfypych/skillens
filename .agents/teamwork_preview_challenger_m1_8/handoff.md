# Milestone 1: Multi-Tier Accounts & Job Limits (Challenge Report)

## Observation
- The `SCOPE.md` strictly defines the interface contracts:
  - Sub-account creation: `POST /api/users/sub-accounts`
  - Job deadlines: `POST /api/jobs` and `PUT /api/jobs/{id}`
- The worker implemented the endpoints at `/auth/sub-accounts` and `/jobs/` respectively, missing the `/api/` prefix entirely, and placing the sub-accounts under `/auth` instead of `/api/users/`.
- Functionally, the `POST /auth/sub-accounts` logic correctly enforces the admin role check and creates the sub-account with `parent_account_id`.
- The `POST /jobs/` endpoint accepts the `deadline` parameter and stores it correctly.
- A functional stress test using a python script was written to interact with the backend API.
- The `apply_for_job` function (`POST /assessment/{job_id}/apply`) correctly rejects applicants when the job's `deadline` has passed, raising a 400 Bad Request error.
- The frontend correctly disables the "Copy Magic Link" button and visually marks expired jobs.

## Logic Chain
1. Read the interface contracts in `SCOPE.md`.
2. Examined the backend routes in `routers/auth.py` and `routers/jobs.py` and saw they were mounted without the `/api` prefix and the sub-accounts endpoint was named `/auth/sub-accounts`.
3. Created `test_empirical.py` to test the API directly via HTTP requests. 
4. The test verified that `POST /api/users/sub-accounts` returned 404.
5. The test proceeded to use the non-compliant endpoints to verify business logic, which passed: sub-account cannot create another sub-account, and expired jobs reject applications.
6. Since the specified interface contract was broken, this implementation fails.

## Caveats
- NextJS frontend (`api.ts`) defaults to `/api` and routes it to the backend via a reverse proxy (if one exists) or `NEXT_PUBLIC_API_URL` overrides it. However, the interface contract specifically dictated the backend endpoints should include these paths, or at the very least, `users/sub-accounts` rather than `auth/sub-accounts`.

## Conclusion
**FAIL**

While the core functionality (admin checks, deadline validation, frontend logic) works as requested, the worker violated the interface contracts outlined in `SCOPE.md`. The endpoint must be `POST /api/users/sub-accounts`, not `POST /auth/sub-accounts`.

## Verification Method
Run the generated empirical test script:
```bash
python d:/projects/JHIC-rev/.agents/teamwork_preview_challenger_m1_8/test_empirical.py
```
This script will fail at the contract verification step, printing:
`- Contract violation: POST /api/users/sub-accounts (or /users/sub-accounts) not found. Endpoint implemented at /auth/sub-accounts instead.`
