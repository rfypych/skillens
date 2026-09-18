import { test, expect } from '@playwright/test';
const TUN = 'https://evident-towers-specified-twice.trycloudflare.com';
test.setTimeout(120000);
test('public tunnel: demo login to recruiter', async ({ page }) => {
  await page.goto(TUN + '/login', { waitUntil: 'domcontentloaded' });
  const form = page.locator('form:visible', { hasText: 'Akun demo' });
  await expect(form).toBeVisible({ timeout: 60000 });
  await form.locator('button', { hasText: 'Rekruter' }).click();
  await form.locator('button[type="submit"]').click();
  await page.waitForURL('**/recruiter**', { timeout: 90000, waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/recruiter/);
  await page.goto(TUN + '/recruiter/jobs/22', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText(/Arka Pratama/i).first()).toBeVisible({ timeout: 60000 });
});
