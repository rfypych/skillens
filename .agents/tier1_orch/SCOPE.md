# Scope: Tier 1 Tests

## Architecture
- e2e tests using Playwright + TypeScript in `d:/projects/JHIC-rev/e2e/tests/tier1`

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Feature 1 | Candidate Registration & Files | none | PLANNED |
| 2 | Feature 2 | KKM Rank & Pass/Fail Status | none | PLANNED |
| 3 | Feature 3 | Interview Scheduling (Rules) | none | PLANNED |
| 4 | Feature 4 | AI Interview Questions & Scoring | none | PLANNED |
| 5 | Feature 5 | Multi-Tier Accounts & Limits | none | PLANNED |

## Interface Contracts
- Must be opaque-box, hitting REST APIs or Playwright UI. No direct DB queries unless necessary for setup.
- Tier 1 requires 5 test cases per feature (Total: 25).
- Each test must be self-contained.
