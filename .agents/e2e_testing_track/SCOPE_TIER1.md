# Scope: Tier 1 Tests

## Architecture
- Playwright + TypeScript test suite in `d:/projects/JHIC-rev/e2e`.
- Opaque-box E2E tests focusing on happy-path feature coverage.
- ≥5 test cases per feature.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Feature 1: Candidate Registration | Write ≥5 Playwright tests for Candidate Registration & Files. Save as `e2e/tests/tier1/candidate-registration.spec.ts`. | none | PLANNED |
| 2 | Feature 2: KKM Rank | Write ≥5 Playwright tests for KKM Rank & Pass/Fail Status. Save as `e2e/tests/tier1/kkm-rank.spec.ts`. | none | PLANNED |
| 3 | Feature 3: Interview Scheduling | Write ≥5 Playwright tests for Interview Scheduling rules (1-2 day distance, Accept/Reject). Save as `e2e/tests/tier1/interview-scheduling.spec.ts`. | none | PLANNED |
| 4 | Feature 4: AI Questions & Scoring | Write ≥5 Playwright tests for AI Interview Questions & Final Scoring. Save as `e2e/tests/tier1/ai-scoring.spec.ts`. | none | PLANNED |
| 5 | Feature 5: Multi-Tier Accounts | Write ≥5 Playwright tests for Multi-Tier Company Accounts & Job Posting Limits. Save as `e2e/tests/tier1/multi-tier-accounts.spec.ts`. | none | PLANNED |

## Interface Contracts
- Tests must use standard Playwright assertions.
- Do NOT test implementation internals; mock/stub if external services (like AI) are needed, or assume backend mock endpoints for tests if needed, but since it's E2E, prefer hitting the API. Wait, actually, E2E should test the application running. We just write the tests assuming the endpoints and UI elements described in the specs.
- E2E Tests use `http://localhost:3000` (Frontend) and `http://localhost:8000` (Backend).
