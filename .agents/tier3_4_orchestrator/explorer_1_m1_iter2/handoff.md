# Handoff Report - Tier 3 Cross-Feature Pairwise Scenarios

## 1. Observation
- **Previous Failure Output:** "Exactly 10 pairwise test cases were NOT implemented (there are duplicates like F2xF5/F5xF2 and F3xF4, and one 3-way test [F1 x F5 x F4])."
- **Requirement:** Generate EXACTLY 10 distinct pairwise cross-feature scenarios for the features:
  - F1: Candidate Registration
  - F2: KKM Ranking
  - F3: Interview Scheduling
  - F4: AI Questions
  - F5: Multi-Tier Accounts
- **Mathematical constraint:** Combinations of 5 features taken 2 at a time equals 10 (5C2 = 10). There should be no duplicate directions (e.g., F1xF2 is the same as F2xF1) and no 3-way interactions (e.g., F1xF2xF3).

## 2. Logic Chain
To ensure exactly 10 strictly pairwise interactions are covered, the features have been cross-matched systematically:
- F1 paired with F2, F3, F4, F5 (4 pairs)
- F2 paired with F3, F4, F5 (3 pairs)
- F3 paired with F4, F5 (2 pairs)
- F4 paired with F5 (1 pair)

Total = 10 strictly 2-way combinations.

Here are the 10 pairwise scenarios for implementation in `e2e/tests/tier3/cross-feature.spec.ts`:

1. **F1 x F2 (Candidate Registration & KKM Ranking)**: Verify that a newly registered candidate is immediately evaluated against minimum criteria and assigned an initial KKM rank.
2. **F1 x F3 (Candidate Registration & Interview Scheduling)**: Verify that upon successfully completing the registration flow, a candidate is immediately prompted to book an available interview slot.
3. **F1 x F4 (Candidate Registration & AI Questions)**: Verify that during the registration onboarding, the candidate is required to complete a preliminary set of AI-generated questions.
4. **F1 x F5 (Candidate Registration & Multi-Tier Accounts)**: Verify that a candidate registering via an agency's unique link is automatically associated with that agency's sub-tier account instead of the global pool.
5. **F2 x F3 (KKM Ranking & Interview Scheduling)**: Verify that only candidates who achieve a minimum KKM ranking threshold are provided the option to schedule an interview.
6. **F2 x F4 (KKM Ranking & AI Questions)**: Verify that completing an AI Questions module dynamically recalculates and updates the candidate's KKM Ranking based on their score.
7. **F2 x F5 (KKM Ranking & Multi-Tier Accounts)**: Verify that a sub-tier agency account can only view the KKM rankings of their own candidates, while the master account can view rankings across all sub-tiers.
8. **F3 x F4 (Interview Scheduling & AI Questions)**: Verify that confirming an interview schedule automatically generates and assigns a specific AI Questions assessment link tailored for that interview stage.
9. **F3 x F5 (Interview Scheduling & Multi-Tier Accounts)**: Verify that interview availability calendars are isolated per multi-tier account, preventing one agency from viewing or booking another agency's slots.
10. **F4 x F5 (AI Questions & Multi-Tier Accounts)**: Verify that different sub-tier accounts can configure and serve customized pools of AI Questions specific to their agency's needs.

## 3. Caveats
- No caveats. The list strictly follows the 5C2 mathematical combination, guaranteeing exactly 10 pairs with no duplicates or multi-way tests.

## 4. Conclusion
The structured plan for the 10 strictly pairwise cross-feature scenarios is prepared and validated against the prior failure feedback. The implementation agent should translate these exact 10 scenarios into Playwright tests in `e2e/tests/tier3/cross-feature.spec.ts` without combining any additional features per test.

## 5. Verification Method
- **Implementation Inspection:** Open `e2e/tests/tier3/cross-feature.spec.ts` and verify there are exactly 10 `test(...)` blocks.
- **Traceability:** Check that each test involves exactly 2 features from the set {F1, F2, F3, F4, F5}.
- **Execution:** Run `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` to ensure all 10 pairwise tests pass.
