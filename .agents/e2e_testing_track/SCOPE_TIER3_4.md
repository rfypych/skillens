# Scope: Tier 3 & Tier 4 Tests

## Architecture
- Playwright + TypeScript test suite in `d:/projects/JHIC-rev/e2e`.
- Tier 3: pairwise coverage of major feature interactions.
- Tier 4: realistic application scenarios.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Tier 3: Cross-Feature Combinations | Write ~10 Playwright tests for cross-feature pairwise scenarios. Save as `e2e/tests/tier3/cross-feature.spec.ts`. | none | PLANNED |
| 2 | Tier 4: Real-World Scenario 1 | Happy Path: Apply -> Pass KKM -> Interview -> Score. Save as `e2e/tests/tier4/scenario-happy-path.spec.ts`. | none | PLANNED |
| 3 | Tier 4: Real-World Scenario 2 | Rejection: Fail KKM -> No Interview. Save as `e2e/tests/tier4/scenario-rejection.spec.ts`. | none | PLANNED |
| 4 | Tier 4: Real-World Scenario 3 | Job Expired: Apply after deadline -> Rejected. Save as `e2e/tests/tier4/scenario-expired.spec.ts`. | none | PLANNED |
| 5 | Tier 4: Real-World Scenario 4 | Sub-Account Management & Interviewing. Save as `e2e/tests/tier4/scenario-sub-account.spec.ts`. | none | PLANNED |
| 6 | Tier 4: Real-World Scenario 5 | AI Follow-ups & HR adjustment. Save as `e2e/tests/tier4/scenario-ai-hr.spec.ts`. | none | PLANNED |
