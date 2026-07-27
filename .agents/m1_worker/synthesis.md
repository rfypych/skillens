# M1 Explorer Synthesis

## Consensus
All Explorers agree that to implement real Opaque-Box E2E tests for Candidate Registration Boundary cases without mocking:
1. The target route to test is the actual Guest Application flow at `/candidate/apply/[job_id]`, which submits to `POST /api/assessment/{job_id}/apply`.
2. The tests must dynamically create a test Recruiter user and test Job via the backend API (`/api/auth/signup`, `/api/jobs`) in a `test.beforeAll` block to get a real `job_id` for navigation.
3. Tests should use `Buffer.alloc()` in memory for uploading files instead of creating physical dummy files on disk.

## Test Cases (≥5) to implement in `e2e/tests/tier2/candidate-registration-boundary.spec.ts`
1. **Happy Path / Exact Boundary Limit**: Upload a valid `.pdf` (mime: `application/pdf`) exactly `5 * 1024 * 1024` bytes (5MB). Verification: Application succeeds.
2. **Over Max Size**: Upload a `.pdf` exactly `5 * 1024 * 1024 + 1` bytes. Verification: Form fails and UI shows "File too large. Maximum size is 5MB." (from backend).
3. **Invalid File Extension/Mime**: Upload a file named `resume.exe` (or `.docx`). Verification: Form fails and UI shows "Only PDF resumes are supported" (from backend).
4. **Missing Required Fields**: Submit as guest without providing a name or email. Verification: Form submission is blocked or backend rejects it (verify HTML5 validation or backend message).
5. **Expired Job Deadline Boundary**: Navigate to a job that has an expired deadline (seed this job in `beforeAll`). Submit valid form. Verification: Backend rejects with "Job posting expired" and it's visible in UI.

## Instructions for Worker
Implement the test suite in `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
Do NOT mock the backend API or frontend HTML. Use `page.goto('/candidate/apply/[job_id]')`.
Run your tests (`npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts`) against the running local servers to verify they pass. You may need to start the backend and frontend yourself if they aren't running, but typically the test suite or previous dev tools should allow it.
Use `page.route` ONLY if you absolutely have no other way, but you are FORBIDDEN to use it to mock the main logic of the assessment apply route or the form loading route.
You must document your commands and passing test results in your handoff report.

MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
