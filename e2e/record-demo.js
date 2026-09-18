const { chromium } = require('playwright');

const BASE = 'http://127.0.0.1:3000';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function demoLogin(page, role) {
  await page.goto(BASE + '/login', { waitUntil: 'domcontentloaded' });
  const form = page.locator('form:visible', { hasText: 'Akun demo' });
  await form.waitFor({ timeout: 60000 });
  await sleep(800);
  await form.locator('button', { hasText: role }).click();
  await sleep(500);
  await form.locator('button[type="submit"]').click();
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: 'visual/', size: { width: 1280, height: 800 } },
  });
  const page = await context.newPage();

  await demoLogin(page, 'Rekruter');
  await page.waitForURL('**/recruiter**', { timeout: 90000 });
  await page.goto(BASE + '/recruiter/jobs', { waitUntil: 'domcontentloaded' });
  await page.getByText(/Senior Product Engineer/i).first().waitFor({ timeout: 60000 });
  await sleep(1500);

  await page.goto(BASE + '/recruiter/jobs/22', { waitUntil: 'domcontentloaded' });
  await page.getByText(/Arka Pratama/i).first().waitFor({ timeout: 60000 });
  await sleep(2500);

  await page.goto(BASE + '/recruiter/candidates/70', { waitUntil: 'domcontentloaded' });
  await page.getByText(/Ringkasan Evaluasi AI/i).first().waitFor({ timeout: 60000 });
  await sleep(2500);

  await page.goto(BASE + '/candidate/apply/254f44ef-6843-4e76-8081-f9d5e55c6f43', { waitUntil: 'domcontentloaded' });
  await page.getByText(/Senior Product Engineer/i).first().waitFor({ timeout: 60000 });
  await sleep(2000);

  await demoLogin(page, 'Kandidat');
  await page.waitForURL('**/candidate/dashboard**', { timeout: 90000 });
  await sleep(2500);

  await context.close();
  await browser.close();
  console.log('VIDEO DONE');
})().catch((e) => { console.error('VIDEO FAIL:', e.message); process.exit(1); });
