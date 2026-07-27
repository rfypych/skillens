# Tier 3 E2E Tests Handoff

## Observation
1. **Existing Test Patterns**: Existing Playwright tests (e.g., `e2e/tests/tier1/candidate-registration.spec.ts`) are structured using standard Playwright locators (`getByRole`, `locator`, `getByLabel`). There are no shared utility files (no `utils/` directory in `e2e/`), so shared steps (login, registration) are currently duplicated or contained within the test files.
2. **Project Architecture/Routes**: The Next.js frontend handles major flows across two primary roles:
   - **Candidate Flow**: Routes include `/signup` (Candidate role), `/candidate/dashboard`, `/candidate/apply/[job_id]`, and `/candidate/test/[app_id]`.
   - **Recruiter Flow**: Routes include `/signup` (Recruiter role toggle), `/recruiter/jobs/new`, `/recruiter/candidates`, and `/recruiter/settings/team`.
3. **Playwright Config**: The `e2e/playwright.config.ts` uses `baseURL: 'http://localhost:3000'` and `fullyParallel: true`. Tests must avoid state collision (e.g., using `Date.now()` for unique emails).

## Logic Chain
To satisfy the requirement of pairwise cross-feature interactions using real page interactions without mocking, we combine the following core features into ~10 specific scenarios:
1. **Multi-tier Accounts + Job Management**: Main recruiter (Admin) creates a sub-account via `/recruiter/settings/team`. Sub-account logs in and successfully creates a new Job via `/recruiter/jobs/new`.
2. **Job Management + Candidate Flow (Expired Job)**: Recruiter creates a job with a deadline in the past. Candidate attempts to apply. UI should prevent application or display expired state.
3. **Multi-tier Accounts + Candidate Flow (Visibility)**: Admin creates a job. Candidate applies. Sub-account logs in and verifies they can see the candidate's application in `/recruiter/candidates`.
4. **KKM Tracking + Interview Scheduling (Pass)**: Candidate completes the test and scores above KKM. Recruiter views the application and verifies the "Schedule Interview" button is available.
5. **KKM Tracking + Interview Scheduling (Fail)**: Candidate completes the test and scores below KKM. Recruiter views the application and verifies the "Schedule Interview" button is hidden/disabled.
6. **Interview Scheduling + Candidate Flow (Acceptance)**: Recruiter proposes an interview schedule (>= 1 day). Candidate logs into their dashboard, sees the invite, and accepts it.
7. **Interview Scheduling + Constraints (Distance Enforcement)**: Recruiter attempts to schedule an interview for the current date (< 1 day distance). The system rejects it and shows an error in the UI.
8. **AI Questions + Final Scoring**: After an interview is accepted, the recruiter accesses the interview scoring UI. The test verifies AI follow-up questions are displayed based on the test, inputs a score, and confirms the final rank updates.
9. **Multi-Job + Candidate Dashboard**: Candidate applies to two different jobs. Takes the test for Job A. The dashboard correctly splits the application states (Job A: test completed; Job B: pending test).
10. **Multi-tier Accounts + Constraints (Permissions)**: Sub-account attempts to access `/recruiter/settings/team` to create another sub-account. UI blocks access or redirects, proving RBAC.

## Caveats
- Because there is no existing UI helper module, the Worker will need to build inline helper functions within `cross-feature.spec.ts` (e.g., `async function registerRecruiter(page)`, `async function createJob(page, ...)`).
- The test for AI Questions (Scenario 8) assumes that completing the test populates enough mock transcript data in the backend to display AI recommendations in the UI. Ensure the test submission simulates a real answer if required by the UI form.

## Conclusion
The implementer should create `e2e/tests/tier3/cross-feature.spec.ts`.
It must contain the ~10 pairwise test cases outlined in the Logic Chain.
- Do **not** mock the backend or UI; use actual page clicks and form submissions.
- Create helper functions within the file to execute repetitive steps like registration, logging in, and creating jobs to keep the code DRY.
- Use dynamic data (e.g., `Date.now()`) to ensure tests run reliably in parallel without conflicting state.

## Verification Method
Run `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` from the `e2e/` directory. All ~10 tests should pass, confirming that the real backend and frontend interact correctly across feature boundaries.
