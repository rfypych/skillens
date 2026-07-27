# Tier 1 Test Design Report

## 1. Observation
- `ORIGINAL_REQUEST.md` specifies 5 key features:
  1. Candidate Registration & Files (R1)
  2. KKM Rank & Pass/Fail Status (R1)
  3. Interview Scheduling (Rules) (R2)
  4. AI Interview Questions & Scoring (R3)
  5. Multi-Tier Accounts & Limits (R4)
- `TEST_INFRA.md` dictates Tier 1 tests are Happy Path and Basic Equivalence Classes, 5 tests per feature, totaling 25 tests.
- `SCOPE.md` specifies that these are opaque-box E2E tests using Playwright + TypeScript targeting REST APIs or UI without direct DB queries (unless needed for setup).

## 2. Logic Chain
To meet the requirement of 25 Tier 1 opaque-box tests focusing on basic feature coverage, we must derive exactly 5 tests per feature:

### Feature 1: Candidate Registration & Files
1. **T1.1_Candidate_Registration_Valid**: 
   - **Purpose**: Verify successful registration with valid personal data, CV, and certificates.
   - **Steps**: Send valid registration payload -> Expect 201 Created.
2. **T1.2_Candidate_Registration_Missing_PersonalData**:
   - **Purpose**: Verify registration failure when required personal data is missing.
   - **Steps**: Send registration payload omitting mandatory personal data -> Expect 400 Bad Request.
3. **T1.3_Candidate_Registration_Missing_Files**:
   - **Purpose**: Verify registration failure when mandatory CV/certificates are missing.
   - **Steps**: Send registration payload omitting file attachments -> Expect 400 Bad Request.
4. **T1.4_Candidate_Registration_Multiple_Certificates**:
   - **Purpose**: Verify system handles multiple certificate file uploads successfully.
   - **Steps**: Send registration payload with 3+ certificates -> Expect 201 Created.
5. **T1.5_Candidate_Registration_Notification**:
   - **Purpose**: Verify successful registration triggers the in-app notification for the technical test.
   - **Steps**: Complete a valid registration, then fetch candidate notifications -> Expect a notification instructing candidate to take the test.

### Feature 2: KKM Rank & Pass/Fail Status
1. **T2.1_KKM_Pass_Exact**:
   - **Purpose**: Verify candidate scores exactly equal to KKM are marked as PASS.
   - **Steps**: Submit a test score matching the KKM -> Fetch candidate status -> Expect PASS.
2. **T2.2_KKM_Pass_Above**:
   - **Purpose**: Verify candidate scores above KKM are marked as PASS.
   - **Steps**: Submit a test score above KKM -> Fetch candidate status -> Expect PASS.
3. **T2.3_KKM_Fail_Below**:
   - **Purpose**: Verify candidate scores below KKM are marked as FAIL.
   - **Steps**: Submit a test score below KKM -> Fetch candidate status -> Expect FAIL.
4. **T2.4_KKM_Anonymous_Rank_Privacy**:
   - **Purpose**: Verify the candidate's rank view is anonymous and exposes no PII of others.
   - **Steps**: Fetch rank endpoint as candidate -> Expect payload to contain only own rank/status and no names or identifiers of other candidates.
5. **T2.5_KKM_HR_RealTime_Update**:
   - **Purpose**: Verify the HR dashboard reflects the pass/fail status updates.
   - **Steps**: Complete a test resulting in PASS for a candidate -> Fetch HR applicant list -> Expect candidate status to be updated to PASS immediately.

### Feature 3: Interview Scheduling (Rules)
1. **T3.1_Interview_Schedule_Valid_Date**:
   - **Purpose**: Verify HR can schedule an interview if the proposed date is >= 1-2 days from current date.
   - **Steps**: HR proposes an interview 3 days in the future -> Expect 201 Created.
2. **T3.2_Interview_Schedule_Invalid_Date**:
   - **Purpose**: Verify the system rejects interview scheduling if the proposed date is < 1-2 days from current date (e.g., today).
   - **Steps**: HR proposes an interview for today -> Expect 400 Bad Request.
3. **T3.3_Interview_Candidate_Accept**:
   - **Purpose**: Verify candidate can accept a proposed interview.
   - **Steps**: Schedule valid interview -> Candidate calls accept endpoint -> Expect schedule status is ACCEPTED.
4. **T3.4_Interview_Candidate_Reject**:
   - **Purpose**: Verify candidate can reject a proposed interview.
   - **Steps**: Schedule valid interview -> Candidate calls reject endpoint -> Expect schedule status is REJECTED.
5. **T3.5_Interview_Only_Passed_Candidates**:
   - **Purpose**: Verify interviews can only be scheduled for candidates who passed the KKM.
   - **Steps**: Attempt to schedule an interview for a candidate who FAILED the KKM -> Expect 400/403.

### Feature 4: AI Interview Questions & Scoring
1. **T4.1_AI_Question_Generation_Success**:
   - **Purpose**: Verify the system generates AI-recommended follow-up questions for a candidate who completed the technical test.
   - **Steps**: Fetch AI recommendations for a passed candidate -> Expect list of specific questions.
2. **T4.2_AI_Question_Generation_NoTest**:
   - **Purpose**: Verify AI questions are appropriately handled/empty if a candidate hasn't completed the test.
   - **Steps**: Fetch AI recommendations for a candidate who hasn't taken the test -> Expect empty or appropriate error message.
3. **T4.3_HR_Submit_Interview_Score_Valid**:
   - **Purpose**: Verify HR can successfully submit post-interview points.
   - **Steps**: HR submits a valid integer score for a completed interview -> Expect 200 OK.
4. **T4.4_HR_Submit_Interview_Score_Invalid**:
   - **Purpose**: Verify the system rejects invalid post-interview scores (e.g., negative or beyond max range).
   - **Steps**: HR submits a score of -10 -> Expect 400 Bad Request.
5. **T4.5_HR_Score_Updates_Final_Ranking**:
   - **Purpose**: Verify that submitting an interview score recalculates and updates the final ranking.
   - **Steps**: Submit an interview score for candidate A -> Fetch final ranking list as HR -> Expect candidate A's final ranking points to reflect the new score.

### Feature 5: Multi-Tier Accounts & Limits
1. **T5.1_Main_Account_Creates_SubAccount**:
   - **Purpose**: Verify the Main Account (Admin) can successfully create a sub-account.
   - **Steps**: Main account submits payload to create sub-account -> Expect 201 Created and new user can login.
2. **T5.2_SubAccount_Cannot_Create_SubAccount**:
   - **Purpose**: Verify sub-accounts are blocked from performing admin-restricted actions like creating more sub-accounts.
   - **Steps**: Sub-account attempts to create another sub-account -> Expect 403 Forbidden.
3. **T5.3_Job_Posting_Before_Deadline**:
   - **Purpose**: Verify applicants can apply to a job before its time limit expires.
   - **Steps**: Create job posting with future deadline -> Candidate applies -> Expect 201 Created.
4. **T5.4_Job_Posting_After_Deadline**:
   - **Purpose**: Verify the system automatically rejects applications once the job's time limit has passed.
   - **Steps**: Create job posting with past deadline (or wait out expiration) -> Candidate applies -> Expect 400/403 Application Rejected.
5. **T5.5_Job_Posting_Creation_Admin_Only**:
   - **Purpose**: Verify job creation requires configuring the required time limit.
   - **Steps**: Main account attempts to post a job without specifying a deadline -> Expect 400 Bad Request.

## 3. Caveats
- Precise status codes (e.g. 201 vs 200) may vary based on backend implementation; the tests should be adapted if the API spec dictates different success/error codes.
- "Real-time" UI testing for HR dashboard updates (T2.5) via Playwright may require websockets or polling to be active, or we can just assert the subsequent API GET response.
- Expiration of job limits in T5.4 might require mocking the server clock or creating a job with an immediate expiration time since tests must run quickly.
- We assume AI test transcript data can be mocked for T4.1, avoiding the need for actual lengthy generative AI delays during testing.

## 4. Conclusion
The 25 designed Tier 1 tests provide complete basic-path and equivalence-class coverage for the 5 key features identified in the original request. The tests adhere to the opaque-box constraint and can be implemented efficiently in Playwright via REST API actions and UI validation.

## 5. Verification Method
- **Implementation**: The next agent can directly implement these tests in `e2e/tests/tier1/`.
- **Test execution**: To independently verify the design covers the scope, run `npx playwright test --grep "@tier1"` after implementation.
- **Coverage**: Check that exactly 25 tests run and all map 1:1 with the defined features in this report.
