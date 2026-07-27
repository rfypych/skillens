# Handoff Report

## Observation
- `SCOPE_TIER2.md` defines Tier 2 Milestone 1: "Write ≥5 Playwright tests for Candidate Registration boundary cases (max size, invalid formats). Save as `e2e/tests/tier2/candidate-registration-boundary.spec.ts`."
- `ORIGINAL_REQUEST.md` (R1) states: "Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register."
- `TEST_INFRA.md` specifies "Opaque-box E2E tests focusing on boundary conditions and corner cases" using Playwright.

## Logic Chain
1. Based on R1, candidate registration involves two main types of inputs: personal data text fields and file uploads (CV, certificates).
2. Boundary conditions for text inputs include max character limits, empty/missing required fields, and malicious inputs (XSS).
3. Boundary conditions for file uploads include maximum file sizes, supported vs. unsupported file extensions, and the maximum number of allowed files (certificates).
4. Therefore, testing these boundaries requires scenarios that explicitly hit the edges of these limits (e.g., exact max size vs. max size + 1 byte, exact max string length vs. max string length + 1 char).

## Caveats
- The exact numerical limits (e.g., 5MB for file size, 255 characters for text fields, 5 for max certificates) are not explicitly defined in the requirements and are assumed as standard placeholders. The implementation will need to define or use these specific limits.

## Conclusion
Recommend the following 6 Playwright E2E test cases to be written in `e2e/tests/tier2/candidate-registration-boundary.spec.ts`:
1. **File Size Boundary**: Registration fails when the uploaded CV is exactly 1 byte over the maximum allowed size, but succeeds at exactly the max size.
2. **File Format Boundary**: Registration rejects unsupported file extensions (e.g., `.exe`, `.js`) and only accepts valid formats (e.g., `.pdf`, `.docx`).
3. **Max Upload Count Boundary**: Registration allows uploading exactly the maximum allowed number of certificates (e.g., 5), but rejects attempting to upload one more.
4. **Input Length Boundary**: Registration succeeds when the candidate's name and email are exactly at their maximum character limits, but fails when exceeding them by 1 character.
5. **Missing Required Fields**: Registration fails with appropriate UI validation errors when attempting to submit with empty required fields.
6. **XSS / Malicious Input**: Registration safely handles inputs containing XSS payloads (e.g., `<script>alert('xss')</script>`) in the name or address fields, ensuring they are not executed and/or properly sanitized.

## Verification Method
- Execute the future test suite via `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
- Verify that each test is structured as an opaque-box test without depending on implementation details.
