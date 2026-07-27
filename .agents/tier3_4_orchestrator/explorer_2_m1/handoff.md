# Handoff Report: Tier 3 Cross-Feature Pairwise Scenarios

## 1. Observation
- Analyzed `ORIGINAL_REQUEST.md` which defines 5 core features:
  - F1: Candidate Registration & Files
  - F2: KKM Rank & Pass/Fail Status (including real-time updates)
  - F3: Interview Scheduling (Quotas, 1-2 day minimum distance, accept/reject)
  - F4: AI Interview Questions & Scoring (Finalizing rankings)
  - F5: Multi-Tier Accounts (Main vs. Sub-accounts, Job deadlines)
- Analyzed `TEST_INFRA.md` which specifies that Tier 3 requires `~10 Playwright tests for cross-feature pairwise scenarios` to be saved in `e2e/tests/tier3/cross-feature.spec.ts`.
- The prompt explicitly asks to identify critical edge cases and failure modes in feature interactions (e.g., Sub-account trying to schedule an interview, candidate registering after KKM calculation, etc.).

## 2. Logic Chain
To achieve pairwise coverage, we combine features to expose edge cases where correct behavior in one feature might lead to a failure in another. Here are the 10 pairwise scenarios the Worker must implement:

1. **[F1 (Reg) & F5 (Accounts)] Job Deadline Enforcement:** Main Account sets a job deadline. Candidate attempts to register 1 second after the deadline via API. *Failure Mode Check:* System must reject the registration, overriding normal registration flows.
2. **[F2 (KKM) & F5 (Accounts)] KKM Modification Permissions:** Sub-account (member) attempts to modify the KKM passing threshold via API/UI. *Failure Mode Check:* System must deny this as an Admin-restricted action (403 Forbidden).
3. **[F2 (KKM) & F3 (Scheduling)] Interviewing Failed Candidates:** HR tries to schedule an interview for a candidate who did not meet the KKM threshold. *Failure Mode Check:* System must block the scheduling attempt since only KKM-passing candidates are eligible.
4. **[F3 (Scheduling) & F5 (Accounts)] Sub-account vs. HR Quotas:** Main Account sets a strict HR quota for interviews. Sub-account tries to schedule interviews exceeding this quota. *Failure Mode Check:* System must enforce the quota regardless of which account is scheduling.
5. **[F3 (Scheduling) & F4 (AI Scoring)] Premature Post-Interview Scoring:** HR attempts to submit post-interview scores for a candidate who rejected the proposed interview date, or before the interview date has even occurred. *Failure Mode Check:* System must reject the score submission.
6. **[F1 (Reg) & F2 (KKM)] Real-time Rank Displacement:** Candidate A is at the exact cutoff rank for passing KKM. Candidate B registers, tests, and scores higher than Candidate A, pushing A below the KKM threshold. *Failure Mode Check:* Candidate A's UI must immediately reflect a change from "Pass" to "Fail".
7. **[F1 (Reg) & F3 (Scheduling)] Identity vs. Interview Acceptance:** Candidate A attempts to accept an interview schedule belonging to Candidate B (via API manipulation). *Failure Mode Check:* System must enforce authorization and block cross-candidate acceptances.
8. **[F3 (Scheduling) & F1 (Reg)] Acceptance Time Window Expiration:** Candidate receives an interview proposal 2 days away. They wait and click "accept" when the proposed time is now only 12 hours away. *Failure Mode Check:* The system must reject the acceptance because it now violates the 1-2 day minimum distance rule, prompting for a reschedule.
9. **[F4 (AI Scoring) & F5 (Accounts)] Sub-account Finalizing Rankings:** Sub-account submits post-interview scores and attempts to "finalize rankings." *Failure Mode Check:* System should allow scoring but must test whether "finalizing" a job is an Admin-only action (if so, block it).
10. **[F2 (KKM) & F4 (AI Scoring)] Final Rank Scope Isolation:** HR assigns final points. *Failure Mode Check:* The final ranking should only sort the pool of candidates who passed the initial KKM and attended the interview, without retroactively marking them as failing the KKM phase.

## 3. Caveats
- The exact permission boundaries between Main Accounts and Sub-accounts for specific actions (like changing KKM or finalizing rankings) are not exhaustively detailed in the requirements. The tests assume sensible defaults (e.g., KKM config is Admin-only, but Sub-accounts can conduct interviews and score them).
- The definition of KKM implies a rank-based threshold ("Rank 1-90 passes, others fail") which can be volatile in real-time as new candidates take the test. Scenario 6 explicitly tests this volatility.

## 4. Conclusion
10 distinct pairwise cross-feature scenarios have been defined, focusing on permissions, state invalidations, and timing edge cases. The Worker should implement these in `e2e/tests/tier3/cross-feature.spec.ts` using Playwright, simulating both UI interactions and API-level assertions.

## 5. Verification Method
The Worker will:
1. Create `e2e/tests/tier3/cross-feature.spec.ts`.
2. Implement the 10 scenarios described above.
3. Run `npx playwright test e2e/tests/tier3/cross-feature.spec.ts` (or the equivalent test command) to ensure they are parsed and correctly written.
4. Verify that the tests mock or hit the backend in a way that accurately covers these edge cases.
