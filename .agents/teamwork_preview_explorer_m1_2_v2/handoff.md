# Handoff Report: Milestone 1 Test Strategy

## 1. Observation
- `SCOPE_TIER1.md` mandates that Playwright tests must reside in `d:/projects/JHIC-rev/e2e`. The E2E tests must be opaque-box, focus on happy-path feature coverage, and include >=5 test cases per feature. 
- E2E tests must NOT mock the backend API or frontend HTML. They must make real requests to the frontend (`http://localhost:3000`) and backend (`http://localhost:8000`).
- The existing file `d:/projects/JHIC-rev/e2e/tests/tier1/candidate-registration.spec.ts` relies heavily on `page.route()` to mock backend endpoints (`/api/registration`, `/api/notifications`) and frontend pages (`/dashboard`).
- A `dummy-server.js` exists in the `e2e` directory which serves hardcoded HTML for testing purposes rather than utilizing the real Next.js/React frontend application.

## 2. Logic Chain
- The current testing setup directly violates the non-mocking constraint defined for Tier 1 tests.
- To fulfill the requirements, the mock routes and `dummy-server.js` must be removed and ignored. The tests must interact with real instances of the frontend and backend running on their respective ports.
- For genuine opaque-box tests, any data created by tests (like Candidate profiles and uploaded files) needs to be physically processed by the backend and persisted.
- Therefore, a revised test strategy is required to address real interactions. This means we must carefully manage test data (e.g., using unique emails for each test run to avoid unique constraint violations on the DB) and verify actual network/UI outcomes.

## 3. Caveats
- **Test Data Management:** Testing against real backends requires dynamically generating unique data (e.g., appending a timestamp to emails) to prevent duplicate key database errors between test runs.
- **Backend Availability:** Tests will fail if the backend at `http://localhost:8000` or the frontend at `http://localhost:3000` are not running before Playwright executes. The webServer config in Playwright needs to be properly set if tests are to start the servers automatically.
- **Cleanup:** Uploaded files (CVs/Certificates) may accumulate in local storage or cloud buckets unless a cleanup strategy or test-specific bucket is used.

## 4. Conclusion
**Proposed Test Strategy:**
Rewrite `candidate-registration.spec.ts` to remove all `page.route` mock handlers. Ensure Playwright executes against `localhost:3000` and interacts with a live backend at `localhost:8000`. Ensure all UI interactions trigger real network calls, and assert against real DOM updates reflecting true backend state.

**Test Case Outlines (Candidate Registration):**

1. **Test 1: Happy Path - Complete Registration**
   - **Action:** Navigate to `/register`. Fill in valid details (Name, unique Email, Password). Upload valid `.pdf` files for CV and Certificate. Click "Submit".
   - **Expected:** Verify a real `201 Created` HTTP response from the backend. Verify the UI redirects to a success/dashboard page indicating successful registration.

2. **Test 2: Validation - Missing Required Fields**
   - **Action:** Navigate to `/register`. Leave mandatory fields blank. Click "Submit".
   - **Expected:** Assert that the form submission is blocked client-side. Ensure no network request is sent to the backend API. Assert that appropriate "required field" error messages are visible in the DOM.

3. **Test 3: Validation - Invalid File Types**
   - **Action:** Navigate to `/register`. Fill in valid personal details. Upload a disallowed file type (e.g., `.exe` or `.sh`) for the CV input.
   - **Expected:** Assert that the UI displays an "invalid file type" validation error. Verify the submission is blocked (or if sent, the backend rejects it with `400 Bad Request`).

4. **Test 4: Functionality - Multiple Certificates Upload**
   - **Action:** Navigate to `/register`. Fill in valid details (unique Email). Upload one CV and *multiple* valid PDF certificates. Click "Submit".
   - **Expected:** Verify successful submission with a real `201 Created` backend response. Verify the frontend routes to the next step without error.

5. **Test 5: Edge Case - Duplicate Email Registration**
   - **Action:** Register a candidate successfully. Navigate back to `/register` and attempt to register *again* using the exact same Email address.
   - **Expected:** Verify the backend responds with `409 Conflict` (or similar validation error). Assert the UI displays an error indicating "Email is already in use".

## 5. Verification Method
- Start the application's real frontend and backend services on ports `3000` and `8000`.
- The implementer will write the above tests in `d:/projects/JHIC-rev/e2e/tests/tier1/candidate-registration.spec.ts`.
- Run the command `npx playwright test candidate-registration.spec.ts`.
- Verify the Playwright HTML report shows real network calls being made (no mocked routes) and tests passing against the actual application logic.
