import { test } from '@playwright/test';

// One-time login per role — saves storageState so the audit makes zero
// further /auth/login calls (5/min rate limit).
async function loginAndSave(page: any, username: string, password: string, statePath: string, expectUrl: RegExp) {
  await page.goto('/login');
  await page.locator('input[placeholder*="admin"]:visible').fill(username);
  await page.locator('form:has(input[placeholder*="admin"]:visible) input[type="password"]:visible').fill(password);
  await page.locator('form:has(input[placeholder*="admin"]:visible) button[type="submit"]:visible').click();
  await page.waitForURL(expectUrl, { timeout: 90000, waitUntil: 'commit' });
  await page.context().storageState({ path: statePath });
}

test('save recruiter state', async ({ page }) => {
  await loginAndSave(page, 'recruiter@skillens.com', 'password123', 'e2e-state-recruiter.json', /\/recruiter/);
});

test('save candidate state', async ({ page }) => {
  await loginAndSave(page, 'kandidat@skillens.com', 'password123', 'e2e-state-candidate.json', /\/candidate\/dashboard/);
});
