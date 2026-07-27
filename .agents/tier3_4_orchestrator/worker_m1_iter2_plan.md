# Milestone 1: Tier 3 Cross-Feature Combinations Implementation Plan (Iteration 2)

## Objective
Write exactly 10 Playwright tests for cross-feature pairwise scenarios in `e2e/tests/tier3/cross-feature.spec.ts`.

## Context
The previous iteration was vetoed for three reasons:
1. It used dummy/facade implementations (assumed state via comments instead of setting it up).
2. It lacked exactly 10 distinct pairwise combinations (included duplicates and a 3-way test).
3. Locators were brittle (used CSS classes and `tr`).

You must strictly address all three issues. The application is NOT implemented yet, so your tests must simulate the backend by intercepting API requests and mocking time. The tests must pass conceptually, meaning if a frontend existed that connected to these mocked endpoints, the tests would pass.

## Strict Rules
1. **EXACTLY 10 Pairwise Tests:** Implement exactly the 10 scenarios below in `e2e/tests/tier3/cross-feature.spec.ts`. Do not add any 3-way tests.
2. **Deterministic Network Mocking:** You MUST use `await page.route(...)` to mock the JSON responses for the setup state in EVERY test. Do not assume the database is pre-seeded.
3. **Time Mocking:** For time-based scenarios, you MUST use `await page.clock.setFixedTime(...)` and `await page.clock.fastForward(...)` rather than assuming time passes.
4. **Robust Locators:** You MUST use accessibility locators (`page.getByRole`, `page.getByTestId`, `page.getByLabel`). DO NOT use CSS selectors (`.class`) or structural tags (`tr`, `table`).
5. Do NOT use `test.fixme()`.

## 10 Pairwise Scenarios to Implement
1. **[F1 x F2] Candidate Reg & KKM:** Use `page.route` to mock registration submission and return `kkm_passed: true, rank: 45`. Assert UI shows pass.
2. **[F1 x F3] Candidate Reg & Interview:** Mock successful registration. Mock an interview scheduling prompt. Assert candidate can click 'Book Interview'.
3. **[F1 x F4] Candidate Reg & AI Questions:** Mock registration flow to return a required `ai_assessment_url`. Assert candidate is redirected/shown the AI questions.
4. **[F1 x F5] Candidate Reg & Multi-Tier:** Mock an agency's unique link `/register?agency=XYZ`. Mock the API to confirm agency association. Assert the UI reflects the agency.
5. **[F2 x F3] KKM & Interview:** Mock candidate state as `kkm_passed: false`. HR views candidate. Assert the 'Schedule Interview' button is disabled/hidden.
6. **[F2 x F4] KKM & AI Questions:** Mock the submission of AI questions to return an updated KKM rank. Assert the UI updates to reflect the new rank.
7. **[F2 x F5] KKM & Multi-Tier:** Mock HR login as sub-tier. Mock `page.route` to return only candidate X. Assert Master account candidate Y is NOT visible using `expect().not.toBeVisible()`.
8. **[F3 x F4] Interview & AI Questions:** Mock HR confirming an interview schedule. Mock the API returning specific AI questions for that candidate. Assert the HR dashboard displays the questions.
9. **[F3 x F5] Interview & Multi-Tier:** Mock interview availability API to return isolated calendars. Ensure sub-tier A cannot see sub-tier B's slots.
10. **[F4 x F5] AI Questions & Multi-Tier:** Mock the API for fetching the AI Question pool for sub-tier A. Assert the specific customized questions are rendered.

MANDATORY INTEGRITY WARNING
> DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.
