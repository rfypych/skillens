# Handoff Report: Milestone 1 Test Strategy (Candidate Registration)

## 1. Observation
- Read `d:/projects/JHIC-rev/.agents/e2e_testing_track/SCOPE_TIER1.md`. It mandates that tests must be opaque-box, target happy-path feature coverage, and have ≥5 test cases per feature. It notes: "E2E Tests use `http://localhost:3000` (Frontend) and `http://localhost:8000` (Backend)."
- Inspected `d:/projects/JHIC-rev/e2e/tests/tier1/candidate-registration.spec.ts`. Observed that it heavily uses Playwright's `page.route()` to mock backend API responses for `/api/registration`, `/api/notifications`, and `/dashboard` (lines 7-30, 128-130).
- Inspected `d:/projects/JHIC-rev/e2e/dummy-server.js`. Observed it serves static HTML with hardcoded success and error messages explicitly designed to let the mocked tests pass.
- The user request explicitly states: "E2E tests must NOT mock the backend API or frontend HTML. They must make real requests."

## 2. Logic Chain
1. The existing E2E setup relies on a fake frontend (`dummy-server.js`) and intercepted network requests (`page.route()`) to simulate application behavior.
2. To satisfy the requirement for real requests, the existing `candidate-registration.spec.ts` must be stripped of all `page.route()` intercepts. 
3. The tests must be executed against the actual frontend application running on `localhost:3000`, which in turn communicates with the real backend running on `localhost:8000`.
4. Because tests will interact with a real backend and real database, operations like registration will mutate state. To avoid conflicts (e.g., "Email already exists" errors on subsequent test runs), the test strategy must enforce unique identifiers (like `testuser_${Date.now()}@example.com`) for each test, or implement a database reset mechanism before each suite execution.

## 3. Caveats
- **Environment Readiness**: This strategy assumes the real frontend and backend are implemented and can be launched concurrently for testing. If they are not ready, the E2E tests will fail.
- **State Management**: Real file uploads will leave artifacts in the backend's storage (e.g., local `/tmp/` or S3). A cleanup mechanism may be required in the backend or via a test teardown script to prevent storage bloat.
- **Black-box limitations**: I did not inspect the frontend or backend source code. The exact locators and API response schemas used in the proposed tests must align with the actual implementation.

## 4. Conclusion
**Test Strategy Recommendations:**
1. **Remove all mocks**: Delete `dummy-server.js` and remove all `page.route()` calls from the test files.
2. **Dynamic Test Data**: Use dynamically generated emails and user data for each test run to ensure idempotency and prevent database conflicts.
3. **Wait for Real Network/UI States**: Instead of fulfilling routes, use Playwright's `page.waitForURL()` or `page.waitForResponse()` to wait for actual backend processing and frontend navigation.

**Proposed Test Case Outlines (Candidate Registration):**
1. **Happy Path - Complete Registration**: Fill the form with unique valid data, upload a valid PDF CV and Certificate, submit, and verify the UI redirects to a success page or dashboard correctly rendered by the real app.
2. **Validation - Missing Required Fields**: Attempt to submit a blank or partially filled form. Assert that the real frontend correctly blocks submission and displays native validation errors (e.g., "Email is required").
3. **Validation - Invalid File Types**: Upload an unsupported file (e.g., `.exe` or an oversized file) as a CV. Assert that the frontend or backend correctly rejects it and displays an appropriate error message.
4. **Validation - Duplicate Email**: Register a user successfully. In the same test, navigate back to the registration page and attempt to register another user with the *exact same email*. Assert the real backend rejects it and the UI displays an "Email already registered" error.
5. **Functionality - Multiple Certificates**: Upload a valid CV and *multiple* valid certificate PDFs. Submit and verify successful registration and check that the backend properly handles the array of files (verified via a successful response or profile check).
6. **Notification - Post-Registration State**: Complete a real registration flow. Verify that the app correctly redirects to the Dashboard, makes a real fetch to the notifications API, and renders the "Take Test" (or equivalent action) based on actual backend data.

## 5. Verification Method
1. Start the real backend server on port 8000 and the real frontend server on port 3000.
2. Run the modified test suite: `cd d:/projects/JHIC-rev/e2e && npx playwright test tests/tier1/candidate-registration.spec.ts`.
3. Review the Playwright trace viewer (`npx playwright show-trace`) to confirm that actual network requests are being dispatched to `http://localhost:8000` and no routes are being intercepted.
4. Check the real backend database to confirm that the test user records and files were actually persisted during the test execution.
