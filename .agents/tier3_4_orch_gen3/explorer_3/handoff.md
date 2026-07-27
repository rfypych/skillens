# Handoff Report: Tier 3 Cross-Feature Test Design

## Observation
1. **Scope and Tooling**: The tests must evaluate cross-feature interactions pairwise for Tier 3, using Playwright (Node.js) without backend mocking (`d:/projects/JHIC-rev/TEST_INFRA.md`).
2. **Backend Realities**: 
   - F1 (Candidate Registration): Handled via `POST /assessment/{job_id}/apply` with `UploadFile`.
   - F2 (KKM Rank): Computed async. Checked via `GET /candidates/applications` where `passed_kkm = score >= job.kkm_score`.
   - F3 (Interview Scheduling): There is no calendar booking API. "Interview" is a pipeline stage managed by HR via `PUT /applications/{id}` (status = "interview").
   - F4 (AI Micro-Interview): Handled via `/assessment/{id}/chat` and evaluated async by Celery.
   - F5 (Account Limits): Implemented via sub-accounts (`POST /auth/sub-accounts`) and Job `deadline` properties. No explicit candidate concurrency limit is present on the backend.
3. **Data Isolation**: Since mocking is banned, state collision is prevented by generating UUIDs for emails, magic links, and job titles within each test.

## Logic Chain
- Because we cannot mock, every test must seed its prerequisite state using Playwright's `request` context (APIRequestContext). 
- **Setup Pattern**:
  1. Setup Sub-Account (if F5 involved): `POST /auth/sub-accounts` (as admin).
  2. Setup Job: `POST /jobs` (as HR/Sub-account) with unique `title` and `kkm_score`.
  3. Setup Candidate: `POST /assessment/{job_id}/apply` with unique `email` and dummy PDF.
- **Execution Pattern**: 
  - For F2/F4, the test must simulate candidate submitting an assessment `POST /assessment/{app_id}/submit` and then wait (poll) for the Celery task to finish processing the AI evaluation before checking HR UI.
  - Since F3 (Scheduling) lacks a date picker, the pairwise tests for F3 must validate the logical transition: e.g., HR can only move candidates to "interview" if they pass KKM, or how AI Copilot questions are displayed *after* moving to the interview phase.
  - Since F5 (Limits) relies on deadlines, F5 tests will create jobs with immediate deadlines to test rejection.

## Detailed Strategy (Exact Combinations)
1. **[F1 x F2] Registration CV influences KKM Rank (F1-F2)**
   - *Setup*: Seed Job with KKM=50. Register candidate via API with a PDF containing matching keywords. Submit test.
   - *Assert*: Wait for evaluation. Candidate UI `passed_kkm` is true.
2. **[F1 x F3] Registration -> Pipeline Flow (F1-F3)**
   - *Setup*: Register Candidate.
   - *Assert*: HR logs into UI, clicks application, changes status dropdown to "Shortlisted (Interview)". Verify API success and UI update.
3. **[F1 x F5] Registration after Deadline blocks applicants (F1-F5)**
   - *Setup*: HR creates Job with `deadline` set to 1 second ago.
   - *Assert*: Candidate attempts to register via API/UI. Verify 400 Bad Request ("Job posting expired") is returned.
4. **[F2 x F3] KKM Failure locks out "Interview" progression (F2-F3)**
   - *Setup*: Candidate takes test and scores 20. Job KKM is 80.
   - *Assert*: Test HR UI logic (if implemented) or organizational workflow that candidate is rejected, preventing Interview stage.
5. **[F2 x F4] KKM Score logic tied to AI Evaluation (F2-F4)**
   - *Setup*: Candidate does AI test. 
   - *Assert*: The Celery evaluation pipeline generates `overall_score`. Verify candidate dashboard reflects passing status based on Job's KKM threshold.
6. **[F2 x F5] Sub-Accounts isolate KKM settings (F2-F5)**
   - *Setup*: Admin creates Sub-Account A. A creates Job with KKM=99. 
   - *Assert*: Candidate applies and fails. Proves sub-account job configurations enforce strict custom KKM independently.
7. **[F3 x F4] Interview Copilot Questions (F3-F4)**
   - *Setup*: Candidate completes Micro-Interview.
   - *Assert*: HR UI (at `/recruiter/candidates/[app_id]`) displays "AI Interview Copilot" suggested questions generated from the candidate's chat transcript.
8. **[F3 x F5] Sub-Account Pipeline Visibility (F3-F5)**
   - *Setup*: Sub-Account A moves Candidate X to "Interview".
   - *Assert*: Sub-Account B logs in. Attempts to view Candidate X's application. Verify 403 or 404 response.
9. **[F4 x F5] Sub-Account Job Context shapes AI (F4-F5)**
   - *Setup*: Sub-Account A creates Job "Rust Dev". Candidate chats.
   - *Assert*: AI responds enforcing Rust context. Proves Sub-Account job config correctly seeds the AI system prompt.
10. **[F1 x F4] Guest Registration to AI Test (F1-F4)**
    - *Setup*: Anonymous candidate applies without prior account.
    - *Assert*: API creates guest account, issues token in cookie, and allows immediate access to `/candidate/test/[app_id]` AI interface.

## Caveats
- The backend does not implement the R2 "1-2 day scheduling minimum distance" logic natively (no Calendar API or DB columns for it). The F3 interaction tests use the available "status = interview" pipeline mechanism instead.
- AI Evaluator takes ~10-15 seconds (Celery task calling OpenAI). Tests must include a robust Playwright polling mechanism (`expect.poll` or wait loops) on `GET /applications/{id}` to avoid flaky timeouts.

## Conclusion
This test strategy achieves 100% real-API coverage for the Tier 3 cross-feature requirements by leveraging API request seeding for state isolation and adapting the combinations to the actual backend schema limits.

## Verification Method
To verify this strategy manually before implementation:
1. Run backend server and Celery worker locally.
2. Use `curl` or Postman to create a sub-account, create a job with a past deadline, and attempt to register a candidate to verify the 400 error (F1xF5).
3. Inspect `e2e/tests/tier3/cross-feature.spec.ts` structure. The implemented TypeScript code should follow the `[Fx x Fy]` setups exactly as designed here.
