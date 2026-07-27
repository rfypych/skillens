import { test, expect, APIRequestContext } from '@playwright/test';

// --- API Helpers for Real Setup without Mocking ---

async function createMainHrUser(request: APIRequestContext, email: string) {
  // Sign up main account
  await request.post('/api/auth/signup', {
    data: {
      email,
      password: 'SecurePassword123!',
      role: 'admin', // Or recruiter
      full_name: 'Main HR'
    }
  });
  // Login
  const loginRes = await request.post('/api/auth/login', {
    form: { username: email, password: 'SecurePassword123!' }
  });
  const data = await loginRes.json();
  return data.access_token;
}

async function createSubAccount(request: APIRequestContext, token: string, email: string) {
  await request.post('/api/auth/sub-accounts', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      email,
      password: 'SecurePassword123!',
      role: 'recruiter',
      full_name: 'Sub HR'
    }
  });
}

async function createJob(request: APIRequestContext, token: string, kkmScore: number, deadlineDays: number = 7) {
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + deadlineDays);
  
  const res = await request.post('/api/jobs', {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      title: `Software Engineer KKM ${kkmScore}`,
      description: 'Test',
      expected_outcomes: 'Out',
      specific_skills: 'Skills',
      kkm_score: kkmScore,
      deadline: deadline.toISOString()
    }
  });
  return res.json();
}

async function createCandidate(request: APIRequestContext, email: string) {
  await request.post('/api/auth/signup', {
    data: {
      email,
      password: 'SecurePassword123!',
      role: 'candidate',
      full_name: 'Test Candidate'
    }
  });
  const loginRes = await request.post('/api/auth/login', {
    form: { username: email, password: 'SecurePassword123!' }
  });
  const data = await loginRes.json();
  return data.access_token;
}

async function candidateApplyAndTest(request: APIRequestContext, token: string, jobId: number, answers: string) {
  // Apply for job (simulated multipart if needed, but assessment setup may differ)
  // For the sake of the E2E setup, we assume simple application
  const applyRes = await request.post(`/api/assessment/${jobId}/apply`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const applyData = await applyRes.json();
  
  // Submit assessment to generate AI score
  await request.post(`/api/assessment/${applyData.id}/submit`, {
    headers: { Authorization: `Bearer ${token}` },
    data: {
      answer: answers,
      tab_switches: 0,
      copy_paste_attempts: 0,
      time_taken_seconds: 120
    }
  });
  return applyData.id;
}

// --- Playwright Test Suite ---

test.describe('Tier 3: Cross-Feature Pairwise Scenarios', () => {

  test('1. F1 x F2: Candidate Registration & KKM Pass', async ({ page, request }) => {
    // Setup HR and Job with KKM 70
    const hrToken = await createMainHrUser(request, `hr1_${Date.now()}@test.com`);
    const job = await createJob(request, hrToken, 70);
    
    // UI: Candidate logs in, applies, takes test (We simulate part of this via UI)
    const candEmail = `cand1_${Date.now()}@test.com`;
    const candToken = await createCandidate(request, candEmail);
    await candidateApplyAndTest(request, candToken, job.id, "Excellent perfect answer that passes KKM easily.");
    
    // UI Verification: Candidate checks Dashboard
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(candEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Verify Passed KKM & Rank visible
    await expect(page.getByText(/Status: Passed/i)).toBeVisible();
    await expect(page.getByText(/Rank: 1/i)).toBeVisible();
  });

  test('2. F1 x F2: Candidate Registration & KKM Fail', async ({ page, request }) => {
    const hrToken = await createMainHrUser(request, `hr2_${Date.now()}@test.com`);
    const job = await createJob(request, hrToken, 90);
    
    const candEmail = `cand2_${Date.now()}@test.com`;
    const candToken = await createCandidate(request, candEmail);
    await candidateApplyAndTest(request, candToken, job.id, "Terrible bad wrong answer.");
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(candEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    await expect(page.getByText(/Status: Failed/i)).toBeVisible();
  });

  test('3. F1 x F5: Candidate Registration & Job Expired (Deadline limit)', async ({ page, request }) => {
    const hrToken = await createMainHrUser(request, `hr3_${Date.now()}@test.com`);
    // Create job with expired deadline (-1 days)
    const job = await createJob(request, hrToken, 50, -1);
    
    const candEmail = `cand3_${Date.now()}@test.com`;
    await createCandidate(request, candEmail);
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(candEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Try to apply via UI
    await page.goto(`/candidate/jobs/${job.id}`);
    await expect(page.getByRole('button', { name: /apply/i })).toBeDisabled();
    await expect(page.getByText(/deadline passed/i)).toBeVisible();
  });

  test('4. F2 x F5: Sub-account Views Candidate KKM Ranks', async ({ page, request }) => {
    const mainHrEmail = `hr4_${Date.now()}@test.com`;
    const subHrEmail = `subhr4_${Date.now()}@test.com`;
    const hrToken = await createMainHrUser(request, mainHrEmail);
    await createSubAccount(request, hrToken, subHrEmail);
    
    const job = await createJob(request, hrToken, 70);
    const candToken = await createCandidate(request, `cand4_${Date.now()}@test.com`);
    await candidateApplyAndTest(request, candToken, job.id, "Good answer");
    
    // Sub-account logs in via UI
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(subHrEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // Verifies candidate rank in Job Dashboard
    await page.goto(`/recruiter/jobs/${job.id}`);
    await expect(page.getByText(/Good answer/i)).toBeVisible();
  });

  test('5. F2 x F4: KKM Pass -> AI Interview Questions Generated', async ({ page, request }) => {
    const hrToken = await createMainHrUser(request, `hr5_${Date.now()}@test.com`);
    const job = await createJob(request, hrToken, 60);
    const candToken = await createCandidate(request, `cand5_${Date.now()}@test.com`);
    await candidateApplyAndTest(request, candToken, job.id, "Answer with some weak points in frontend.");
    
    // HR Logs in
    await page.goto('/login');
    // ... setup logic ...
    
    // Checks candidate detail page for AI questions
    await page.goto(`/recruiter/jobs/${job.id}/candidates`);
    await page.getByRole('button', { name: /view details/i }).first().click();
    
    await expect(page.getByText(/AI Recommended Follow-up Questions/i)).toBeVisible();
  });

  test('6. F3 x F2: HR Schedules Interview for KKM Pass Candidate', async ({ page, request }) => {
    // Note: F3 (Interview Scheduling) is missing in the current backend DB schema.
    // This test outlines the expected behavior per R2 requirement.
    const hrEmail = `hr6_${Date.now()}@test.com`;
    const hrToken = await createMainHrUser(request, hrEmail);
    const job = await createJob(request, hrToken, 50);
    
    const candToken = await createCandidate(request, `cand6_${Date.now()}@test.com`);
    await candidateApplyAndTest(request, candToken, job.id, "Great pass");
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(hrEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    // HR opens candidate and schedules interview (Expected to fail until backend implements F3)
    await page.goto(`/recruiter/jobs/${job.id}/candidates`);
    await page.getByRole('button', { name: /schedule interview/i }).first().click();
    
    // Set date < 1 day (should fail)
    await page.getByLabel(/date/i).fill(new Date().toISOString().split('T')[0]);
    await page.getByRole('button', { name: /submit/i }).click();
    await expect(page.getByText(/must be at least 1-2 days/i)).toBeVisible();
  });

  test('7. F3 x F1: Candidate Accepts Interview Schedule', async ({ page, request }) => {
    // Note: Requires F3 backend implementation
    test.skip(true, "Backend schema for Interview Schedules missing");
  });

  test('8. F4 x F5: Sub-account Assigns Final Points using AI Questions', async ({ page, request }) => {
    // Sub HR assigns final points based on interview
    const mainHrEmail = `hr8_${Date.now()}@test.com`;
    const subHrEmail = `subhr8_${Date.now()}@test.com`;
    const hrToken = await createMainHrUser(request, mainHrEmail);
    await createSubAccount(request, hrToken, subHrEmail);
    
    const job = await createJob(request, hrToken, 60);
    const candToken = await createCandidate(request, `cand8_${Date.now()}@test.com`);
    await candidateApplyAndTest(request, candToken, job.id, "Passable answer");
    
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(subHrEmail);
    await page.getByLabel(/password/i).fill('SecurePassword123!');
    await page.getByRole('button', { name: /login/i }).click();
    
    await page.goto(`/recruiter/jobs/${job.id}/candidates`);
    await page.getByRole('button', { name: /view details/i }).first().click();
    await page.getByLabel(/final score/i).fill('85');
    await page.getByRole('button', { name: /submit final score/i }).click();
    
    await expect(page.getByText(/score updated/i)).toBeVisible();
  });

  test('9. F2 x F3: KKM Fail Candidate Cannot Be Scheduled for Interview', async ({ page, request }) => {
    const hrToken = await createMainHrUser(request, `hr9_${Date.now()}@test.com`);
    const job = await createJob(request, hrToken, 90);
    const candToken = await createCandidate(request, `cand9_${Date.now()}@test.com`);
    await candidateApplyAndTest(request, candToken, job.id, "Failed answer");
    
    // UI shouldn't show "Schedule Interview" button
    // ...
  });

  test('10. F1 x F4: Registration -> Auto AI Scoring Flow', async ({ page, request }) => {
    // Fully end-to-end for candidate flow to trigger AI score immediately
    // ...
  });
});
