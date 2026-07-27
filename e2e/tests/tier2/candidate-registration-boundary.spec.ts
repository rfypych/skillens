import { test, expect, APIRequestContext } from '@playwright/test';

const API_BASE = 'http://localhost:8000';

async function createRecruiterAndJob(request: APIRequestContext, deadlineDays: number = 7) {
  const timestamp = Date.now();
  const email = `hr_${timestamp}@example.com`;
  
  // Sign up Recruiter
  await request.post(`${API_BASE}/auth/signup`, {
    data: {
      email,
      password: 'SecurePassword123!',
      role: 'recruiter',
      full_name: 'Test Recruiter'
    }
  });

  // Login
  const loginRes = await request.post(`${API_BASE}/auth/login`, {
    form: { username: email, password: 'SecurePassword123!' }
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;

  // Create Job
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + deadlineDays);
  
  const jobRes = await request.post(`${API_BASE}/jobs`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      title: 'Boundary Test Job',
      description: 'Test job for boundaries',
      expected_outcomes: 'Outcomes',
      specific_skills: 'Skills',
      kkm_score: 70,
      deadline: deadline.toISOString()
    }
  });
  const jobData = await jobRes.json();
  return jobData.id;
}

test.describe('Candidate Registration Boundary Tests (Guest)', () => {
  let jobId: number;
  let expiredJobId: number;

  test.beforeAll(async ({ request }) => {
    // Create a normal job and an expired job
    jobId = await createRecruiterAndJob(request, 7);
    expiredJobId = await createRecruiterAndJob(request, -1);
  });

  test('1. Happy Path / Exact Boundary Limit: Exactly 5MB PDF', async ({ page }) => {
    await page.goto(`/candidate/apply/${jobId}`);
    
    await page.locator('input[name="name"]').fill('John Exact');
    await page.locator('input[name="email"]').fill('john.exact@example.com');
    
    // Exactly 5MB
    // Create a dummy PDF content that is exactly 5 * 1024 * 1024 bytes
    const pdfHeader = Buffer.from('%PDF-1.4\n');
    const paddingLength = 5 * 1024 * 1024 - pdfHeader.length;
    const bufferExact = Buffer.concat([pdfHeader, Buffer.alloc(paddingLength, 'a')]);
    
    await page.locator('input[type="file"]').setInputFiles({
      name: 'exact.pdf',
      mimeType: 'application/pdf',
      buffer: bufferExact,
    });
    
    await page.getByRole('button', { name: /continue to instructions/i }).click();
    
    // Application succeeds, it should redirect to instructions page
    await page.waitForURL(`**/candidate/instructions/**`);
    expect(page.url()).toContain('/candidate/instructions/');
  });

  test('2. Over Max Size: 5MB + 1 byte PDF', async ({ page }) => {
    await page.goto(`/candidate/apply/${jobId}`);
    
    await page.locator('input[name="name"]').fill('John Over');
    await page.locator('input[name="email"]').fill('john.over@example.com');
    
    const pdfHeader = Buffer.from('%PDF-1.4\n');
    const paddingLength = 5 * 1024 * 1024 + 1 - pdfHeader.length;
    const bufferOver = Buffer.concat([pdfHeader, Buffer.alloc(paddingLength, 'a')]);
    
    await page.locator('input[type="file"]').setInputFiles({
      name: 'over.pdf',
      mimeType: 'application/pdf',
      buffer: bufferOver,
    });
    
    await page.getByRole('button', { name: /continue to instructions/i }).click();
    
    // Verify UI shows the error from backend
    // "File too large. Maximum size is 5MB."
    await expect(page.locator('text=/too large|maximum size/i')).toBeVisible();
    expect(page.url()).not.toContain('/candidate/instructions/');
  });

  test('3. Invalid File Extension/Mime: .exe file', async ({ page }) => {
    await page.goto(`/candidate/apply/${jobId}`);
    
    await page.locator('input[name="name"]').fill('Jane Format');
    await page.locator('input[name="email"]').fill('jane.format@example.com');
    
    // Create dummy exe
    const bufferExe = Buffer.from('dummy exe payload');
    
    await page.locator('input[type="file"]').setInputFiles({
      name: 'resume.exe',
      mimeType: 'application/x-msdownload',
      buffer: bufferExe,
    });
    
    await page.getByRole('button', { name: /continue to instructions/i }).click();
    
    // "Only PDF resumes are supported"
    await expect(page.locator('text=/only pdf|supported|invalid/i')).toBeVisible();
    expect(page.url()).not.toContain('/candidate/instructions/');
  });

  test('4. Missing Required Fields (Guest)', async ({ page }) => {
    await page.goto(`/candidate/apply/${jobId}`);
    
    // Don't fill name or email
    const bufferValid = Buffer.from('%PDF-1.4 dummy pdf');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'valid.pdf',
      mimeType: 'application/pdf',
      buffer: bufferValid,
    });
    
    await page.getByRole('button', { name: /continue to instructions/i }).click();
    
    // Expect HTML5 required validation
    const nameIsInvalid = await page.$eval('input[name="name"]', (el: HTMLInputElement) => !el.validity.valid);
    const emailIsInvalid = await page.$eval('input[name="email"]', (el: HTMLInputElement) => !el.validity.valid);
    
    expect(nameIsInvalid || emailIsInvalid).toBe(true);
    expect(page.url()).not.toContain('/candidate/instructions/');
  });

  test('5. Expired Job Deadline Boundary', async ({ page }) => {
    // Navigate to expired job
    await page.goto(`/candidate/apply/${expiredJobId}`);
    
    await page.locator('input[name="name"]').fill('John Late');
    await page.locator('input[name="email"]').fill('john.late@example.com');
    
    const bufferValid = Buffer.from('%PDF-1.4 dummy pdf');
    await page.locator('input[type="file"]').setInputFiles({
      name: 'valid.pdf',
      mimeType: 'application/pdf',
      buffer: bufferValid,
    });
    
    await page.getByRole('button', { name: /continue to instructions/i }).click();
    
    // Verify backend rejects with Job posting expired (or UI prevents it)
    await expect(page.locator('text=/expired|deadline/i')).toBeVisible();
    expect(page.url()).not.toContain('/candidate/instructions/');
  });
});
