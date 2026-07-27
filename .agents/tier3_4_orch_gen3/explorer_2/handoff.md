# Handoff: Tier 3 Cross-Feature Playwright Tests

## Observation
- **Scope Docs**: `SCOPE_TIER3_4.md` and `TEST_INFRA.md` request ~10 pairwise tests across 5 major features (Registration [F1], KKM [F2], App Status [F3], AI Chat/Score [F4], Multi-Tier Accounts [F5]).
- **Backend API Analysis**:
  - `POST /assessment/{job_id}/apply` creates an application and sets status to `"testing"` (`services/assessment_service.py:93-100`).
  - `POST /assessment/{application_id}/submit` triggers `app.status = "evaluated"` and initiates AI eval task (`services/assessment_service.py:154-173`).
  - `PUT /applications/{application_id}` allows recruiter/admin to change application status manually (`routers/applications.py:32-39`).
  - `POST /auth/sub-accounts` allows `admin` to create sub-accounts (`routers/auth.py:104-133`).
  - KKM Pass/Fail is checked in `GET /candidates/applications` (`routers/candidates.py:88-95`), determining if `overall_score >= job.kkm_score`.

## Logic Chain
1. To test **F1 & F2**, we simulate a candidate applying, taking the test, and receiving a score above or below the job's KKM threshold, verifying the "Passed KKM" flag on the candidate's dashboard.
2. To test **F1 & F3**, we simulate application submission changing status to "testing", and test submission changing it to "evaluated", followed by recruiter setting it to "interview" or "rejected".
3. To test **F1 & F4**, we simulate applying and using the AI chat API, which includes the job's context.
4. To test **F1 & F5**, we create a sub-account, have that sub-account create a job, and ensure candidates can apply and the parent admin can view the application.
5. We map out 10 distinct pairwise combinations that interact purely via real API calls (via Playwright's `request` context for setup to avoid slow UI steps) and real page interactions (via Playwright's `page` context) without mocking.

## Caveats
- Since the AI Evaluation runs asynchronously via Celery/Background Tasks (`evaluate_candidate_answer_task`), E2E tests relying on `overall_score` might experience race conditions if they assert immediately after submission. The tests use Playwright's auto-retrying assertions (`expect(element).toBeVisible()`) to wait for the UI to update or the AI to finish, but this assumes the Celery worker and AI endpoint are running and responsive.
- Tests will create real data in the local DB. We use unique identifiers (timestamps/UUIDs) to prevent cross-test contamination.

## Conclusion
We have designed and implemented 10 Tier 3 cross-feature E2E tests. The tests use `request` to rapidly provision prerequisites (users, jobs) and `page` to simulate real user interactions on the frontend, fulfilling the opaque-box and no-mocking constraints.

## Verification Method
- **Command**: Run `npx playwright test tests/tier3/cross-feature.spec.ts` in the `d:/projects/JHIC-rev/e2e` directory.
- **Expected Outcome**: All ~10 pairwise tests pass successfully, interacting with the real local backend and frontend without mocks.
