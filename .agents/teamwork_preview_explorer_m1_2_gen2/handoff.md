# Handoff Report: Tier 3 E2E Test Planning

## Observation
- `SCOPE_TIER3_4.md` defines Tier 3 as writing ~10 Playwright tests for cross-feature pairwise scenarios, saving them as `e2e/tests/tier3/cross-feature.spec.ts`.
- `TEST_INFRA.md` lists 5 major features: (1) Candidate Registration & Files, (2) KKM Rank & Pass/Fail Status, (3) Interview Scheduling (Rules), (4) AI Interview Questions & Scoring, (5) Multi-Tier Accounts & Limits.
- Existing tests in `tier1/candidate-registration.spec.ts` heavily use API mocking (`page.route` to intercept and mock responses).
- The user constraints explicitly state: "E2E tests must NOT mock the backend API or frontend HTML. They must make real requests and use real page interactions."

## Logic Chain
1. To satisfy Tier 3 pairwise coverage of 5 features, we must test combinations of (F1, F2, F3, F4, F5). A full pairwise combination matrix for 5 features yields exactly 10 unique pairs (F1xF2, F1xF3, F1xF4, F1xF5, F2xF3, F2xF4, F2xF5, F3xF4, F3xF5, F4xF5).
2. Since tests cannot use mocks (unlike Tier 1), we must manage state using real application flows or real API requests (e.g., using Playwright's `request` context for backend seeding) to set up test preconditions.
3. The implementation should organize `cross-feature.spec.ts` with a `test.describe('Tier 3: Cross-Feature Interactions')` block containing 10 distinct `test()` definitions covering the matrix.
4. Each test must perform real UI interactions (filling forms, uploading files) and wait for real API responses (e.g., `page.waitForResponse`) to assert real database-driven UI updates.

## Caveats
- Since no mocking is allowed, the tests will be highly stateful. Robust setup/teardown (e.g., creating fresh users/companies per test via API) is required to prevent flakiness.
- Testing F3xF4 (Time-based scheduling unlocking AI tests) in a real E2E environment without mocking time might require the test to explicitly schedule the interview for the current immediate time block.
- Testing F5 (Account limits) requires seeding companies with specific subscription tiers via the real API before executing the UI steps.

## Conclusion
**Strategy:** Implement `e2e/tests/tier3/cross-feature.spec.ts` using real Playwright `request` calls for data seeding and real page interactions for the test bodies. No `page.route` mocking should be used.

**Proposed 10 Pairwise Tests:**
1. **F1 x F2 (Registration & KKM):** Candidate registers with high qualifications; the real backend processes the CV, resulting in a "Pass" KKM rank being dynamically rendered on the candidate dashboard.
2. **F1 x F3 (Registration & Scheduling):** Candidate completes registration and is automatically routed through the real DB-backed Interview Scheduling page to successfully select an available time slot.
3. **F1 x F4 (Registration & AI):** Candidate registers for a specific role; the AI module dynamically generates domain-specific questions in the interview UI matching the registration data.
4. **F1 x F5 (Registration & Limits):** Company reaches its Basic tier candidate limit; an attempt to register a new candidate via the UI is blocked with a real backend limit-exceeded error message.
5. **F2 x F3 (KKM & Scheduling):** Candidate with a "Fail" KKM rank is blocked from accessing the Interview Scheduling UI (button disabled or redirects to rejection page).
6. **F2 x F4 (KKM & AI):** Candidate's KKM score breakdown and AI interview score are correctly aggregated and displayed together on the real HR Candidate Review dashboard.
7. **F2 x F5 (KKM & Limits):** Basic tier HR user attempts to access advanced KKM insights/analytics but is presented with a premium upgrade lock enforcing real tier limits.
8. **F3 x F4 (Scheduling & AI):** Candidate schedules an interview; the test verifies that the AI interview session unlocks exactly at the scheduled time slot (using immediate real-time scheduling).
9. **F3 x F5 (Scheduling & Limits):** Premium tier HR user successfully configures custom interview scheduling rules (e.g., weekend slots), which are successfully fetched and displayed to candidates.
10. **F4 x F5 (AI & Limits):** Basic tier HR user attempts to customize the AI interview prompt via the UI but is restricted by tier limits, enforcing standard questions.

## Verification Method
- Inspect the generated `e2e/tests/tier3/cross-feature.spec.ts` to ensure it contains these exactly 10 `test` blocks.
- Search `cross-feature.spec.ts` for `page.route` or `route.fulfill`. None should be present, verifying the "no mock" constraint.
- Run `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` (once implemented) to verify it executes against the real backend without mock interception.
