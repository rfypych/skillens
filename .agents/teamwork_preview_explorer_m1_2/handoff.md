# Handoff Report: Milestone 1 - Candidate Registration Boundary Tests

## 1. Observation
- The scope file `SCOPE_TIER2.md` requests ≥5 Playwright tests for "Candidate Registration boundary cases (max size, invalid formats)". The target file is `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
- In `backend/schemas.py`, the `UserCreate` schema dictates valid Candidate Signup format rules: `email` must be valid, and `password` must be ≥8 characters, contain at least one uppercase letter, and one digit.
- In `frontend/src/app/candidate/apply/[job_id]/page.tsx`, guest candidates are registered while applying for a job. This process requires a "Full Name", "Email Address", and a "Resume Upload".
- In `backend/services/assessment_service.py` (lines 58-88), the `apply_for_job` endpoint provisions a new candidate account ("guest application") and explicitly defines file-based boundary limits:
  - Max size: `file.size > 5 * 1024 * 1024` (Raises 400: "File too large. Maximum size is 5MB.").
  - Invalid format (extension and MIME): `file.content_type != "application/pdf" or not file.filename.lower().endswith(".pdf")` (Raises 400: "Only PDF resumes are supported").
  - `pypdf` is used to parse the file text. If the PDF is corrupted, empty (0 bytes), or improperly formatted, `pypdf` raises an exception which results in a 500 error.

## 2. Logic Chain
1. The phrasing "max size, invalid formats" maps directly to the guest candidate registration (apply for job) resume upload endpoint, which has explicit 5MB and PDF validations. It also broadly applies to the standard signup endpoint (email/password formats).
2. To provide complete coverage and satisfy the request for ≥5 boundary tests, the testing strategy should focus heavily on the resume upload restrictions where candidates are registered into the system, supplemented by core text-field boundary validations.
3. Test Case 1 (Valid Max Size Boundary): A resume that is exactly 5.0 MB (5,242,880 bytes). Expected: Success.
4. Test Case 2 (Invalid Max Size Boundary): A resume that is exactly 5.0 MB + 1 byte (5,242,881 bytes). Expected: Failure (HTTP 400, "Maximum size is 5MB").
5. Test Case 3 (Invalid Format - Extension): A file with a `.docx` extension. Expected: Failure.
6. Test Case 4 (Invalid Format - MIME type): A file with a `.pdf` extension but an invalid MIME type like `text/plain`. Expected: Failure.
7. Test Case 5 (Invalid Format - Content/Empty): A 0-byte `.pdf` file. This tests the lower boundary of size and ensures the PDF parser handles malformed/empty files safely. Expected: Failure (HTTP 500 or 400).
8. Test Case 6 (Invalid Format - Text Fields): Attempting to register a candidate with an invalid email format (e.g., `invalid-email`). Expected: HTML5 or API validation failure.

## 3. Caveats
- The frontend (`page.tsx`) uses `accept=".pdf"` which might prevent Playwright from directly selecting non-PDF files via normal interactions. The test might need to use `setInputFiles` or bypass the UI to test backend resilience to invalid formats.
- Generating exact 5MB and 5MB+1 byte files within Playwright requires dynamically creating `Buffer` objects of specific sizes in the test setup.
- The instructions stated "Focus on valid test creation and requirement coverage, not on passing against an unimplemented app." Even if the app's backend is not fully robust, the tests should assert the *expected* behavior defined by the current backend constraints.

## 4. Conclusion
The "Candidate Registration" boundary tests should be implemented in `e2e/tests/tier2/candidate-registration-boundary.spec.ts` using the Guest Candidate Application flow. 

**Proposed Test Suite Strategy:**
1. `should allow candidate registration with exactly 5MB PDF (boundary pass)`
2. `should reject candidate registration with >5MB PDF (boundary fail)`
3. `should reject candidate registration with 0-byte PDF (lower bound / invalid content)`
4. `should reject candidate registration with invalid file extension (.docx)`
5. `should reject candidate registration with spoofed MIME type (text/plain inside .pdf)`
6. `should reject candidate registration with invalid email format`

This gives you 6 solid boundary test cases that strictly map to the exact limitations coded in the application.

## 5. Verification Method
- **To verify findings:** Inspect `backend/services/assessment_service.py` (lines 58-88) to confirm the 5MB size limit and `.pdf` format checks.
- **To verify the test suite:** Once the Implementer writes the Playwright code, execute `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts` from the `d:/projects/JHIC-rev` directory to ensure the tests execute.
