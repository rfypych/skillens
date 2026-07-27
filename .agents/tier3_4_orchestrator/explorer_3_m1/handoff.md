# Handoff Report: Tier 3 Cross-Feature Combinations

**Observation**
- `ORIGINAL_REQUEST.md` identifies 5 main features (F1: Candidate Reg, F2: KKM Rank, F3: Interview Scheduling, F4: AI Questions/HR Score, F5: Multi-Tier Accounts & Limits).
- `TEST_INFRA.md` specifies Tier 3 requires ~10 Playwright tests for cross-feature pairwise scenarios, saved in `e2e/tests/tier3/cross-feature.spec.ts`.
- The `e2e` directory contains Playwright configuration, but the backend is not yet implemented (no real endpoints exist). Playwright tests must mock network interactions.

**Logic Chain**
- Since there is no real backend, Playwright must use `page.route('**/api/*', route => ...)` to intercept network requests and return mock JSON responses. This tests the frontend's logic for requirement coverage independently of the backend.
- To achieve pairwise coverage of F1-F5, we define the following 10 interactions:
  1. **F1 x F2**: Candidate registers & passes KKM -> UI displays Rank & "Pass".
  2. **F1 x F2**: Candidate registers & fails KKM -> UI displays "Fail", blocks interview.
  3. **F2 x F3**: Candidate passes KKM -> System recommends interview, UI enforces 1-2 day gap validation on accept/reject.
  4. **F3 x F4**: Interview completed -> HR Dashboard fetches and displays AI-recommended follow-up questions.
  5. **F4 x F2**: HR submits post-interview score -> UI re-fetches and displays updated final rank.
  6. **F5 x F1**: Job deadline has passed (managed by Multi-tier account) -> Candidate registration form is locked/disabled.
  7. **F5 x F1**: Sub-account manages active job -> Candidate successfully registers.
  8. **F5 x F3**: Sub-account schedules interview -> UI enforces same 1-2 day constraint for sub-account as admin.
  9. **F5 x F2**: Main Account views Sub-account's dashboard -> UI successfully fetches and displays candidate rankings for sub-account's jobs.
  10. **F5 x F4**: Sub-account views interview -> UI successfully fetches and displays AI questions for scoring.
- The test environment strategy requires abstracting the mock data into Playwright fixtures or helper functions (e.g., `mockCandidateProfile()`, `mockKKMResponse(score)`) to avoid duplicating setup across 10 tests.

**Caveats**
- The exact API routes (e.g., `/api/candidates`, `/api/jobs`) and JSON schemas are assumed. They will need to be aligned once the backend API design is finalized.
- Because we are strictly doing opaque-box testing, any frontend implementation changes might break selectors if they aren't data-testid based. Tests should rely on robust locators (`getByRole`, `getByTestId`).

**Conclusion**
We are ready to write `e2e/tests/tier3/cross-feature.spec.ts`. The implementation should consist of a Playwright `test.describe('Tier 3: Cross-Feature Combinations', ...)` block containing the 10 pairwise test cases identified above, using `page.route` to mock all backend dependencies.

**Verification Method**
1. Run `npx playwright test tests/tier3/cross-feature.spec.ts` from the `e2e/` directory.
2. Verify all 10 tests pass based on the mocked API intercepts and frontend UI assertions.
