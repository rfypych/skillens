# Handoff Report: Tier 2 E2E Tests - Candidate Registration Boundary Cases

## 1. Observation
- The Candidate Registration form is located at `app/candidate/apply/[job_id]/page.tsx` and sends a `POST` request to `/assessment/${job_id}/apply` in the backend.
- The UI contains a form with `<input name="name" required>`, `<input name="email" type="email" required>`, and `<input type="file" accept=".pdf" required>`.
- The backend `apply_for_job` in `backend/services/assessment_service.py` performs the following validations on the uploaded file:
  - Validates `content_type == "application/pdf"` and `filename.lower().endswith(".pdf")`. If false, returns `400: Only PDF resumes are supported`.
  - Validates `file.size <= 5 * 1024 * 1024`. If false, returns `400: File too large. Maximum size is 5MB.`.
  - Attempts to parse the PDF using `pypdf`. If it fails (e.g., corrupted or 0-byte file), it catches the exception and returns `500: Failed to process PDF resume...`.
- If the user is not logged in (guest), the backend checks `if not payload.name or not payload.email:` and throws a `400` if missing.
- The frontend catches API errors and displays them inside a `.bg-red-50` `div`.
- The Playwright configuration uses `baseURL: 'http://localhost:3000'` and allows API calls via `request`.

## 2. Logic Chain
1. **No Mocking Constraint**: Since we cannot mock the backend API or frontend HTML, we must create real jobs in the database and interact with the live server. We can use Playwright's API context (`request.post`) in a `beforeEach` block to create a recruiter account and a job posting to obtain a valid `job_id`.
2. **Form Validation Strategy**: For cases where required fields are empty or email is malformed, the browser's native HTML5 validation will prevent form submission before it reaches the backend. Playwright can verify this by checking `checkValidity()` on the input elements or asserting the network request was never made.
3. **Backend Validation Strategy**: For file validation (size, type, corrupt data), Playwright can bypass frontend limitations (like `accept=".pdf"`) by using `setInputFiles` with specific dummy buffers (e.g., >5MB buffer, `.txt` extension, `text/plain` mime type, or invalid PDF structure). This forces the request to the backend, triggering the backend validation errors, which can then be asserted in the UI.

## 3. Caveats
- Since tests hit the real backend, they will insert records (users, jobs, applications) into the database. Depending on the test database setup (`test_*.db`), this state might accumulate unless cleared or isolated.
- The API creation of the recruiter/job must include required fields like `password` matching complexity rules (`ValidPass123!`).

## 4. Conclusion
**Proposed Strategy & Playwright Test Cases:**
File to create: `e2e/tests/tier2/candidate-registration-boundary.spec.ts`

**Setup Process:**
Use `test.beforeEach` to:
- Call `POST http://localhost:8000/auth/signup` to create a dummy recruiter.
- Call `POST http://localhost:8000/auth/login` to obtain the token.
- Call `POST http://localhost:8000/jobs` to create a job and extract `job_id`.
- Navigate to `/candidate/apply/${job_id}`.

**Test Cases (≥ 5 Boundary Cases):**
1. **Max File Size Exceeded (> 5MB):**
   - *Action:* Fill valid name and email. Upload a file using `setInputFiles` with a buffer size of 5.1MB. Click submit.
   - *Assertion:* UI displays error "File too large. Maximum size is 5MB." (from backend `400`).
2. **Invalid File Format (Wrong Extension):**
   - *Action:* Fill valid name/email. Use `setInputFiles` to upload a file named `resume.txt` with mime type `text/plain`.
   - *Assertion:* UI displays error "Only PDF resumes are supported" (from backend `400`).
3. **Invalid File Format (MIME Spoofing):**
   - *Action:* Fill valid name/email. Upload a file named `spoof.pdf` but specify mime type `text/plain` or `image/png`.
   - *Assertion:* UI displays error "Only PDF resumes are supported" (from backend `400`).
4. **Corrupted / Empty PDF Payload:**
   - *Action:* Fill valid name/email. Upload a file named `corrupted.pdf` using a buffer of invalid bytes (e.g., `Buffer.from('not a real pdf')`) with mime type `application/pdf`.
   - *Assertion:* UI displays error containing "Failed to process PDF resume" (from backend `500` via `pypdf`).
5. **Missing Required Fields (Guest Application):**
   - *Action:* Upload a valid PDF but leave the Name and Email fields empty. Attempt to submit.
   - *Assertion:* Form submission is blocked by the browser. Assert that `page.$eval('form', f => f.checkValidity())` is `false`, and `page.url()` does not navigate away.
6. **Malformed Email Address:**
   - *Action:* Enter a name, upload a valid PDF, but enter `invalid-email` (no domain) in the email field.
   - *Assertion:* Form submission is blocked. Assert `email` input `checkValidity()` is `false`.

## 5. Verification Method
- **To Verify Implementation:** Run the tests using `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
- **Success Criteria:** All 6 boundary tests pass, correctly identifying the failure states on the real application. The backend logs should reflect the `400` and `500` validation rejections without crashing the server.
