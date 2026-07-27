# Milestone 1: Tier 3 Cross-Feature Combinations Implementation Plan

## Objective
Write ~10 Playwright tests for cross-feature pairwise scenarios. Save as `e2e/tests/tier3/cross-feature.spec.ts`.

## Context
There is NO frontend or backend implemented yet. Your job is to write the Playwright tests that cover the requirements. Focus on valid test creation (compilable TypeScript, correct Playwright syntax) and requirement coverage. Use semantic locators (e.g. `getByRole`, `getByText`) and assume a standard UI structure.

## Test Scenarios to Implement
Implement exactly these 10 pairwise test cases in a `test.describe('Tier 3: Cross-Feature Combinations', () => { ... })` block.

1. **[F1 x F5] Job Deadline Enforcement**: Main Account sets a job deadline. Candidate attempts to register 1 second after the deadline. System must reject the registration form submission.
2. **[F2 x F5] KKM Modification Permissions**: Sub-account (member) attempts to modify the KKM passing threshold. System must deny this as an Admin-restricted action.
3. **[F2 x F3] Interviewing Failed Candidates**: HR tries to schedule an interview for a candidate who did not meet the KKM threshold. System must block the scheduling attempt (e.g., button disabled or error message).
4. **[F3 x F5] Sub-account vs. HR Quotas**: Main Account sets a strict HR quota for interviews. Sub-account tries to schedule interviews exceeding this quota. System must enforce the quota.
5. **[F3 x F4] Premature Post-Interview Scoring**: HR attempts to submit post-interview scores for a candidate who rejected the proposed interview date, or before the interview date has even occurred. System must reject the score submission.
6. **[F1 x F2] Real-time Rank Displacement**: Candidate A is at the exact cutoff rank for passing KKM. Candidate B registers, tests, and scores higher than Candidate A, pushing A below the KKM threshold. Candidate A's UI must immediately reflect a change from "Pass" to "Fail".
7. **[F1 x F3] Acceptance Time Window Expiration**: Candidate receives an interview proposal 2 days away. They wait and click "accept" when the proposed time is now only 12 hours away. The system must reject the acceptance because it now violates the 1-2 day minimum distance rule, prompting for a reschedule.
8. **[F5 x F2] Main Account views Sub-account's dashboard**: Main Account views Sub-account's dashboard. UI successfully fetches and displays candidate rankings for sub-account's jobs.
9. **[F3 x F4] Interview Status vs. AI Question Generation**: Candidate accepts the proposed interview. HR opens the active interview view on the dashboard. The system successfully surfaces AI-recommended follow-up questions generated from the candidate's earlier registration test responses.
10. **[F1 x F5 x F4] Complete Main Account E2E Finalization**: Sub-Account scored candidate. Main Account HR views the final board. Main Account can review the final score entered by the Sub-Account and finalize the job closure.

## Implementation Details
- Use `import { test, expect } from '@playwright/test';`
- Make sure to add `test.fixme()` or just standard `test()` - wait, since it's an unimplemented app, you can just use `test()`, we won't run them to pass, just to exist. Actually, the Reviewer might run `npx playwright test`, so if they fail, the gate will fail. 
Wait, the instruction says: "Focus on valid test creation and requirement coverage, not on passing against an unimplemented app."
So the gate pass criteria "1. Build and tests pass." applies to whether the test code compiles (e.g., `npx tsc` or `npx playwright test --dry-run`). It does NOT mean the Playwright tests must pass against the app, because the app doesn't exist.
To make it clear, do not use `test.fixme()`. Just write the tests. The orchestrator will not require Playwright tests to pass for testing tracks.

Save the file at `e2e/tests/tier3/cross-feature.spec.ts`.

MANDATORY INTEGRITY WARNING
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. A Forensic Auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.
