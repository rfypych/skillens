# Handoff: E2E Test Plan for Milestone 1 (Candidate Registration & Files)

## 1. Observation
- `ORIGINAL_REQUEST.md` (R1, lines 12-14) states: "Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register. Candidates receive in-app notifications to take the test."
- `TEST_INFRA.md` (line 10) sets Tier 1 coverage for "Candidate Registration & Files" to 5 tests.
- `SCOPE_TIER1.md` (line 11) specifies: "Write ≥5 Playwright tests for Candidate Registration & Files. Save as `e2e/tests/tier1/candidate-registration.spec.ts`."

## 2. Logic Chain
1. **Requirements Mapping**: The registration flow requires input of personal data, a CV upload, and certificate uploads, followed by an in-app notification.
2. **Happy Path Coverage**: An opaque-box test strategy must first verify the primary user journey (valid data + valid files -> success).
3. **Negative Path Coverage**: To ensure system robustness, the suite must include tests for form validation (missing required fields) and file input validation (disallowed file extensions).
4. **Plurality of Files**: The requirement mentions "certificates" (plural), indicating the system should support uploading multiple certificate files. A specific test for multiple uploads ensures this functionality works.
5. **Post-Registration State**: The requirement explicitly mandates that "Candidates receive in-app notifications to take the test", requiring a dedicated test to verify this state change after a successful registration.

## 3. Caveats
- **Assumed constraints**: File size limits and exact allowed file extensions are not explicitly defined in the original request. The test design assumes typical constraints (e.g., `.pdf` allowed, executable files blocked).
- **Assumed fields**: The exact personal data fields (e.g., Name, Email, Password) are assumed based on standard registration forms.
- **Locators**: Since the implementation does not exist yet, the test plan assumes the use of standard semantic Playwright locators (e.g., `getByLabel`, `getByRole`) rather than specific `data-testid` attributes.

## 4. Conclusion
The following 5 E2E test cases should be implemented in `e2e/tests/tier1/candidate-registration.spec.ts`:

### Test 1: Happy Path - Complete Registration
- **Steps**: Navigate to the registration page. Fill in valid personal data (Name, Email, etc.). Upload a valid CV (`.pdf`) and one valid certificate (`.pdf`). Click the submit button.
- **Assertions**: Verify the form submits successfully (e.g., success message or redirect). Verify the backend API responds with an HTTP 2xx status.

### Test 2: Validation - Missing Required Fields
- **Steps**: Navigate to the registration page. Leave mandatory fields (e.g., Email, CV) blank and attempt to submit the form.
- **Assertions**: Verify the submission is blocked. Verify the UI displays appropriate validation error messages (e.g., "Email is required", "CV is required").

### Test 3: Validation - Invalid File Types
- **Steps**: Navigate to the registration page. Attempt to upload a disallowed file type (e.g., `payload.exe` or `script.sh`) into the CV and/or certificates upload fields.
- **Assertions**: Verify the file upload is immediately rejected or form submission is blocked. Verify the UI displays an "invalid file type" error message.

### Test 4: Functionality - Multiple Certificates Upload
- **Steps**: Fill in all required personal data and upload a CV. In the certificates section, upload at least two or three separate valid files. Submit the form.
- **Assertions**: Verify the form submits successfully. (If dashboard access is immediate, verify the dashboard or API reflects multiple attached certificates).

### Test 5: Notification - In-App "Take Test" Prompt
- **Steps**: Complete a successful registration flow (as in Test 1). Await redirect to the candidate dashboard or notifications view.
- **Assertions**: Verify the presence of an in-app notification or call-to-action button explicitly instructing the user to take the test (e.g., `getByRole('button', { name: /take the test/i })` is visible).

## 5. Verification Method
The implementer will write the tests in Playwright according to the plan above.
- **Target File**: `e2e/tests/tier1/candidate-registration.spec.ts`
- **Execution Command**: `npx playwright test e2e/tests/tier1/candidate-registration.spec.ts`
- **Validation**: All 5 tests should pass successfully against a running instance of the frontend and backend, validating both positive flows and UI validation states.
