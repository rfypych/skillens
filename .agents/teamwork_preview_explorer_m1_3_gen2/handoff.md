# Handoff Report: Tier 3 Cross-Feature Combinations

## Observation
- The scope document (`SCOPE_TIER3_4.md`) and test infrastructure (`TEST_INFRA.md`) require writing ~10 Playwright tests for Tier 3, focusing on cross-feature pairwise scenarios.
- The 5 major features defined in `ORIGINAL_REQUEST.md` are:
  - **F1**: Candidate Registration & Files
  - **F2**: KKM Rank & Pass/Fail Status
  - **F3**: Interview Scheduling & Rules (e.g., 1-2 day minimum distance)
  - **F4**: AI Interview Questions & Scoring
  - **F5**: Multi-Tier Company Accounts & Job Limits (Main/Sub accounts, deadlines)
- **Constraint**: E2E tests must NOT mock the backend API or frontend HTML. Real requests and page interactions are mandatory. This contrasts with existing Tier 1 tests (e.g., `candidate-registration.spec.ts`) which use `page.route` to mock API responses.

## Logic Chain
1. To satisfy the "no mocking" constraint, the testing strategy must rely on a real backend environment. To keep tests fast and reliable, prerequisite state (creating a company, job, and candidate) should be seeded programmatically via Playwright's `APIRequestContext` (`request`), while the actual feature validation must be done via UI interactions.
2. Pairwise testing between the 5 features yields exactly 10 unique combinations (F1xF2, F1xF3, F1xF4, F1xF5, F2xF3, F2xF4, F2xF5, F3xF4, F3xF5, F4xF5). 
3. Based on these 10 pairs, I have designed 10 test scenarios that realistically cover the cross-feature boundaries.

## Proposed Strategy & Code Design
- **File Location**: `e2e/tests/tier3/cross-feature.spec.ts`
- **Setup Pattern**: Use `test.beforeEach` to create isolated entities (Company, Job, Candidate) using real backend API calls. This ensures test isolation without relying on mocks.
- **Execution**: The test body uses `page.locator()` and `page.click()` to perform UI workflows (e.g., HR clicking schedule, candidate submitting test).
- **Validation**: Assertions use `expect(page.getByText(...)).toBeVisible()` to confirm the UI reflects the real backend state.

### 10 Pairwise Test Descriptions
1. **F1 x F2 (Registration x KKM Rank)**
   *Scenario*: Candidate registers and submits the technical test.
   *Validation*: System computes their rank against the job's KKM threshold and updates their dashboard with pass/fail status in real-time, keeping their identity anonymous to others.
2. **F1 x F3 (Registration x Interview Scheduling)**
   *Scenario*: Candidate registers and passes KKM. HR schedules an interview.
   *Validation*: Candidate's dashboard receives the interview invitation, and the UI allows the candidate to accept or reject it.
3. **F1 x F4 (Registration x AI Questions)**
   *Scenario*: Candidate registers and takes the test. HR opens the interview panel.
   *Validation*: The AI-recommended questions generated in the HR dashboard correctly reference the candidate's specific test transcript and registration context.
4. **F1 x F5 (Registration x Multi-Tier Limits)**
   *Scenario*: A company Main Account sets a job posting deadline in the past.
   *Validation*: When a candidate attempts to register and apply for this job, the UI and API reject the application due to the expired deadline limit.
5. **F2 x F3 (KKM Rank x Interview Scheduling)**
   *Scenario*: Candidate fails the KKM threshold.
   *Validation*: HR dashboard disables or hides the "Schedule Interview" button for this candidate, preventing any scheduling action.
6. **F2 x F4 (KKM Rank x AI Scoring)**
   *Scenario*: Candidate passes KKM and completes the interview where HR inputs AI-based scores.
   *Validation*: The system correctly aggregates the initial KKM score and the post-interview points to produce an updated, final ranking.
7. **F2 x F5 (KKM Rank x Multi-Tier Accounts)**
   *Scenario*: A Sub-Account user logs into the HR dashboard.
   *Validation*: The Sub-Account can view KKM rankings and statuses, but the UI restricts them from modifying the KKM threshold (action reserved for Main Account).
8. **F3 x F4 (Interview Scheduling x AI Scoring)**
   *Scenario*: HR schedules an interview (enforcing >24hr rule). During the scheduled time, HR uses the AI questions.
   *Validation*: HR can submit points for the specific AI-recommended questions, verifying that the scheduling context and scoring are correctly linked to the candidate.
9. **F3 x F5 (Interview Scheduling x Multi-Tier Accounts)**
   *Scenario*: A Sub-Account user attempts to schedule an interview for a candidate.
   *Validation*: The Sub-Account is permitted to propose a schedule, but the system still correctly enforces the 1-2 day minimum distance validation on their action.
10. **F4 x F5 (AI Scoring x Multi-Tier Accounts)**
    *Scenario*: A Sub-Account submits the final post-interview scores based on AI questions.
    *Validation*: The score submission succeeds, and when the Main Account logs in, they see the exact same updated final ranking.

## Caveats
- Since these tests involve real API calls and database writes, they are susceptible to database state contamination if tests run in parallel against a single shared environment without proper unique ID generation per test.
- Features like "AI Interview Questions" (F4) rely on actual AI endpoints. If the AI service is slow or unpredictable, the test (F1 x F4) might be flaky. We may need to ensure the real AI endpoint responds deterministically in the test environment, or use a dedicated test AI model, as mocking is not allowed.

## Conclusion
The Tier 3 pairwise test suite is fully planned. Implementing these 10 tests in `e2e/tests/tier3/cross-feature.spec.ts` using programmatic API setup and real UI execution will fulfill all requirements for Milestone 1.

## Verification Method
- **Implementation check**: The implementer will create `e2e/tests/tier3/cross-feature.spec.ts`.
- **Validation check**: Search for `page.route` in the new file; it must NOT exist.
- **Run Tests**: Execute `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` against a live local development server to ensure tests pass without mocking.
