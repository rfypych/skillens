# Handoff Report: Candidate Registration Boundary Tests

## 1. Observation
- `SCOPE_TIER2.md` requires: "Write ≥5 Playwright tests for Candidate Registration boundary cases (max size, invalid formats). Save as `e2e/tests/tier2/candidate-registration-boundary.spec.ts`."
- `TEST_INFRA.md` dictates the test philosophy: "Opaque-box, requirement-driven... Methodology: Category-Partition + BVA + Pairwise + Workload Testing."
- `ORIGINAL_REQUEST.md` (R1) states: "Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register."

## 2. Logic Chain
- Based on Boundary Value Analysis (BVA) for the registration flow, the main input vectors are file uploads (CV, certificates) and textual inputs (personal data).
- File Boundaries: Must test limits on file size (at exact limit vs immediately over limit), file formats (valid vs invalid extensions/MIME types), and file counts (number of certificates).
- Text Boundaries: Must test limits on length (missing fields vs maximum length strings) and data content safety (XSS/SQLi payload injections).
- By covering these specific edges, we can derive a comprehensive suite of ≥5 tests that fulfill the tier 2 requirement.

## 3. Caveats
- Since the application implementation details are opaque, the exact numerical limits (e.g., max file size being 5MB or max name length being 255 characters) are unspecified. The implementer must define these bounds as variables in the test file based on actual backend/UI constraints.
- "XSS payload" test assumes the frontend handles input validation or sanitization; if the backend handles it, the test must verify the backend's response (e.g., 400 Bad Request or sanitized echoing).

## 4. Conclusion
Recommended Test Cases for `e2e/tests/tier2/candidate-registration-boundary.spec.ts`:

1. **Max File Size Boundary**: Submit a CV exactly at the max allowed size threshold (should succeed). Submit a CV just 1 byte (or 1KB) over the limit (should be blocked with an error).
2. **Invalid File Format Boundary**: Attempt to upload a disallowed file type (e.g., `.exe` or `.sh` script instead of `.pdf`/`.docx`). The UI/API should reject the file format.
3. **Empty/Missing Required Fields Boundary**: Submit the registration form omitting one or more mandatory fields (e.g., missing CV, or missing First Name). Form submission must fail with field-level validation errors.
4. **Maximum String Length Boundary**: Enter a string that exceeds reasonable/database limits (e.g., 256 or 500 characters) into the Name or other personal data fields. The system should gracefully reject it via a 400 error or validation message, instead of crashing.
5. **Malicious Content / XSS Boundary**: Input payloads like `<script>alert('xss')</script>` or `' OR 1=1 --` into text fields. Ensure the inputs are either rejected or successfully sanitized when registered and later displayed.
6. **Multi-File Limit Boundary**: For the certificates upload, attach the exact maximum number of allowed files (e.g., 5). Then attempt to attach one more than the limit (e.g., 6). The latter must be rejected.

## 5. Verification Method
- The implementer must encode these 6 test cases into `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
- The tests can be verified by running `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts` once the feature and tests are implemented.
- Each test must properly simulate the boundary and assert the expected UI/API error state or success state.
