import { test, expect } from '@playwright/test';

test.describe('Candidate Registration & Files (Tier 1)', () => {

  // INTEGRITY RULE: No page.route() mocking. 
  // Tests must interact with the actual endpoints and UI.
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual registration page
    await page.goto('http://localhost:3000/register');
  });

  test('Test 1: Happy Path - Complete Registration', async ({ page }) => {
    // Generate unique email to avoid database unique constraint violations
    const uniqueEmail = `john.doe.${Date.now()}@example.com`;

    // Fill in valid personal data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');

    // Upload a valid CV and certificate
    await page.getByLabel(/upload cv/i).setInputFiles({
      name: 'cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    await page.getByLabel(/upload certificate/i).setInputFiles({
      name: 'certificate.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    // Wait for real backend API to respond with 201 Created
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/registration') && response.status() === 201
    );
    
    // Click submit
    await page.getByRole('button', { name: /submit|register/i }).click();

    // Verify backend API responded successfully
    await responsePromise;

    // Verify form submits successfully and shows UI message
    await expect(page.getByText(/registration successful/i)).toBeVisible();
  });

  test('Test 2: Validation - Missing Required Fields', async ({ page }) => {
    // Leave mandatory fields blank and submit
    await page.getByRole('button', { name: /submit|register/i }).click();

    // Verify submission is blocked and UI displays errors
    await expect(page.getByText(/email is required/i)).toBeVisible();
    await expect(page.getByText(/cv is required/i)).toBeVisible();
  });

  test('Test 3: Validation - Invalid File Types', async ({ page }) => {
    const uniqueEmail = `jane.doe.${Date.now()}@example.com`;
    // Fill personal data
    await page.getByLabel(/name/i).fill('Jane Doe');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');

    // Attempt to upload disallowed file type
    await page.getByLabel(/upload cv/i).setInputFiles({
      name: 'payload.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('dummy exe content')
    });

    // Verify UI displays "invalid file type" error message before submission
    await expect(page.getByText(/invalid file type/i)).toBeVisible();
  });

  test('Test 4: Functionality - Multiple Certificates Upload', async ({ page }) => {
    const uniqueEmail = `alice.smith.${Date.now()}@example.com`;
    // Fill required personal data
    await page.getByLabel(/name/i).fill('Alice Smith');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');

    // Upload CV
    await page.getByLabel(/upload cv/i).setInputFiles({
      name: 'cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    // Upload multiple certificates
    await page.getByLabel(/upload certificate/i).setInputFiles([
      { name: 'cert1.pdf', mimeType: 'application/pdf', buffer: Buffer.from('dummy cert 1') },
      { name: 'cert2.pdf', mimeType: 'application/pdf', buffer: Buffer.from('dummy cert 2') }
    ]);

    // Submit form
    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/registration') && response.status() === 201
    );
    await page.getByRole('button', { name: /submit|register/i }).click();

    await responsePromise;

    // Verify form submits successfully
    await expect(page.getByText(/registration successful/i)).toBeVisible();
  });

  test('Test 5: Notification - In-App "Take Test" Prompt', async ({ page }) => {
    const uniqueEmail = `bob.builder.${Date.now()}@example.com`;
    // Complete a successful registration flow
    await page.getByLabel(/name/i).fill('Bob Builder');
    await page.getByLabel(/email/i).fill(uniqueEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    
    await page.getByLabel(/upload cv/i).setInputFiles({
      name: 'cv.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    const responsePromise = page.waitForResponse(response => 
      response.url().includes('/api/registration') && response.status() === 201
    );
    await page.getByRole('button', { name: /submit|register/i }).click();
    await responsePromise;

    // Assume app automatically redirects to dashboard after successful registration
    await page.waitForURL('**/dashboard');

    // Verify presence of in-app notification loaded from real backend
    await expect(page.getByRole('button', { name: /take the test/i })).toBeVisible();
  });
});
