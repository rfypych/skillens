# Handoff Report: Iteration 2 (Milestone 1) - Tier 3 Playwright Cross-Feature Tests

## Observation
1. **Fragile Locators:** The test file `e2e/tests/tier3/cross-feature.spec.ts` heavily relies on CSS selectors and `hasText` on structural HTML elements. For example:
   - Line 59: `const failedCandidateRow = page.locator('tr', { hasText: 'Failed KKM Candidate' });`
   - Line 107: `const rejectedInterview = page.locator('.interview-card', { hasText: 'Rejected Candidate' });`
   - Line 178: `await expect(page.locator('table.candidate-rankings')).toBeVisible();`
2. **Missing Mock Data and Assumed State:** The tests rely on comments assuming that certain complex states magically exist or can be manipulated via non-existent UI elements. For example:
   - Line 86: `// Assume 5 already scheduled, try to schedule 6th`
   - Line 139: `await candidateBPage.getByLabel('Score Override').fill('100'); // Assuming a mock debug field for test`
   - Line 156: `// (We mock the system time or assume the test setup provides this scenario)`
3. Reviewer 2 explicitly stated: "Locators used are fragile (relying on CSS and hardcoded text on structural elements like tr). The tests lack valid test setups and mock data."

## Logic Chain
1. Using structural HTML tags (`tr`) or CSS classes (`.interview-card`) makes tests extremely brittle. Any minor UI refactor (e.g., migrating a table to a CSS grid of divs, or changing class names) will break the tests. Transitioning to `getByRole` (e.g., `getByRole('row')`) or `getByTestId` aligns with Playwright best practices and ensures resilience against visual changes.
2. Without explicit `page.route` interceptors, the frontend attempts to make real network requests. Since there is no pre-seeded database for these specific, complex cross-feature scenarios (like quota limits or specific KKM failures), the frontend will either crash or render empty states, causing the tests to fail.
3. The goal of frontend E2E testing for these scenarios is to verify how the UI behaves when presented with these specific conditions. By mocking the API responses (`page.route`), we guarantee the frontend receives the precise state needed (e.g., a candidate with `kkm_passed: false`) to test the UI logic (e.g., blocking the schedule button), completely eliminating the need for "magic" test setups.

## Caveats
- This strategy tests the frontend's response to backend data. It assumes the backend will eventually provide this data structure. Backend API integration tests are still required elsewhere to ensure the backend actually emits these JSON shapes.
- For time-based scenarios (e.g., "Acceptance Time Window Expiration"), mocking the API response alone might not be enough if the frontend uses `new Date()` to calculate expiration. Playwright's time manipulation (`await page.clock.setFixedTime(...)`) may need to be used in conjunction with `page.route`.

## Conclusion
The Playwright tests in `e2e/tests/tier3/cross-feature.spec.ts` must be completely rewritten adhering to two non-negotiable rules:
1. **Robust Locators:** Eliminate all CSS class selectors and structural tag locators (`tr`, `table`). Mandate the use of `page.getByRole('row', { name: '...' })`, `page.getByRole('article')`, or explicit `data-testid` attributes.
2. **Deterministic Network Mocking:** Replace all assumptions about "magic state" with explicit API mocking. Every test must define its starting state using `await page.route('**/api/...', (route) => route.fulfill({ json: { ... } }))`. This ensures the UI is deterministically driven into the correct state to prove the cross-feature requirements.

## Verification Method
1. Inspect `e2e/tests/tier3/cross-feature.spec.ts`.
2. Confirm the complete absence of `.locator('tr')`, `.locator('.class')`, and comments assuming test state.
3. Confirm that each test block initializes its state using `await page.route(...)`.
4. Run `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` (if configured) to ensure the mocked setups run successfully and quickly without external database dependencies.
