# BRIEFING — 2026-07-14T22:46:25+07:00

## Mission
Investigate and plan the implementation for Milestone 1: "Write ≥5 Playwright tests for Candidate Registration boundary cases (max size, invalid formats)."

## 🔒 My Identity
- Archetype: Explorer
- Roles: Read-only investigation, analyze problems, synthesize findings, produce structured reports
- Working directory: d:/projects/JHIC-rev/.agents/teamwork_preview_explorer_tier2_m1_1
- Original parent: bf03e4d4-3ef4-4cc0-856b-f296475344df (main agent)
- Milestone: Milestone 1 of Tier 2 E2E testing

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- E2E tests must NOT mock the backend API or frontend HTML
- Must make real requests and use real page interactions (black-box testing)
- Recommend a fix strategy and write report to handoff.md in working directory
- Do NOT implement the code. Report back to caller when done.

## Current Parent
- Conversation ID: bf03e4d4-3ef4-4cc0-856b-f296475344df
- Updated: 2026-07-14T22:46:25+07:00

## Investigation State
- **Explored paths**: `e2e/tests/tier1/candidate-registration.spec.ts`, `e2e/dummy-server.js`, `frontend/src/app/candidate/apply/[job_id]/page.tsx`, `backend/routers/assessment.py`, `backend/services/assessment_service.py`
- **Key findings**: Real candidate application involves `/candidate/apply/[job_id]` hitting `/api/assessment/{job_id}/apply`. Boundaries found in backend: >5MB, not .pdf, missing guest name/email, expired job deadline.
- **Unexplored areas**: None, the implementation strategy is fully defined.

## Key Decisions Made
- Define the 5 tests: Happy Path (Valid PDF), Max Size (>5MB), Invalid Format (Non-PDF), Missing Fields, Expired Job.
- Require seeding jobs via API in `beforeAll` to test the real frontend properly without `dummy-server.js` or `page.route` mocks.

## Artifact Index
- handoff.md — Final investigation and planning report
