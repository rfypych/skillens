import { test, expect } from '@playwright/test';

// Records the on-stage demo flow as a backup video (visual/demo-backup.webm).
// Run: npx playwright test tests/demo-video.spec.ts --project=chromium
test.setTimeout(240000);
test.use({
  viewport: { width: 1440, height: 900 },
  recordVideo: { dir: 'visual/', size: { width: 1280, height: 800 } },
});

async function demoLogin(page: any, role: 'Rekruter' | 'Kandidat') {
  await page.goto('/login', { waitUntil: 'domcontentloaded' });
  const form = page.locator('form:visible', { hasText: 'Akun demo' });
  await expect(form).toBeVisible({ timeout: 60000 });
  await page.waitForTimeout(800);
  await form.locator('button', { hasText: role }).click();
  await page.waitForTimeout(500);
  await form.locator('button[type="submit"]').click();
}

test('stage demo flow', async ({ page }) => {
  // ACT 1 — recruiter: jobs -> ranking -> candidate detail
  await demoLogin(page, 'Rekruter');
  await page.waitForURL('**/recruiter**', { timeout: 90000, waitUntil: 'commit' });
  await page.goto('/recruiter/jobs', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Senior Product Engineer/i).first()).toBeVisible({ timeout: 60000 });
  await page.waitForTimeout(1500);

  await page.goto('/recruiter/jobs/22', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Arka Pratama/i).first()).toBeVisible({ timeout: 60000 });
  await page.waitForTimeout(2000); // let ranking table sink in

  await page.goto('/recruiter/candidates/70', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Ringkasan Evaluasi AI/i).first()).toBeVisible({ timeout: 60000 });
  await page.waitForTimeout(2500);

  // ACT 2 — candidate side via magic link (no login needed)
  await page.goto('/candidate/apply/254f44ef-6843-4e76-8081-f9d5e55c6f43', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Senior Product Engineer/i).first()).toBeVisible({ timeout: 60000 });
  await page.waitForTimeout(2000);

  // ACT 3 — kandidat dashboard
  await demoLogin(page, 'Kandidat');
  await page.waitForURL('**/candidate/dashboard**', { timeout: 90000, waitUntil: 'commit' });
  await page.waitForTimeout(2500);
});
