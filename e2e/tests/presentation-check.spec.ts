import { test, expect } from '@playwright/test';

// Presentation readiness check — read-only except logins (no submits, no junk data).
const API = 'http://127.0.0.1:8000';
const MAGIC_TOKEN = '254f44ef-6843-4e76-8081-f9d5e55c6f43'; // Job 22 Senior Product Engineer

async function login(page: any, username: string, password: string) {
  await page.goto('/login');
  await page.locator('input[placeholder*="admin"]:visible').fill(username);
  await page.locator('form:has(input[placeholder*="admin"]:visible) input[type="password"]:visible').fill(password);
  await page.locator('form:has(input[placeholder*="admin"]:visible) button[type="submit"]:visible').click();
}

test.describe.serial('Presentation readiness', () => {
  test.setTimeout(120000);
  // NOTE: keep this test first in file order — see comment on ranking test.
  test('ranking API returns sorted recommendations for job 22', async ({ request }) => {
    const loginRes = await request.post(`${API}/auth/login`, {
      form: { username: 'recruiter@skillens.com', password: 'password123' },
    });
    expect(loginRes.ok()).toBeTruthy();
    const { access_token } = await loginRes.json();
    const recRes = await request.get(`${API}/interviews/recommend/22`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    expect(recRes.ok()).toBeTruthy();
    const list = await recRes.json();
    expect(Array.isArray(list) && list.length).toBeGreaterThan(0);
    const scores = list.map(
      (r: any) => r.assessment_results?.[0]?.overall_score ?? 0
    );
    expect(scores).toEqual([...scores].sort((a: number, b: number) => b - a));
    expect(Math.min(...scores)).toBeGreaterThanOrEqual(70); // KKM filter
  });

  // Dev server cold-compiles pages on first hit — generous timeouts.
  test('admin/admin lands on recruiter dashboard', async ({ page }) => {
    await login(page, 'admin', 'admin');
    await page.waitForURL('**/recruiter**', { timeout: 90000, waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/recruiter/);
  });

  test('user/user lands on candidate dashboard', async ({ page }) => {
    await login(page, 'user', 'user');
    await page.waitForURL('**/candidate/dashboard**', { timeout: 90000, waitUntil: 'commit' });
    await expect(page).toHaveURL(/\/candidate\/dashboard/);
  });

  // Merged into one login: /auth/login allows 5/min per IP and the suite
  // already uses 5 (API + 4 browser logins). recruiter@skillens.com sees
  // job 22's applicants (Arka/Sinta/Rania) via company scope.
  test('recruiter sees jobs + seeded candidates', async ({ page }) => {
    await login(page, 'recruiter@skillens.com', 'password123');
    await page.waitForURL('**/recruiter**', { timeout: 90000, waitUntil: 'commit' });
    await page.goto('/recruiter/jobs');
    await expect(page.getByText(/Senior Product Engineer/i).first()).toBeVisible({ timeout: 60000 });
    await page.goto('/recruiter/candidates');
    await expect(page.getByText(/Arka|Sinta|Rafi|Dimas|Rania/i).first()).toBeVisible({ timeout: 60000 });
  });

  test('kandidat sees candidate dashboard', async ({ page }) => {
    await login(page, 'kandidat@skillens.com', 'password123');
    await page.waitForURL('**/candidate/dashboard**', { timeout: 90000, waitUntil: 'commit' });
  });

  test('magic-link apply page renders job without login', async ({ page }) => {
    await page.goto(`/candidate/apply/${MAGIC_TOKEN}`);
    await expect(page.getByText(/Senior Product Engineer/i).first()).toBeVisible({ timeout: 60000 });
  });

});
