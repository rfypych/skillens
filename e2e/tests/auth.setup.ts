import { test as setup } from '@playwright/test';

// Auth setup project (official Playwright pattern: setup file + storageState).
// One-time login per role — saves storageState so dependent specs make zero
// further /auth/login calls (5/min rate limit). Run explicitly:
//   npx playwright test tests/auth.setup.ts --project=chromium
// NOT wired as a global project dependency on purpose: auto-running setup on
// every invocation would burn the login rate budget.
async function loginAndSave(page: any, username: string, password: string, statePath: string, expectUrl: RegExp) {
  await page.goto('/login');
  await page.locator('input[placeholder*="admin"]:visible').fill(username);
  await page.locator('form:has(input[placeholder*="admin"]:visible) input[type="password"]:visible').fill(password);
  await page.locator('form:has(input[placeholder*="admin"]:visible) button[type="submit"]:visible').click();
  await page.waitForURL(expectUrl, { timeout: 90000, waitUntil: 'commit' });
  await page.context().storageState({ path: statePath });
}

setup('save recruiter state', async ({ page }) => {
  await loginAndSave(page, 'recruiter@skillens.com', 'password123', 'e2e-state-recruiter.json', /\/recruiter/);
});

setup('save candidate state', async ({ page }) => {
  await loginAndSave(page, 'kandidat@skillens.com', 'password123', 'e2e-state-candidate.json', /\/candidate\/dashboard/);
});
