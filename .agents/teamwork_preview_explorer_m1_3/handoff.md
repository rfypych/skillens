# Handoff Report: E2E Test Plan for Candidate Registration & Files

## 1. Observation
- `ORIGINAL_REQUEST.md` (Requirement R1) specifies: "Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register. Candidates receive in-app notifications to take the test."
- Acceptance Criteria in `ORIGINAL_REQUEST.md` states: "Backend API test passes confirming candidates can register and attach multiple document metadata (CV, certificates)."
- `TEST_INFRA.md` and `SCOPE_TIER1.md` require at least 5 opaque-box Playwright test cases focusing on happy path and typical usage, avoiding implementation dependencies, and targeting `http://localhost:3000` (Frontend) and `http://localhost:8000` (Backend). The target file for implementation is `e2e/tests/tier1/candidate-registration.spec.ts`.

## 2. Logic Chain
1. To cover **personal data and file uploads**, we need a happy-path test verifying that a user can successfully submit the registration form with all required inputs (Test Case 1).
2. To satisfy the **"multiple document metadata"** acceptance criteria, we must include a test specifically verifying the upload of more than one certificate (Test Case 2).
3. To test the **backend API explicitly** as requested, we require a direct API request test mimicking the frontend form-data structure (Test Case 3).
4. To cover the **in-app notification requirement**, we need a test verifying that after successful registration, the candidate's dashboard displays a notification to take the test (Test Case 4).
5. For typical usage and robustness, we include tests for standard edge cases: attempting registration with missing mandatory files like a CV (Test Case 5) and attempting registration with an email that is already registered (Test Case 6).
6. The test steps are designed to translate directly into Playwright commands (`page.goto`, `page.locator.setInputFiles`, `expect(page.locator)`).

## 3. Caveats
- **Identifiers:** Exact DOM locators (e.g., `data-testid` attributes), form field names, and API route endpoints (e.g., `/api/register`) are assumed since the implementation does not exist yet. The test implementer will need to adjust these.
- **Notification Mechanism:** It is assumed that the in-app notification appears immediately upon reaching the candidate dashboard after registration. If notifications rely on delayed batch processing, the tests may require wait conditions or polling.

## 4. Conclusion
The recommended E2E test plan for Milestone 1 (Candidate Registration & Files) includes the following 6 test cases to be implemented in `e2e/tests/tier1/candidate-registration.spec.ts`:

### Test Case 1: Valid Candidate Registration with all required documents
- **Step 1:** Navigate to the registration page (`http://localhost:3000/register`).
- **Step 2:** Fill in valid personal data (Name, Email, Password).
- **Step 3:** Upload a valid CV file (`.pdf`).
- **Step 4:** Upload one valid Certificate file (`.pdf`).
- **Step 5:** Submit the registration form.
- **Expected Assertion 1:** UI shows a success message or redirects the user to the candidate dashboard.
- **Expected Assertion 2:** A network intercept confirms a successful POST response from the registration API.

### Test Case 2: Candidate can attach multiple certificates during registration
- **Step 1:** Navigate to the registration page.
- **Step 2:** Fill in personal data and upload a CV.
- **Step 3:** Upload Certificate A.
- **Step 4:** Trigger the UI mechanism to add another file (e.g., click "Add another certificate") and upload Certificate B.
- **Step 5:** Submit the form.
- **Expected Assertion 1:** The request payload to the API contains a list/array of certificate metadata with a length of at least 2.
- **Expected Assertion 2:** Post-registration, the candidate profile UI correctly lists multiple certificates.

### Test Case 3: Registration API endpoint correctly accepts multipart/form-data (Backend API Test)
- **Step 1:** Using Playwright's `request` context, construct a POST request to the backend API (`http://localhost:8000/api/register`).
- **Step 2:** Format the payload as `multipart/form-data`, including personal text fields, a dummy CV file stream, and dummy certificate file streams.
- **Step 3:** Send the request.
- **Expected Assertion 1:** Response HTTP status is `201 Created` or `200 OK`.
- **Expected Assertion 2:** Response body contains a valid candidate ID and confirms the document upload metadata.

### Test Case 4: Candidate receives in-app notification to take the test after registration
- **Step 1:** Complete a successful candidate registration (can be done via API for speed, then log in via UI).
- **Step 2:** Navigate to the candidate dashboard.
- **Step 3:** Check the notifications area (e.g., clicking a bell icon or checking an alerts panel).
- **Expected Assertion 1:** A notification is present with text prompting the candidate to "take the test".
- **Expected Assertion 2:** Clicking the notification navigates the user to the test start or instructions page.

### Test Case 5: Registration is blocked when mandatory CV is missing
- **Step 1:** Navigate to the registration page.
- **Step 2:** Fill in personal data and optionally upload certificates.
- **Step 3:** Do NOT upload a CV.
- **Step 4:** Attempt to submit the form.
- **Expected Assertion 1:** The form submission is prevented, and a validation error message (e.g., "CV is required") is visible on the UI.
- **Expected Assertion 2:** No POST request is dispatched to the backend registration endpoint.

### Test Case 6: Registration with an already registered email fails gracefully
- **Step 1:** Ensure a candidate with email `existing@example.com` is already registered (via setup hook or API).
- **Step 2:** Navigate to the registration page.
- **Step 3:** Fill in the form using the email `existing@example.com` and valid file uploads.
- **Step 4:** Submit the form.
- **Expected Assertion 1:** The UI displays an error message stating "Email already registered" or similar.
- **Expected Assertion 2:** The user remains on the registration page and is not redirected to the dashboard.

## 5. Verification Method
- **Review:** Verify that the 6 test cases conceptually cover §R1 and the relevant Acceptance Criteria in `ORIGINAL_REQUEST.md`.
- **Execution:** Once the frontend and backend are implemented, a test engineer will write these exact cases into `e2e/tests/tier1/candidate-registration.spec.ts`. Running `npx playwright test e2e/tests/tier1/candidate-registration.spec.ts` against the live local applications (`localhost:3000` and `localhost:8000`) must pass successfully.
