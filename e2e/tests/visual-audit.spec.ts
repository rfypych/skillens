import { test } from '@playwright/test';

// Full-page screenshots of every route for style-consistency audit.
// Run AFTER visual-setup.spec.ts (needs e2e-state-*.json).
test.setTimeout(120000);
test.use({ viewport: { width: 1440, height: 900 } });

async function shot(page: any, url: string, name: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500); // let charts/fonts settle
  await page.screenshot({ path: `visual/${name}.png`, fullPage: true });
}

test.describe('public', () => {
  test('landing + auth', async ({ page }) => {
    await shot(page, '/', '01-landing');
    await shot(page, '/login', '02-login');
    await shot(page, '/signup', '03-signup');
  });
});

test.describe('recruiter', () => {
  test.use({ storageState: 'e2e-state-recruiter.json' });
  test('all recruiter pages', async ({ page }) => {
    await shot(page, '/recruiter', '04-recruiter-home');
    await shot(page, '/recruiter/jobs', '05-jobs');
    await shot(page, '/recruiter/jobs/new', '06-jobs-new');
    await shot(page, '/recruiter/jobs/22', '07-job-detail');
    await shot(page, '/recruiter/jobs/edit/22', '08-job-edit');
    await shot(page, '/recruiter/candidates', '09-candidates');
    await shot(page, '/recruiter/candidates/70', '10-candidate-detail');
    await shot(page, '/recruiter/interviews', '11-interviews');
    await shot(page, '/recruiter/metrics', '12-metrics');
    await shot(page, '/recruiter/settings', '13-settings');
    await shot(page, '/recruiter/settings/team', '14-settings-team');
  });
});

test.describe('candidate', () => {
  test.use({ storageState: 'e2e-state-candidate.json' });
  test('all candidate pages', async ({ page }) => {
    await shot(page, '/candidate/dashboard', '15-dashboard');
    await shot(page, '/candidate/profile', '16-profile');
    await shot(page, '/candidate/interviews', '17-interviews');
    await shot(page, '/candidate/job/22', '18-job-detail');
    await shot(page, '/candidate/apply/254f44ef-6843-4e76-8081-f9d5e55c6f43', '19-apply-magic');
    await shot(page, '/candidate/instructions/40', '20-instructions');
    await shot(page, '/candidate/test/40', '21-test');
  });
});
