# Tier 1 Test Design Report

## Observation
- `ORIGINAL_REQUEST.md` specifies 5 main features: Candidate Registration & Files, KKM Rank & Pass/Fail Status, Interview Scheduling, AI Interview Questions & Scoring, and Multi-Tier Accounts & Limits.
- `TEST_INFRA.md` requires exactly 5 Tier 1 tests per feature, totaling 25 tests. Tier 1 focuses on happy path and basic equivalence classes.
- `SCOPE.md` confirms Tier 1 tests must be opaque-box, hitting REST APIs or Playwright UI, without direct DB queries unless necessary for setup.

## Logic Chain
- To achieve exactly 5 opaque-box tests for **Feature 1 (Registration)**, we must cover the core happy path (full submission, minimal submission) and basic negative paths (missing files, wrong file types). A UI validation for test notifications ensures front-to-back integration.
- For **Feature 2 (KKM Rank)**, testing the threshold involves above KKM (pass), below KKM (fail), exactly at KKM (boundary pass), UI privacy checks (anonymous rank), and state updates (real-time rank change).
- For **Feature 3 (Interview Rules)**, scheduling validations need positive (≥2 days) and negative (<1 day) bounds, along with candidate interactions (accept/reject) and verifying the AI recommendation endpoint based on quotas.
- For **Feature 4 (AI & Scoring)**, we must verify the AI endpoint returns valid questions based on a mock transcript, verify that HR can retrieve these, that HR can submit valid points, that invalid points are rejected, and that submitting scores recalculates final rankings.
- For **Feature 5 (Accounts & Job Limits)**, tests must validate parent-child creation, sub-account authorization enforcement, job deadline enforcement (before and after deadline), and the ability for the admin to modify the deadline.

## Caveats
- Since the exact URL endpoints (e.g., `/api/candidates/register`) were not hard-coded in the provided requirements, standardized hypothetical paths are used in the test steps. The implementation team will need to align the test paths with the actual router setup.
- The boundary rule for exactly matching the KKM score assumes `score >= KKM` is a Pass.
- The rule for minimum interview scheduling distance (1-2 days) is tested using 12 hours (negative case) and 3 days (positive case) to ensure clear boundaries.

## Conclusion

Below are the 25 Tier 1 opaque-box tests designed for implementation:

### Feature 1: Candidate Registration & Files (R1)
1. **Test 1.1: Successful Candidate Registration (Happy Path)**
   - *Purpose*: Verify that a candidate can register successfully providing all required personal data and documents.
   - *Steps*: POST to `/api/candidates/register` with valid personal data, CV, and certificates. Verify response status is 201 Created and contains candidate ID.
2. **Test 1.2: Candidate Registration Missing Required Fields**
   - *Purpose*: Verify that registration fails if the CV is omitted.
   - *Steps*: POST to `/api/candidates/register` missing the CV field. Verify response status is 400 Bad Request and error mentions missing CV.
3. **Test 1.3: Candidate Registration Invalid File Type**
   - *Purpose*: Verify that registration fails if an unsupported file type is uploaded.
   - *Steps*: POST to `/api/candidates/register` with an `.exe` file for CV. Verify response status is 400 Bad Request regarding file format.
4. **Test 1.4: In-App Notification Generation**
   - *Purpose*: Verify that a successful registration triggers an in-app notification to take the technical test.
   - *Steps*: Perform a successful registration. GET `/api/candidates/notifications`. Verify response contains a test prompt notification.
5. **Test 1.5: Minimal Candidate Registration**
   - *Purpose*: Verify registration succeeds with only strictly required fields (no optional certificates).
   - *Steps*: POST to `/api/candidates/register` with valid personal data and CV, but no certificates. Verify response status is 201 Created.

### Feature 2: KKM Rank & Pass/Fail Status (R1)
6. **Test 2.1: Candidate Passes KKM**
   - *Purpose*: Verify that a candidate scoring above the KKM is assigned a "Pass" status.
   - *Steps*: Submit a technical test score > KKM. GET `/api/candidates/{id}/status`. Verify status is "Pass".
7. **Test 2.2: Candidate Fails KKM**
   - *Purpose*: Verify that a candidate scoring below the KKM is assigned a "Fail" status.
   - *Steps*: Submit a technical test score < KKM. GET `/api/candidates/{id}/status`. Verify status is "Fail".
8. **Test 2.3: Candidate Exact KKM Score (Boundary)**
   - *Purpose*: Verify the boundary condition where a candidate scores exactly the KKM.
   - *Steps*: Submit a technical test score == KKM. GET `/api/candidates/{id}/status`. Verify status is "Pass".
9. **Test 2.4: Anonymous Rank Display (UI)**
   - *Purpose*: Verify that the UI only displays anonymous rank without PII of others.
   - *Steps*: Authenticate as passed candidate. Navigate to dashboard in Playwright. Verify UI renders "Rank X" without revealing other candidate identities.
10. **Test 2.5: Real-time Rank Update**
    - *Purpose*: Verify that candidate rank updates automatically.
    - *Steps*: GET candidate rank via API. Submit a higher test score for a new candidate. GET rank again. Verify rank number increased appropriately.

### Feature 3: Interview Scheduling & AI Recommendations (R2)
11. **Test 3.1: Valid Interview Schedule (≥ 2 days)**
    - *Purpose*: Verify HR can schedule an interview well in advance.
    - *Steps*: Authenticate as HR. POST `/api/interviews/schedule` with a date 3 days in the future. Verify response is 201/200.
12. **Test 3.2: Invalid Interview Schedule (< 1 day)**
    - *Purpose*: Verify the system rejects interview schedules that are too soon.
    - *Steps*: POST `/api/interviews/schedule` with a date 12 hours in the future. Verify response is 400 Bad Request for violating the 1-2 day minimum rule.
13. **Test 3.3: Candidate Accepts Interview**
    - *Purpose*: Verify a candidate can accept an invitation.
    - *Steps*: Authenticate as Candidate. POST `/api/interviews/{id}/accept`. Verify status is 200 OK and interview state is "Accepted".
14. **Test 3.4: Candidate Rejects Interview**
    - *Purpose*: Verify a candidate can reject an invitation.
    - *Steps*: Authenticate as Candidate. POST `/api/interviews/{id}/reject`. Verify status is 200 OK and interview state is "Rejected".
15. **Test 3.5: AI Recommendations based on HR Quota**
    - *Purpose*: Verify the system returns recommended candidates matching the quota.
    - *Steps*: Authenticate as HR. GET `/api/interviews/recommendations?quota=5`. Verify response array contains ≤5 recommended passing candidates.

### Feature 4: AI Interview Questions & Scoring (R3)
16. **Test 4.1: Retrieve AI-Recommended Questions**
    - *Purpose*: Verify HR can view follow-up questions for a candidate.
    - *Steps*: Authenticate as HR. GET `/api/interviews/{id}/questions`. Verify response contains a list of dynamically generated questions.
17. **Test 4.2: Submit Post-Interview Score**
    - *Purpose*: Verify HR can submit a valid score.
    - *Steps*: Authenticate as HR. POST `/api/interviews/{id}/score` with a valid positive score. Verify response is 200 OK.
18. **Test 4.3: Final Ranking Update on Scoring**
    - *Purpose*: Verify that submitting an interview score recalculates final ranking.
    - *Steps*: Submit score for Candidate A. GET `/api/candidates/rankings`. Verify Candidate A's total points and rank have updated.
19. **Test 4.4: Invalid Post-Interview Score Rejection**
    - *Purpose*: Verify HR cannot submit out-of-bounds scores.
    - *Steps*: POST `/api/interviews/{id}/score` with a negative score (-10). Verify response is 400 Bad Request.
20. **Test 4.5: Programmatic Test of AI Integration (Mock)**
    - *Purpose*: Verify AI generation logic handles transcripts correctly.
    - *Steps*: POST `/api/ai/generate-questions` with a mock chat transcript. Verify response is 200 OK and contains relevant question strings.

### Feature 5: Multi-Tier Accounts & Job Limits (R4)
21. **Test 5.1: Main Account Creates Sub-Account**
    - *Purpose*: Verify an Admin can create a sub-account.
    - *Steps*: Authenticate as Admin. POST `/api/company/sub-accounts`. Verify response is 201 Created.
22. **Test 5.2: Sub-Account Access Control**
    - *Purpose*: Verify a sub-account cannot perform Admin actions.
    - *Steps*: Authenticate as Sub-Account. POST `/api/company/sub-accounts`. Verify response is 403 Forbidden.
23. **Test 5.3: Application Before Job Deadline**
    - *Purpose*: Verify candidates can apply before the deadline.
    - *Steps*: Create job with future deadline. Authenticate as Candidate. POST application. Verify response is 200/201.
24. **Test 5.4: Application After Job Deadline**
    - *Purpose*: Verify the system rejects late applications.
    - *Steps*: Create job with past deadline. Authenticate as Candidate. POST application. Verify response is 400/403 with expired message.
25. **Test 5.5: Update Job Limits/Deadline**
    - *Purpose*: Verify Main Accounts can update job deadlines.
    - *Steps*: Authenticate as Admin. PUT `/api/jobs/{id}` with a new future deadline. GET job details to verify update success.

## Verification Method
- **Implementation check**: The implementer should create 25 Playwright `.spec.ts` files or test cases aligned exactly to these 25 scenarios.
- **Run command**: Execute `npx playwright test tests/tier1` to verify tests compile and run (they will fail initially until backend logic is fully wired up).
- **Manual review**: Read `tests/tier1` files to ensure they do not include raw SQL `SELECT` queries (except possibly in a `global-setup.ts`), proving they are opaque-box UI/API tests.
