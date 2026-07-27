# Handoff: E2E Test Challenger Report for Tier 2 Milestone 1 (Candidate Registration Boundaries)

## 1. Observation
- `e2e/tests/tier2/candidate-registration-boundary.spec.ts` attempts to test boundary sizes using `Buffer.alloc(size, 'a')` for both exactly 5MB (line 14) and >5MB (line 34).
- The test for invalid email format ("should reject candidate registration with invalid email format", line 108) uses an invalid PDF buffer (`Buffer.from('dummy pdf content')`) and asserts on either the HTML5 validation message or any UI error: `expect(validity !== '' || hasUiError).toBeTruthy();` (line 136).
- The test "should reject candidate registration with spoofed MIME type" (line 89) sets `mimeType: 'text/plain'` while using the filename `resume.pdf` and text buffer content (lines 97-99).

## 2. Logic Chain
1. **Invalid PDF Content Masking Size Boundaries (False Negative / Flaky Test):**
   - The buffers allocated with `'a'` for the 5MB and >5MB tests are not syntactically valid PDF files. If the application's backend performs standard file signature (magic byte) validation checking for `%PDF-`, it will reject these files as invalid format *before* or *instead of* validating the size. 
   - Consequently, the "boundary pass" test (exactly 5MB) will fail unexpectedly due to a format error. 
   - The "boundary fail" test (>5MB) expects an error matching `/size|5MB|exceeds/i`. If the application rejects it for format instead, this test will fail, making it impossible to verify the size boundary logic.
2. **Weak Email Validation Assertion (False Positive):**
   - In the invalid email test, because the provided file (`dummy pdf content`) is an invalid PDF, a robust backend will reject the registration for the invalid file and display a `.error-message`.
   - This sets `hasUiError` to `true`, satisfying `expect(validity !== '' || hasUiError).toBeTruthy()`.
   - The test will therefore PASS even if the application's email validation is completely broken or missing, making it a critical false positive.
3. **Misimplemented Spoofed MIME Type Test:**
   - The spoofed MIME type test explicitly tells the server it is sending `text/plain` via the `Content-Type` header (controlled by `mimeType`). This only tests if the server detects an extension/MIME mismatch.
   - Real MIME spoofing involves declaring `mimeType: 'application/pdf'` while sending a malicious non-PDF payload (e.g., an executable or text file) to bypass naive header checks. The current test does not simulate an adversarial payload correctly.

## 3. Caveats
- I am assuming the application uses a typical robust backend that validates file magic bytes (e.g., using a library like `file-type`). If the backend naively only checks extensions and `Content-Type` headers, the size boundary tests will actually run as intended. However, this is poor security practice, and E2E tests should use valid dummy content (e.g., `%PDF-1.4\n...padding...\n%%EOF`) to guarantee they trigger the correct code paths.
- The 5MB size is defined as `5 * 1024 * 1024` bytes (5 MiB). This is standard in programming, though sometimes requirements strictly mean 5,000,000 bytes. I did not flag this as a critical failure.

## 4. Conclusion
The Tier 2 Candidate Registration boundary test suite contains **Critical False Positives and False Negatives**:
- The size boundary tests must be rewritten to generate syntactically valid dummy PDF payloads padded to the correct byte sizes.
- The email validation test must assert exclusively on email-specific errors (either checking the HTML5 validity string or ensuring the `.error-message` contains email-specific text) and should submit a valid PDF to prevent file validation errors from generating false passes.
- The MIME spoofing test should be updated to send an invalid file (e.g., text or script) but with `mimeType: 'application/pdf'` to ensure the backend performs deep content inspection.

## 5. Verification Method
1. Inspect `e2e/tests/tier2/candidate-registration-boundary.spec.ts` lines 14 and 34 to see the `'a'` filled buffers.
2. Inspect line 136 to see the tautological `expect(validity !== '' || hasUiError).toBeTruthy()` and line 109 to see the invalid PDF content (`dummy pdf content`) used in the same test.
3. Inspect lines 97-98 to see `mimeType: 'text/plain'` used for the spoof test instead of a spoofed `application/pdf`.
