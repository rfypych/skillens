# Scope: Tier 2 Tests

## Architecture
- Playwright + TypeScript test suite in `d:/projects/JHIC-rev/e2e`.
- Opaque-box E2E tests focusing on boundary conditions and corner cases.
- ≥5 test cases per feature.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Feature 1: Candidate Registration | Write ≥5 Playwright tests for Candidate Registration boundary cases (max size, invalid formats). Save as `e2e/tests/tier2/candidate-registration-boundary.spec.ts`. | none | IN_PROGRESS |
| 2 | Feature 2: KKM Rank | Write ≥5 Playwright tests for KKM Rank boundary cases (exact KKM score, 0 score). Save as `e2e/tests/tier2/kkm-rank-boundary.spec.ts`. | none | PLANNED |
| 3 | Feature 3: Interview Scheduling | Write ≥5 Playwright tests for Interview Scheduling boundary cases (exactly 1 day distance, <1 day rejection). Save as `e2e/tests/tier2/interview-scheduling-boundary.spec.ts`. | none | PLANNED |
| 4 | Feature 4: AI Questions & Scoring | Write ≥5 Playwright tests for AI Interview Scoring boundaries (min/max points). Save as `e2e/tests/tier2/ai-scoring-boundary.spec.ts`. | none | PLANNED |
| 5 | Feature 5: Multi-Tier Accounts | Write ≥5 Playwright tests for Multi-Tier Accounts & Limits boundaries (deadline exactly now). Save as `e2e/tests/tier2/multi-tier-accounts-boundary.spec.ts`. | none | PLANNED |
