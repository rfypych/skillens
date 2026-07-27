# Tier 3 Cross-Feature Combinations: Playwright Test Plan

## 1. Observation
- `ORIGINAL_REQUEST.md` details 5 primary features (R1-R4): (1) Candidate Registration, (2) KKM Ranking, (3) Interview Scheduling, (4) AI Questions & Scoring, (5) Multi-Tier Accounts & Limits.
- `TEST_INFRA.md` specifies that "Tier 3: pairwise coverage of major feature interactions" requires "~10 Playwright tests for cross-feature pairwise scenarios" to be saved as `e2e/tests/tier3/cross-feature.spec.ts`.

## 2. Logic Chain
To achieve optimal pairwise coverage without getting bogged down in standalone tests (which belong in Tier 1/2), the test plan must combine features to simulate boundary interactions. I have synthesized 10 scenarios that intersect at least two separate sub-systems:

**Scenario 1: Registration vs. Job Deadline (F1 x F5)**
- **Setup:** A Main Account configures a Job Posting with an expired deadline.
- **Action:** Candidate attempts to register and submit documents.
- **Expected:** Registration is blocked/rejected gracefully.

**Scenario 2: Registration vs. KKM Ranking (F1 x F2)**
- **Setup:** Active Job Posting.
- **Action:** Candidate submits registration with answers that fall below the KKM threshold.
- **Expected:** The system immediately flags the candidate as 'Fail' in real-time. The candidate's anonymous rank reflects the failure and no interview paths are shown.

**Scenario 3: KKM Ranking vs. Interview Scheduling Rules (F2 x F3)**
- **Setup:** Candidate successfully passes the KKM threshold.
- **Action:** HR attempts to schedule an interview exactly 12 hours from the current time.
- **Expected:** System blocks the proposal since the rule enforces a 1-2 day minimum distance.

**Scenario 4: Multi-Tier Accounts vs. Interview Scheduling (F5 x F3)**
- **Setup:** Candidate passed KKM. Main Account assigns job access to a Sub-Account.
- **Action:** Sub-Account HR logs in and proposes a valid interview date (3 days away).
- **Expected:** Schedule is proposed successfully, candidate is notified, proving Sub-Account permissions for scheduling.

**Scenario 5: Interview Scheduling vs. Candidate Response (F3 x F1)**
- **Setup:** Valid interview proposed by HR.
- **Action:** Candidate logs in, views the schedule, and rejects/reschedules it.
- **Expected:** The HR dashboard instantly updates the candidate's interview status without requiring HR to take manual action first.

**Scenario 6: Multi-Tier Accounts vs. KKM Visibility (F5 x F2)**
- **Setup:** Multiple candidates applied (some pass, some fail).
- **Action:** Sub-Account HR views the candidate board.
- **Expected:** Sub-Account HR can see the ranks and pass/fail states but candidate identities remain anonymous (per the request).

**Scenario 7: Interview Status vs. AI Question Generation (F3 x F4)**
- **Setup:** Candidate accepts the proposed interview.
- **Action:** HR opens the active interview view on the dashboard.
- **Expected:** The system successfully surfaces AI-recommended follow-up questions generated from the candidate's earlier registration test responses.

**Scenario 8: Failed KKM vs. AI Questions (F2 x F4)**
- **Setup:** Candidate fails KKM.
- **Action:** HR attempts to access the AI interview questions for this candidate.
- **Expected:** System prevents access or shows an error, as the candidate never reached the interview phase.

**Scenario 9: Multi-Tier Accounts vs. Interview Scoring (F5 x F4)**
- **Setup:** Active interview phase for a passed candidate.
- **Action:** Sub-Account HR completes the interview and assigns a final score.
- **Expected:** The score is accepted and the final candidate ranking is recalculated and updated on the dashboard.

**Scenario 10: Complete Main Account E2E Finalization (F1 x F5 x F4)**
- **Setup:** Sub-Account scored candidate.
- **Action:** Main Account HR views the final board.
- **Expected:** Main Account can review the final score entered by the Sub-Account and finalize the job closure (if limits are met), verifying parent-child data visibility.

## 3. Caveats
- Precise UI locators, component IDs, and API endpoints are not detailed in the requirements and will need to be discovered or mocked by the Implementer.
- Playwright should be configured to run these as an opaque-box test, interacting with the application precisely as a user would.
- Mocking might be required for the AI backend to prevent brittle tests and slow execution, unless a dedicated test-mode API is available.

## 4. Conclusion
The 10 specified pairwise scenarios effectively bridge the 5 core features in `ORIGINAL_REQUEST.md` as required by `TEST_INFRA.md`. The Worker should translate these 10 scenarios into `cross-feature.spec.ts` to fulfill Milestone 1.

## 5. Verification Method
1. Review `e2e/tests/tier3/cross-feature.spec.ts` to ensure it contains exactly or approximately 10 test cases corresponding to these scenarios.
2. Execute the tests using `npx playwright test e2e/tests/tier3/cross-feature.spec.ts`.
3. The tests must pass, proving the interplay between boundaries (e.g. Sub-accounts scheduling interviews, KKM failures blocking AI question access, etc.).
