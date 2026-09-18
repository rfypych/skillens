import { test, expect } from '@playwright/test';

test('demo buttons fill credentials and log in', async ({ page }) => {
  await page.goto('/login');
  // NOTE: page has mobile (hidden) + desktop forms — always scope to :visible.
  const form = page.locator('form:visible', { hasText: 'Akun demo' });
  await expect(form).toBeVisible({ timeout: 60000 });

  // Click "Rekruter" demo button, verify fields filled
  await form.locator('button', { hasText: 'Rekruter' }).click();
  await expect(form.locator('input[type="text"]').first()).toHaveValue('recruiter@skillens.com');

  // Submit via the form's submit button
  await form.locator('button[type="submit"]').click();
  await page.waitForURL('**/recruiter**', { timeout: 90000, waitUntil: 'commit' });
  await expect(page).toHaveURL(/\/recruiter/);
});
