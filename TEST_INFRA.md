# E2E Test Infra: Skillens Recruitment Workflow

## Test Philosophy
- Opaque-box, requirement-driven. No dependency on implementation design.
- Methodology: Category-Partition + BVA + Pairwise + Workload Testing.

## Feature Inventory
| # | Feature | Source (requirement) | Tier 1 | Tier 2 | Tier 3 |
|---|---------|---------------------|:------:|:------:|:------:|
| 1 | Candidate Registration & Files | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 2 | KKM Rank & Pass/Fail Status | ORIGINAL_REQUEST §R1 | 5 | 5 | ✓ |
| 3 | Interview Scheduling (Rules) | ORIGINAL_REQUEST §R2 | 5 | 5 | ✓ |
| 4 | AI Interview Questions & Scoring | ORIGINAL_REQUEST §R3 | 5 | 5 | ✓ |
| 5 | Multi-Tier Accounts & Limits | ORIGINAL_REQUEST §R4 | 5 | 5 | ✓ |

## Test Architecture
- Test runner: `pytest` and `playwright` (Python-based Playwright) or `npx playwright test` (Node-based). We will use Playwright for Node.js (`tests/e2e`) since the frontend is Next.js. We can also make API calls directly from Playwright tests.
- Test case format: Automated E2E tests validating API responses and UI components.
- Directory layout: `tests/e2e/` (structured by tier: `tier1/`, `tier2/`, `tier3/`, `tier4/`).

## Real-World Application Scenarios (Tier 4)
| # | Scenario | Features Exercised | Complexity |
|---|----------|--------------------|------------|
| 1 | Happy Path: Apply -> Pass KKM -> Interview -> Score | 1, 2, 3, 4 | High |
| 2 | Rejection: Fail KKM -> No Interview | 1, 2, 3 | Medium |
| 3 | Job Expired: Apply after deadline -> Rejected | 1, 5 | Medium |
| 4 | Sub-Account Management: Sub-account workflow | 5, 3, 4 | Medium |
| 5 | AI Follow-ups: HR uses AI questions to score | 2, 4 | High |

## Coverage Thresholds
- Tier 1: ≥5 per feature (Total: 25)
- Tier 2: ≥5 per feature (Total: 25)
- Tier 3: pairwise coverage of major feature interactions (Total: ~10)
- Tier 4: ≥5 realistic application scenarios (Total: 5)
