import { test, expect } from '@playwright/test';

// Tests against LIVE deployments (no local servers involved).
const PREVIEW = 'https://skillens-hnpoe84l7-rofyys-projects.vercel.app';
const PROD = 'https://skillens-app.vercel.app';
test.setTimeout(90000);

test.describe('preview deployment', () => {
  test('landing renders', async ({ page }) => {
    const res = await page.goto(PREVIEW + '/');
    expect(res?.status()).toBeLessThan(400);
    await expect(page.getByText(/Merekrut tanpa/i).first()).toBeVisible({ timeout: 30000 });
  });

  test('login shows exactly 2 demo buttons', async ({ page }) => {
    await page.goto(PREVIEW + '/login');
    const form = page.locator('form:visible', { hasText: 'Akun demo' });
    await expect(form).toBeVisible({ timeout: 30000 });
    const btns = form.locator('button', { hasText: /Rekruter|Kandidat|Admin|User/ });
    await expect(btns).toHaveCount(2);
    await expect(form.locator('button', { hasText: 'Rekruter' })).toBeVisible();
    await expect(form.locator('button', { hasText: 'Kandidat' })).toBeVisible();
  });

  test('signup renders', async ({ page }) => {
    await page.goto(PREVIEW + '/signup');
    await expect(page.getByText(/Buat akun baru/i).first()).toBeVisible({ timeout: 30000 });
  });

  test('login attempt behavior (backend status)', async ({ page }) => {
    let apiStatus = 0;
    page.on('response', (r) => {
      if (r.url().includes('/api/auth/login')) apiStatus = r.status();
    });
    await page.goto(PREVIEW + '/login');
    const form = page.locator('form:visible', { hasText: 'Akun demo' });
    await expect(form).toBeVisible({ timeout: 30000 });
    await form.locator('button', { hasText: 'Rekruter' }).click();
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(15000);
    console.log('PREVIEW login API status:', apiStatus, '| url now:', page.url());
  });
});

test.describe('production deployment', () => {
  test('prod login page renders', async ({ page }) => {
    await page.goto(PROD + '/login');
    await expect(page.locator('input[type="password"]:visible').first()).toBeVisible({ timeout: 30000 });
  });
});
