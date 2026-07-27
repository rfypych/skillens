# Handoff: Tier 2 E2E Tests - Milestone 1 Review

## Observation
I have reviewed `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
- The test file correctly establishes 6 test cases for Candidate Registration.
- It covers boundary values for file size: exactly 5MB (`5 * 1024 * 1024`) and >5MB (`5 * 1024 * 1024 + 1`), as well as a 0-byte file.
- It checks invalid formats like `.docx` and spoofed MIME types.
- To simulate the uploaded files, it uses `Buffer.alloc(size, 'a')` for size limits and `Buffer.from('dummy pdf content')` for other tests.
- In the invalid email test, it wraps `await expect(errorLocator).toBeVisible({ timeout: 500 });` in a `try/catch` block.

## Logic Chain
1. **Robustness of File Upload Tests**: In E2E testing, a test aimed at verifying a specific boundary (like maximum file size) must satisfy all other validation constraints (like file format). If the application implements robust file validation by checking file magic numbers (e.g., `%PDF-`), the `Buffer.alloc(size, 'a')` file will be rejected as an "Invalid Format" before the size limit is ever evaluated. This invalidates the size tests, meaning the boundary logic wouldn't actually be tested. The dummy buffers should begin with `%PDF-` to reliably bypass basic format validation.
2. **Playwright Anti-pattern**: Wrapping an `expect()` assertion in a `try/catch` block is an anti-pattern in Playwright. Even if the error is caught, the failed assertion can pollute the test report or cause test flakiness in CI depending on reporter configurations. Conditional UI checks should use non-throwing methods like `await errorLocator.isVisible()` or `waitFor({ state: 'visible' }).catch()`.
3. **Requirement Coverage**: The tests correctly cover the scope of >=5 boundary tests for candidate registration as defined in `SCOPE_TIER2.md`. 
4. **Integrity Violations**: None found. The tests interact properly with the DOM elements as expected for an opaque-box test.

## Caveats
- The tests are assessed against an unimplemented application. We assume standard DOM selectors (`input[name="email"]`, `input[type="file"]`, `.error-message`) will be part of the future contract.
- We cannot run `tsc` or Playwright to verify execution due to the fresh environment, but visual inspection of the TS code confirms it is syntactically sound.

## Conclusion
**Verdict: REQUEST_CHANGES**

**Findings:**
1. **[Major] Robustness of File Size Boundary Tests:**
   - **What**: The 5MB and >5MB buffers are filled entirely with `'a'` characters.
   - **Why**: If the backend implements magic byte validation for PDFs, these tests will fail on format validation before reaching the size limit validation, rendering the size boundary test ineffective.
   - **Suggestion**: Ensure all PDF buffers start with the standard PDF magic bytes (e.g., `Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.alloc(size - 9, 'a')])`).
2. **[Minor] Playwright `expect` in `try/catch`:**
   - **What**: The invalid email test uses `try { await expect(...).toBeVisible(); } catch(e) {}`.
   - **Why**: This can pollute test reports and is an anti-pattern for conditional checks.
   - **Suggestion**: Replace with `const hasUiError = await errorLocator.isVisible();` or similar non-throwing Playwright API.

Please update the test file to address the file buffer robustness and the `expect` anti-pattern, then resubmit for review.

## Verification Method
- Ensure `Buffer.alloc()` is modified to prepend `%PDF-` for the generated dummy PDFs.
- Ensure `try/catch` around `expect` is removed in favor of `isVisible()`.
- Visually inspect the changes in `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
