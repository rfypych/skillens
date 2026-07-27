# Handoff Report: Cross-Feature Playwright Tests

## 1. Observation
- The file `e2e/tests/tier3/cross-feature.spec.ts` contains 10 tests that outline cross-feature scenarios but rely on hardcoded, non-existent test data and comments rather than actual setup.
- Examples of magic state assumptions: `// Assume 5 already scheduled` (Line 86), `// Find a candidate who failed KKM` (Line 58), `// We mock the system time or assume the test setup provides this scenario` (Line 156).
- Fragile locators are used, such as `page.locator('tr', { hasText: 'Failed KKM Candidate' })` (Line 59) and `page.locator('.interview-card', { hasText: 'Rejected Candidate' })` (Line 107).
- In the `[F1 x F2] Real-time Rank Displacement` test (Line 118), the test expects the UI to spontaneously update (`await expect(candidateAPage.getByText('Status: Fail')).toBeVisible({ timeout: 5000 });`) without explicitly simulating a page reload or mocking a WebSocket/polling mechanism.

## 2. Logic Chain
1. **Magic States**: Relying on preexisting database states makes tests brittle and non-deterministic. To correctly simulate edge cases like a "Failed KKM" candidate or "Interview quota exceeded", we must use Playwright's `page.route()` to intercept backend API calls and return the exact JSON payload required for the scenario.
2. **Time and Deadlines**: Testing expiration (e.g., Job Deadline or Acceptance Time Window) cannot rely on real-time waiting. By utilizing `await page.clock.install({ time: new Date('2024-01-01T10:00:00') })`, we freeze the browser's clock. We can then use `await page.clock.setFixedTime(...)` or `await page.clock.fastForward(...)` to instantly simulate the passing of time, triggering the frontend's expiration logic deterministically.
3. **Real-time Logic Flaw**: The application's ranking displacement test fails because it expects a real-time push without the necessary infrastructure. If the app uses standard HTTP, we must call `await candidateAPage.reload();` to fetch the new rank, or intercept the polling endpoint with `page.route` to deliver the updated status.
4. **Fragile Locators**: CSS/Text combination locators break easily on copy changes. We should replace them with accessibility-first locators like `getByRole('row', { name: /Failed KKM/i })` or `getByTestId('interview-card-rejected')`.

## 3. Caveats
- Since this is a read-only investigation, the exact API routes (e.g., `/api/candidates/me` vs `/api/v1/candidates`) and JSON response structures are assumptions. The implementer must adjust the `page.route` URLs and payloads to match the actual application schema.
- If the application actually uses WebSockets for real-time updates (instead of HTTP polling or manual reloads), testing it requires intercepting WebSocket frames, which is more complex than `page.route()`. The recommendation assumes standard HTTP interactions.

## 4. Conclusion
The current `cross-feature.spec.ts` is merely a pseudo-code spec. To convert it into a robust test suite, the implementer must:
- Inject `page.route()` handlers at the start of each test to mock specific edge-case states (e.g., returning 5 scheduled interviews to trigger quota limits).
- Use `page.clock` API to manipulate time for deadline and 12-hour window edge cases.
- Use `page.reload()` in the rank displacement test to simulate a user refreshing their dashboard.
- Upgrade locators to `getByTestId()` and `getByRole()`.

## 5. Verification Method
1. Inspect `e2e/tests/tier3/cross-feature.spec.ts` to confirm `page.route()`, `page.clock.install()`, and `page.reload()` are utilized.
2. Run the tests using: `npx playwright test e2e/tests/tier3/cross-feature.spec.ts`
3. Invalidation condition: The tests should pass instantly without needing a seeded backend database and should not contain arbitrary `page.waitForTimeout()` delays.
