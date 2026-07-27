# Scope: Multi-Tier Accounts & Job Limits

## Architecture
- Backend: FastAPI (routers, models, schemas), SQLAlchemy (SQLite).
- Frontend: Next.js (pages/components).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Multi-Tier Accounts & Job Limits | Backend: Sub-account creation logic, parent-child (admin/recruiter) permissions, Job posting deadline enforcement. Frontend: UI for managing sub-accounts and setting job deadlines. | none | IN_PROGRESS |

## Interface Contracts
### Backend ↔ Frontend
- Sub-account creation: `POST /api/users/sub-accounts` (requires parent admin role).
- Job deadlines: `POST /api/jobs` and `PUT /api/jobs/{id}` accept a `deadline` field. Jobs with past deadlines are visually marked or inactive.
