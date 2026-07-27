# Original User Request

## Initial Request — 2026-07-13T14:58:12Z

Build a comprehensive end-to-end recruitment workflow for Skillens that handles full-stack candidate registration, AI-driven testing, automated ranking against a passing threshold (KKM), interview scheduling, and a multi-tier company account system.

Working directory: d:/projects/JHIC-rev
Integrity mode: development

## Requirements

### R1. Candidate Registration & Real-time Tracking
Implement the full-stack flow for applicants to upload personal data, CV, and certificates to register. Candidates receive in-app notifications to take the test. The system must automatically rank candidates against a configurable passing threshold (KKM) and display their anonymous rank (e.g., Rank 1-90 passes, others fail) and pass/fail status in real-time.

### R2. Interview Scheduling & AI Recommendations
Candidates who pass the KKM wait for an interview schedule. The system recommends candidates based on HR quotas. Candidates can accept or reject the proposed interview session via the UI (the system must enforce a 1-2 day minimum distance for the invitation).

### R3. AI Interview Question Recommendations
During the interview phase, the HR dashboard must display AI-recommended follow-up questions derived from analyzing the candidate's actual answers and problem-solving process during the technical test. After the interview, HR assigns points to finalize rankings.

### R4. Multi-Tier Company Accounts & Job Limits
Implement a multi-account structure where one Company (PT) has a "Main Account" (Admin) that can add and manage access for sub-accounts (members). Job postings must enforce a configurable time limit (deadline) for accepting applicants.

## Acceptance Criteria

### Candidate Flow Verification
- [ ] Backend API test passes confirming candidates can register and attach multiple document metadata (CV, certificates).
- [ ] UI component renders the candidate's anonymous rank and pass/fail status without revealing other candidates' identities.
- [ ] System automatically rejects interview scheduling if the proposed date is less than 1-2 days from the current date.

### HR / Recruiter Flow Verification
- [ ] HR dashboard UI accurately reflects real-time status changes of applicants based on backend state.
- [ ] Job postings automatically reject new applications if the current time exceeds the configured time limit.
- [ ] A programmatic test verifies the AI integration generates specific interview questions based on a mock test chat transcript.
- [ ] HR UI provides an interface to submit post-interview scores, successfully updating the final ranking in the database.

### Account Management Verification
- [ ] Database schema and API endpoints support parent-child relationships for user accounts.
- [ ] A test verifies that Main Accounts can create Sub-Accounts, and Sub-Accounts cannot perform Admin-restricted actions.
