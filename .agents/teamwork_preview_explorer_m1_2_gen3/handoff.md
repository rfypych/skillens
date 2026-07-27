# Handoff Report: E2E Testing Strategy for Milestone 1 (Candidate Registration & Files)

## 1. Observation
- **Scope File**: `d:/projects/JHIC-rev/.agents/e2e_testing_track/SCOPE_TIER1.md`
- **Goal**: Write ≥5 Playwright tests for Candidate Registration & Files.
- **Constraints**: 
  - Opaque-box E2E tests focusing on happy-path and essential negative cases.
  - **CRITICAL INTEGRITY CONSTRAINT**: No API mocking via `page.route` is allowed. Tests must trigger real network requests and real page interactions.
  - Tests must use standard Playwright assertions and target standard ports (`http://localhost:3000` / `http://localhost:8000`).
- **Requirements Context**: `ORIGINAL_REQUEST.md` (R1) specifies candidates must be able to upload personal data, CV, and certificates to register.

## 2. Logic Chain
- Since mocking via `page.route` is strictly prohibited, the tests must rely on actual UI interactions causing real backend requests. 
- We must design tests that assume the existence of standard UI elements (e.g., using `data-testid` attributes) and endpoints.
- Because the backend is real, stateful constraints like unique emails must be accounted for (e.g., using timestamps to generate unique emails for the happy path).
- To provide robust coverage (≥5 test cases) using Category-Partition and BVA, the tests should cover:
  1. **Category - Valid Inputs**: Successful registration with all required data and multiple files.
  2. **Category - Missing Data**: Attempted registration with missing mandatory text fields.
  3. **Category - Missing Files**: Attempted registration without the required CV document.
  4. **Category - Invalid File Format**: Uploading a disallowed file type (e.g., executable) to verify file validation.
  5. **Category - Stateful Error (Duplicate)**: Attempting to register with an already-registered email to verify backend rejection surfaces to the UI correctly.

## 3. Caveats
- Since the application code is not yet implemented, the test code relies on assumed `data-testid` locators and URL paths (`/register`). The implementer will need to build the UI and backend to match these assumptions (or adjust the locators slightly).
- The tests assume dummy files will be available in a `fixtures/` directory alongside the test files. The implementer must create these fixture files for the tests to run successfully.
- Without knowing the exact file size limits configured on the backend, a duplicate-email test is more reliable for a 5th test case than a file-size boundary test.

## 4. Conclusion
The recommended test strategy is to write 5 robust, unmocked Playwright tests that cover the registration flow using assumed UI locators. 

**Proposed Test Structure (to be implemented by the E2E implementer):**
```typescript
// e2e/tests/tier1/candidate-registration.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Milestone 1: Candidate Registration & Files', () => {
  const dummyCvPath = path.join(__dirname, 'fixtures', 'dummy-cv.pdf');
  const dummyCertPath = path.join(__dirname, 'fixtures', 'dummy-cert.pdf');
  const invalidFilePath = path.join(__dirname, 'fixtures', 'invalid-file.exe');

  test.beforeEach(async ({ page }) => {
    // Tests must make real requests, no page.route() mocking.
    await page.goto('/register');
  });

  test('TC1: Successful registration with valid data, CV, and certificates', async ({ page }) => {
    const uniqueEmail = \`candidate_\${Date.now()}@example.com\`;
    await page.fill('input[data-testid="input-name"]', 'John Doe');
    await page.fill('input[data-testid="input-email"]', uniqueEmail);
    await page.fill('input[data-testid="input-password"]', 'Password123!');
    
    // File uploads
    await page.setInputFiles('input[data-testid="input-cv"]', dummyCvPath);
    await page.setInputFiles('input[data-testid="input-certificate"]', [dummyCertPath]);

    await page.click('button[data-testid="submit-registration"]');

    // Verify real success state (e.g. redirect or success message)
    await expect(page.locator('data-testid="success-message"')).toBeVisible({ timeout: 10000 });
  });

  test('TC2: Registration fails when mandatory text fields are missing', async ({ page }) => {
    // Omit name and email
    await page.fill('input[data-testid="input-password"]', 'Password123!');
    await page.setInputFiles('input[data-testid="input-cv"]', dummyCvPath);
    await page.click('button[data-testid="submit-registration"]');

    // Expect validation errors for missing fields
    await expect(page.locator('data-testid="error-message"')).toContainText('required');
  });

  test('TC3: Registration fails when mandatory CV is missing', async ({ page }) => {
    const uniqueEmail = \`candidate_\${Date.now()}_nocv@example.com\`;
    await page.fill('input[data-testid="input-name"]', 'Jane Doe');
    await page.fill('input[data-testid="input-email"]', uniqueEmail);
    await page.fill('input[data-testid="input-password"]', 'Password123!');
    
    // Do not attach CV
    await page.click('button[data-testid="submit-registration"]');

    // Expect validation error for missing file
    await expect(page.locator('data-testid="error-message"')).toContainText('CV');
  });

  test('TC4: Registration rejects invalid file formats (e.g., .exe)', async ({ page }) => {
    await page.setInputFiles('input[data-testid="input-cv"]', invalidFilePath);
    await page.click('button[data-testid="submit-registration"]');

    // Expect format validation error
    await expect(page.locator('data-testid="error-message"')).toContainText('format');
  });

  test('TC5: Registration fails when using a duplicate email', async ({ page }) => {
    // 1. Register a user first to guarantee the email exists in DB
    const staticEmail = \`duplicate_\${Date.now()}@example.com\`;
    await page.fill('input[data-testid="input-name"]', 'Alice First');
    await page.fill('input[data-testid="input-email"]', staticEmail);
    await page.fill('input[data-testid="input-password"]', 'Password123!');
    await page.setInputFiles('input[data-testid="input-cv"]', dummyCvPath);
    await page.click('button[data-testid="submit-registration"]');
    await expect(page.locator('data-testid="success-message"')).toBeVisible();

    // 2. Try registering again with the same email
    await page.goto('/register');
    await page.fill('input[data-testid="input-name"]', 'Alice Second');
    await page.fill('input[data-testid="input-email"]', staticEmail);
    await page.fill('input[data-testid="input-password"]', 'Password123!');
    await page.setInputFiles('input[data-testid="input-cv"]', dummyCvPath);
    await page.click('button[data-testid="submit-registration"]');

    // Expect backend rejection reflected in UI
    await expect(page.locator('data-testid="error-message"')).toContainText('Email already exists');
  });
});
```

## 5. Verification Method
- **Implementation Validation**: The implementer will save the tests at `e2e/tests/tier1/candidate-registration.spec.ts` and create dummy files in `e2e/tests/tier1/fixtures/`.
- **Command to Verify**: Run `npx playwright test candidate-registration.spec.ts`.
- **Integrity Validation**: Search `candidate-registration.spec.ts` for the string `page.route`. It must yield zero results, confirming no mocking violations occurred.
