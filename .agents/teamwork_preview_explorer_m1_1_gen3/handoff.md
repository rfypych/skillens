# Handoff: Milestone 1 Test Strategy

## 1. Observation
- **Scope File (`SCOPE_TIER1.md`, lines 10-11):** "Milestone 1 | Feature 1: Candidate Registration | Write ≥5 Playwright tests for Candidate Registration & Files. Save as `e2e/tests/tier1/candidate-registration.spec.ts`."
- **Requirements File (`ORIGINAL_REQUEST.md`, lines 12-13):** "Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register. Candidates receive in-app notifications to take the test."
- **Constraint (Task Instructions):** "E2E tests must NOT mock the backend API or frontend HTML. They must make real requests and use real page interactions... The tests will fail if they mock using `page.route`."

## 2. Logic Chain
1. To test candidate registration without mocking, we must interact with the frontend running at `http://localhost:3000/register` (or the equivalent UI entry point) and rely on it to make real backend calls.
2. The requirements dictate that candidates must provide personal data, a CV, and can provide certificates.
3. Based on Category-Partitioning and Boundary Value Analysis (BVA) for file inputs, we can derive the following test categories:
   - Valid data + Required File (Happy Path)
   - Missing Required File (Error Handling)
   - Multiple Optional Files (Boundary/Volume Handling for Certificates)
   - Invalid File Format (Validation Error)
   - State Changes post-registration (Notification verification)
4. We can use Playwright's `page.setInputFiles()` with in-memory Buffers to simulate file uploads without requiring physical files in the repository.

## 3. Caveats
- Since the backend and frontend are not built yet, these tests will fail during execution right now. They are written to specify the *expected* behavior and UI structure.
- The locator selectors used (e.g., `input[name="cv"]`, `.notification`) are assumptions. The implementer may need to update these selectors once the actual UI is built or ensure the UI is built to match these selectors.

## 4. Conclusion
The proposed test suite successfully fulfills Milestone 1 requirements without utilizing API mocking. It assumes standard web forms and validates core requirements including file uploads and in-app notifications.

**Proposed Test Cases:**
1. **TC1 (Happy Path):** Complete Registration with Valid Data, 1 CV, 1 Certificate.
2. **TC2 (Mandatory Validation):** Registration fails when the mandatory CV is missing.
3. **TC3 (Multiple Attachments):** Successful registration with 1 CV and 3 Certificates.
4. **TC4 (Format Validation):** Registration rejects invalid file formats for the CV (e.g., `.exe`).
5. **TC5 (Side Effect / Notification):** Successful registration triggers an in-app notification to "take the test".

**Proposed File Content (`e2e/tests/tier1/candidate-registration.spec.ts`):**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Candidate Registration & Files', () => {
  const registerUrl = '/register'; // Assuming baseUrl is set to http://localhost:3000 in playwright.config.ts

  // Helper to create an in-memory file for uploads
  const createMockFile = (name: string, mimeType: string, content = 'dummy content') => ({
    name,
    mimeType,
    buffer: Buffer.from(content)
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(registerUrl);
  });

  test('TC1: Successful registration with valid personal data, CV, and single certificate', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'John Doe');
    await page.fill('input[name="email"]', 'john.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Upload CV
    await page.setInputFiles('input[name="cvFile"]', createMockFile('cv.pdf', 'application/pdf'));
    // Upload Certificate
    await page.setInputFiles('input[name="certificateFiles"]', createMockFile('cert.pdf', 'application/pdf'));
    
    await page.click('button[type="submit"]');
    
    // Expect redirect to dashboard and success message
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

  test('TC2: Registration fails when mandatory CV is missing', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Jane Doe');
    await page.fill('input[name="email"]', 'jane.doe@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Explicitly omit CV, only upload certificate
    await page.setInputFiles('input[name="certificateFiles"]', createMockFile('cert.pdf', 'application/pdf'));
    
    await page.click('button[type="submit"]');
    
    // Expect error message and no redirect
    await expect(page.locator('text=CV is required')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(registerUrl + '$'));
  });

  test('TC3: Successful registration with multiple certificates', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Mark Smith');
    await page.fill('input[name="email"]', 'mark.smith@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    await page.setInputFiles('input[name="cvFile"]', createMockFile('cv.pdf', 'application/pdf'));
    
    // Upload multiple certificates
    await page.setInputFiles('input[name="certificateFiles"]', [
      createMockFile('cert1.pdf', 'application/pdf'),
      createMockFile('cert2.pdf', 'application/pdf'),
      createMockFile('cert3.pdf', 'application/pdf')
    ]);
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.locator('text=Registration successful')).toBeVisible();
  });

  test('TC4: Registration rejects invalid file formats for CV', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Alice Johnson');
    await page.fill('input[name="email"]', 'alice@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    // Use an unsupported format like .exe
    await page.setInputFiles('input[name="cvFile"]', createMockFile('malicious.exe', 'application/x-msdownload'));
    
    await page.click('button[type="submit"]');
    
    // Expect error message indicating invalid format
    await expect(page.locator('text=Invalid file format')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(registerUrl + '$'));
  });

  test('TC5: Successful registration triggers in-app notification to take the test', async ({ page }) => {
    await page.fill('input[name="fullName"]', 'Bob White');
    await page.fill('input[name="email"]', 'bob.white@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    
    await page.setInputFiles('input[name="cvFile"]', createMockFile('cv.pdf', 'application/pdf'));
    await page.setInputFiles('input[name="certificateFiles"]', createMockFile('cert.pdf', 'application/pdf'));
    
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/.*\/dashboard/);
    
    // Check for the specific in-app notification
    const notification = page.locator('.notification, [data-testid="notification"]');
    await expect(notification).toBeVisible();
    await expect(notification).toContainText(/take the test/i);
  });
});
```

## 5. Verification Method
- **Method:** Instruct the implementer to create `e2e/tests/tier1/candidate-registration.spec.ts` with the provided code.
- **Run:** `npx playwright test e2e/tests/tier1/candidate-registration.spec.ts`
- **Invalidation:** If the tests contain `page.route` or mock any backend response, they violate the constraint. The tests as written above do not use `page.route`. They will legitimately fail until the application backend and frontend are implemented to handle the route and file uploads.
