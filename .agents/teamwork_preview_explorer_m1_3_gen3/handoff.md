# Handoff Report: E2E Testing Milestone 1 Strategy

## Observation
- The previous implementation in `d:/projects/JHIC-rev/e2e/tests/tier1/candidate-registration.spec.ts` used `page.route` to mock backend API responses (`/api/registration`, `/api/notifications`, `/dashboard`), which violates the critical integrity constraint.
- The project requirement (ORIGINAL_REQUEST.md & SCOPE_TIER1.md) is to test Candidate Registration & Files using real backend endpoints and frontend interfaces without mocking API calls (`page.route`).
- The application is expected to be served on `http://localhost:3000` (Frontend) and `http://localhost:8000` (Backend).

## Logic Chain
1. To comply with the integrity constraint, we must remove all instances of `page.route` used for network mocking.
2. The tests must interact with the application just as a real user would. Data uniqueness (e.g. emails) must be handled using dynamic values (like timestamps) to prevent constraint errors in the backend database.
3. Network assertions should utilize `page.waitForResponse` to observe actual backend traffic rather than stubbing it.
4. Using equivalence partitioning and boundary value analysis, we can derive at least 5 test cases focusing on valid inputs, invalid inputs, multiple files, and post-registration flow.

## Caveats
- Since the tests now expect real backend responses, the test environment must be fully booted (frontend at 3000, backend at 8000) prior to execution.
- If the application is not built yet, these tests will fail (which is intended per the instructions: "Write tests that assume the endpoints and UI elements described in the specs exist and actually use them").
- Database state will accumulate test data since we are using dynamic emails. A teardown or reset mechanism (e.g., wiping `test_m1.db`) might be needed in the global test setup.

## Conclusion
A new testing strategy is required for `candidate-registration.spec.ts`. I have proposed a replacement implementation that executes tests without network mocking.

**Proposed Test Cases:**
1. **Happy Path:** Complete registration with valid personal data and valid PDF uploads (CV and Certificate), expecting a 201 response.
2. **Missing Required Fields (BVA):** Submit without filling mandatory fields. Expect UI validation errors (`Email is required`, `CV is required`) and blocked submission.
3. **Invalid File Types (Equivalence Partitioning):** Upload disallowed formats (e.g., `.exe`), expecting an `Invalid file type` error and blocked submission.
4. **Multiple Certificates (Category Partitioning):** Upload multiple valid certificates at once, testing the system's array-handling capability for files.
5. **Real-time Tracking & Dashboard:** Post-registration redirect to `/dashboard`, expecting to see a real "Take the test" notification rendered from the backend data.

The proposed rewrite of the file is available at:
`d:\projects\JHIC-rev\.agents\teamwork_preview_explorer_m1_3_gen3\proposed_candidate-registration.spec.ts`.

## Verification Method
1. Replace the original file with the proposed code.
2. Ensure the test environment is running (`npm start`, etc.).
3. Run the tests: `cd d:\projects\JHIC-rev\e2e && npx playwright test tests/tier1/candidate-registration.spec.ts`
4. The test execution must NOT report any usage of `page.route`. Test failures due to missing backend/frontend implementation are acceptable at this stage.
