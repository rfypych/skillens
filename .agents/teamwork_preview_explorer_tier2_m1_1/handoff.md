# Handoff Report: Candidate Registration Boundary Cases (Tier 2, M1)

## Observation
1. **Real Architecture vs. Tier 1 Mocks**: The actual candidate registration/application flow is located at `frontend/src/app/candidate/apply/[job_id]/page.tsx` and submits a `multipart/form-data` request to `/api/assessment/{job_id}/apply` (`backend/routers/assessment.py`). The previous Tier 1 tests (`tier1/candidate-registration.spec.ts`) used a `dummy-server.js` and `page.route` to mock everything, which violates the black-box constraint for Tier 2.
2. **Backend Constraints**: In `backend/services/assessment_service.py` (`apply_for_job`), several explicit boundaries are enforced:
   - File extension must be `.pdf` and content type `application/pdf` (`400 "Only PDF resumes are supported"`).
   - File size must be <= 5MB (`400 "File too large. Maximum size is 5MB."`).
   - For guest applicants, `name` and `email` are required (`400 "Name and email are required for guest applications"`).
   - Job deadlines are enforced: if `job.deadline` is passed, it rejects (`400 "Job posting expired"`).
3. **Frontend UI**: The frontend enforces file selection (`if (!file) throw new Error("Please upload a valid PDF resume to continue.")`).

## Logic Chain
1. To meet the opaque-box testing constraint, the E2E tests must hit the real Next.js application at `http://localhost:3000` and interact with the real `candidate/apply/[job_id]` form.
2. Because the application route requires a valid `job_id`, the test suite must seed a test job before running the UI tests. This can be done in a `test.beforeAll` hook using Playwright's `request` context to create a recruiter and a job via `POST /api/auth/signup` and `POST /api/jobs`. We should also seed an expired job to test the deadline boundary.
3. Based on the constraints, we can design the following 5 boundary test cases:
   - **Test 1: Happy Path Boundary** - Upload a valid PDF that is exactly/under the 5MB limit. Verify successful application routing to `/candidate/instructions/[id]`.
   - **Test 2: Max Size Boundary** - Generate and upload a PDF buffer slightly over 5MB (e.g., `5 * 1024 * 1024 + 1`). Verify the backend/UI rejects it with "Maximum size is 5MB".
   - **Test 3: Invalid Format Boundary** - Upload a file with a `.docx` or `.exe` extension/mime-type. Verify the UI/backend rejects it with "Only PDF resumes are supported".
   - **Test 4: Missing Required Fields** - Attempt to submit the application form as a guest without filling in the `name` or `email` fields. Verify HTML5 validation or backend rejection.
   - **Test 5: Expired Job Boundary** - Navigate to the apply page of the seeded expired job, fill valid data, and submit. Verify backend rejects with "Job posting expired".

## Caveats
- The tests assume that both the frontend (Next.js, port 3000) and backend (FastAPI, port 8000) are running when `npx playwright test` is executed.
- Large files for testing should be generated dynamically in memory (e.g., `Buffer.alloc(5242881, 'a')`) rather than storing a 5MB dummy file in the repository.

## Conclusion
The Tier 2 test `e2e/tests/tier2/candidate-registration-boundary.spec.ts` must bypass the `dummy-server.js` approach. Instead, it should use Playwright's `APIRequestContext` to dynamically seed a job, then use `page.goto('/candidate/apply/[job_id]')` to test the 5 real application boundaries (File Size > 5MB, Non-PDF format, Missing fields, Expired deadline, Valid application).

## Verification Method
1. Implement the test file `e2e/tests/tier2/candidate-registration-boundary.spec.ts` using the proposed strategies.
2. Start the backend (`uvicorn main:app --port 8000`) and frontend (`npm run dev`).
3. Execute the test: `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
4. Ensure all 5 tests pass and no `page.route` mock functions are used.
