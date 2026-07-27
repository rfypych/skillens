# Handoff Report: E2E Test Strategy for Milestone 1

## Observation
1. **Existing Test Configuration**: The Playwright config (`e2e/playwright.config.ts`) targets `http://localhost:3000` (`baseURL`), and tests are located in `e2e/tests/`.
2. **Existing Test Implementation**: The current file at `e2e/tests/tier1/candidate-registration.spec.ts` mocks network requests (`await page.route('**/api/registration', ...)`) and targets form fields (`Upload CV`, `Take the test`) that do not exist in the real application UI.
3. **Frontend Implementation**:
   - Candidate registration happens at `/signup`. Users select "I'm a Candidate" and provide `full_name`, `email`, and `password`. The form submits to the backend `POST /auth/signup` and auto-logs the user in, redirecting to `/candidate/dashboard` (`frontend/src/app/signup/page.tsx`).
   - File uploads (resumes) are performed by candidates at `/candidate/profile`. Selecting a file triggers a direct `POST /candidates/upload` request and returns a `file_url` (`frontend/src/app/candidate/profile/page.tsx`).
4. **Backend Implementation**:
   - The signup endpoint (`backend/routers/auth.py`) creates the user. Passwords must be ≥8 chars, contain an uppercase letter, and a digit (`backend/schemas.py`).
   - Duplicate emails return a 400 error.
   - The upload endpoint (`backend/routers/candidates.py`) saves the file to the local `uploads` directory.

## Logic Chain
1. The project constraints dictate that **E2E tests must NOT mock the backend API or frontend HTML**. They must make real requests to the actual application.
2. Therefore, the existing `candidate-registration.spec.ts` is invalid because it relies heavily on network mocking and incorrect DOM locators.
3. To replace it, we must write tests that interact with the real Next.js UI elements (e.g., navigating to `/signup`, filling actual `name` attributes like `full_name`) and allow requests to reach the live FastAPI backend on port 8000.
4. To meet the Tier 1 scope (≥5 tests for Candidate Registration & Files), we can derive test cases from the actual backend validation logic and frontend flows: happy path registration, missing fields validation, password complexity validation, duplicate email handling, and the real resume upload flow on the candidate profile.

## Caveats
- **Test State & Isolation**: Since the tests will make real requests, registering the same email repeatedly will fail. Tests must use dynamically generated emails (e.g., appending a timestamp `user+16789@example.com`) to ensure determinism, or the database must be reset between test runs.
- **Environment Setup**: The tests assume both the frontend server (`npm run start` or `dev` on port 3000) and backend server (FastAPI on port 8000) are running concurrently before the Playwright suite executes.
- **Local File System**: The file upload test will write actual files to the backend's `uploads/` directory.

## Conclusion
The current `candidate-registration.spec.ts` must be completely discarded and rewritten. The new strategy involves interacting directly with the live `/signup` and `/candidate/profile` pages without mocking any HTTP requests. The tests will validate the real integration between the Next.js frontend and the FastAPI backend.

## Proposed Test Case Outlines (for `e2e/tests/tier1/candidate-registration.spec.ts`)

**Test 1: Happy Path - Complete Candidate Registration**
- **Action**: Navigate to `/signup`. Select the candidate role. Fill `full_name` ("John Doe"), `email` (unique, e.g., "john+<timestamp>@example.com"), and `password` ("ValidPass123"). Click the submit button.
- **Assertion**: Wait for navigation to `/candidate/dashboard`. Assert the URL is correct and no error messages are displayed.

**Test 2: Validation - Missing Required Fields**
- **Action**: Navigate to `/signup`. Leave all fields blank and attempt to submit the form.
- **Assertion**: Verify that the HTML5 native validation prevents submission (e.g., checking if the form is in an invalid state or checking that the page URL remains `/signup`).

**Test 3: Validation - Invalid Password Complexity**
- **Action**: Navigate to `/signup`. Fill in a valid name and email, but provide an invalid password (e.g., "short"). Submit the form.
- **Assertion**: Verify that the UI displays the backend-provided error message: "Password must be at least 8 characters" (or similar validation error).

**Test 4: Validation - Duplicate Email Registration**
- **Action**: Use the API (via Playwright's `request` context) to seed a user `existing@example.com`. Navigate to `/signup` and attempt to register a new candidate using the same email `existing@example.com`.
- **Assertion**: Verify that the UI displays the error message "Email already registered".

**Test 5: Happy Path - Resume Upload via Candidate Profile**
- **Action**: 
  1. Register a new candidate (or login with an existing one). 
  2. Navigate to `/candidate/profile`. 
  3. Locate the file input (`type="file"`) and upload a dummy PDF file (e.g., `dummy_resume.pdf`). 
  4. Wait for the `POST /candidates/upload` response.
- **Assertion**: Assert that a success toast appears ("Resume uploaded successfully") and the "View Uploaded Resume" link becomes visible on the profile page.

## Verification Method
To verify this strategy:
1. Start the backend (`uvicorn main:app --port 8000`) and frontend (`npm run dev` on port 3000).
2. Manually navigate to `http://localhost:3000/signup` and perform the actions described in the outlines.
3. Observe that the actual application behaviors match the assertions (e.g., password validation errors, duplicate email errors, auto-login redirect, and profile upload success).
4. Run `npx playwright test e2e/tests/tier1/candidate-registration.spec.ts` once implemented to confirm it passes without mocked routes.
