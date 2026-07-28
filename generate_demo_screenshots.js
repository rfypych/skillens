const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://skillens-app.vercel.app';
const API_URL = 'https://ministries-calendars-yields-jake.trycloudflare.com';
const SCREENSHOT_DIR = path.join(__dirname, 'documentation', 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function getAuthToken(email, password) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    return data.access_token;
  } catch (err) {
    console.error(`Failed to get token for ${email}:`, err);
    return null;
  }
}

async function run() {
  console.log('🚀 Starting Puppeteer Demo & Screenshot Automation...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Landing Page
  console.log('📸 1. Capturing Landing Page...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01_landing_page.png') });

  // 2. Login Page
  console.log('📸 2. Capturing Login Page...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02_login_page.png') });

  // Get Recruiter Token
  console.log('🔑 Authenticating as Recruiter...');
  const recruiterToken = await getAuthToken('recruiter@skillens.com', 'password123');
  if (recruiterToken) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((tok) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify({ email: 'recruiter@skillens.com', role: 'recruiter' }));
    }, recruiterToken);
  }

  // 3. Recruiter Dashboard
  console.log('📸 3. Capturing Recruiter Dashboard...');
  await page.goto(`${BASE_URL}/recruiter`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03_recruiter_dashboard.png') });

  // 4. Recruiter Active Jobs List
  console.log('📸 4. Capturing Recruiter Active Jobs List (dengan tombol Salin & Buka)...');
  await page.goto(`${BASE_URL}/recruiter/jobs`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04_recruiter_jobs_list.png') });

  // 5. Create Job Page
  console.log('📸 5. Capturing Create Job Form...');
  await page.goto(`${BASE_URL}/recruiter/jobs/new`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '05_recruiter_create_job.png') });

  // 6. Recruiter Job Detail - Tab 1 (Leaderboard)
  console.log('📸 6. Capturing Recruiter Job Detail (Tab 1: Leaderboard Real-Time)...');
  await page.goto(`${BASE_URL}/recruiter/jobs/1`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06_recruiter_job_detail_leaderboard.png') });

  // 7. Recruiter Job Detail - Tab 2 (Recommendations)
  console.log('📸 7. Capturing Recruiter Job Detail (Tab 2: Rekomendasi AI & Wawancara)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Rekomendasi AI'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07_recruiter_job_detail_recommendations.png') });

  // 8. Recruiter Job Detail - Tab 3 (KKM Setup)
  console.log('📸 8. Capturing Recruiter Job Detail (Tab 3: Setup Simulasi AI & KKM)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Setup Simulasi'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08_recruiter_job_detail_kkm_setup.png') });

  // 9. Recruiter Job Detail - Tab 4 (Metadata)
  console.log('📸 9. Capturing Recruiter Job Detail (Tab 4: Rincian Lowongan)...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent.includes('Rincian Lowongan'));
    if (target) target.click();
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09_recruiter_job_detail_metadata.png') });

  // Get Candidate Token
  console.log('🔑 Authenticating as Candidate...');
  const candidateToken = await getAuthToken('kandidat@skillens.com', 'password123');
  if (candidateToken) {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded' });
    await page.evaluate((tok) => {
      localStorage.setItem('token', tok);
      localStorage.setItem('user', JSON.stringify({ email: 'kandidat@skillens.com', role: 'candidate' }));
    }, candidateToken);
  }

  // 10. Candidate Apply Page
  console.log('📸 10. Capturing Candidate Apply Page...');
  await page.goto(`${BASE_URL}/candidate/apply/default-magic-token-1`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '10_candidate_apply_page.png') });

  // 11. Candidate Instructions Page
  console.log('📸 11. Capturing Candidate Briefing Instructions...');
  await page.goto(`${BASE_URL}/candidate/instructions/1`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '11_candidate_briefing_instructions.png') });

  // 12. Candidate Test Simulation Page
  console.log('📸 12. Capturing Candidate Test Simulation...');
  await page.goto(`${BASE_URL}/candidate/test/1`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12_candidate_test_simulation.png') });

  // 13. Candidate Dashboard
  console.log('📸 13. Capturing Candidate Dashboard...');
  await page.goto(`${BASE_URL}/candidate/dashboard`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '13_candidate_dashboard.png') });

  // 14. Candidate Interviews Page
  console.log('📸 14. Capturing Candidate Interviews Page...');
  await page.goto(`${BASE_URL}/candidate/interviews`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, '14_candidate_interviews.png') });

  await browser.close();
  console.log('✅ All 14 Screenshots captured successfully in documentation/screenshots/ !');
}

run().catch(err => {
  console.error('❌ Error executing automation script:', err);
  process.exit(1);
});
