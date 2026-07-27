## 1. Observation
- `e2e/tests/tier2/candidate-registration-boundary.spec.ts:14` creates a 5MB "PDF" using `Buffer.alloc(size5MB, 'a')`. The test expects a success message.
- `e2e/tests/tier2/candidate-registration-boundary.spec.ts:98` attempts a spoofed MIME type test by setting `mimeType: 'text/plain'` with the filename `resume.pdf`.
- `e2e/tests/tier2/candidate-registration-boundary.spec.ts:128-134` tests invalid email using a try/catch block around `await expect(errorLocator).toBeVisible({ timeout: 500 })`.

## 2. Logic Chain
- **False Negative in 5MB Boundary Test**: The "exactly 5MB PDF" test uses an invalid PDF structure (a buffer of 'a's). If the system strictly validates PDF formats (e.g., checking magic bytes like `%PDF-`), it will reject the file as invalid content. Since the test expects success based *only* on file size, it will fail against a secure backend, creating a false negative.
- **False Positive in MIME Spoofing Test**: A proper spoofing attack relies on a malicious file matching the expected `Content-Type` but having invalid internal contents or extension. By setting `mimeType: 'text/plain'`, the request explicitly tells the backend it is plain text. The backend will trivially reject it based on the `Content-Type` header, completely missing the actual risk of MIME/Content mismatch and reporting a false positive that the spoofing vulnerability is mitigated.
- **Flaky Assertion in Email Test**: The email invalid format test uses a hardcoded 500ms timeout in a try-catch block for the UI error message. If the frontend validation takes slightly longer than 500ms (e.g. server-side validation lag), the timeout expires, the test falls back to `validity !== ''` (which might be false if HTML5 validation isn't used natively), and the test will flake.

## 3. Caveats
- Since this is an opaque-box test against an unimplemented UI, we assume the future backend adheres to secure file-upload best practices (validating file structures/magic bytes, rather than just headers).
- "5MB" is implemented as `5 * 1024 * 1024` bytes, which is standard for mebibytes, but could be strictly `5 * 1000 * 1000` depending on the product spec.

## 4. Conclusion
- The test suite contains critical flaws. The boundary tests fail to construct valid payloads for boundary conditions, test the wrong threat vector for MIME spoofing, and use flaky assertions for error messages. These must be rewritten with proper test fixtures (a minimal valid PDF structure) and deterministic Playwright assertions before execution.

## 5. Verification Method
- Inspect `e2e/tests/tier2/candidate-registration-boundary.spec.ts` lines 14, 98, and 130.
- Try running the tests against a strict backend: observe the 5MB boundary test fail due to an invalid format rather than file size.
- To fix, replace `Buffer.alloc(size5MB, 'a')` with a minimal valid PDF header padded to 5MB, adjust the MIME spoofing to use an executable/txt payload with `application/pdf` MIME type, and replace the 500ms try-catch block with a stable assertion.
