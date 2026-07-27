# Scope: Milestone 2 (Candidate Registration & KKM Tracking)

## Architecture
- Backend extends models to include Candidates, Applications (or linked to Jobs), Documents (CV, Certificates), KKM parameters in Jobs.
- Services added for auto-ranking applications based on KKM.
- Frontend includes Candidate Registration UI, Job Application UI (real-time status, anonymous rank), in-app notifications.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M2 Iteration | Backend: Candidate profile, Docs, KKM config in jobs, auto-ranking. Frontend: Registration, rank UI, notifications. | none | PLANNED |

## Interface Contracts
### Candidate API
- POST /api/candidates/register - Register a candidate profile
- POST /api/candidates/upload - Upload documents
- GET /api/candidates/applications - Get real-time status and anonymous rank
### Job API (updates)
- Include KKM config in Job schema
- Auto-calculate rank when a candidate applies
