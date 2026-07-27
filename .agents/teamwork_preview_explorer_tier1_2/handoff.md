# Tier 1 Test Design Report

## 1. Observation
The requirements are defined in `ORIGINAL_REQUEST.md`, test philosophy in `TEST_INFRA.md`, and scope in `SCOPE.md`. 
The system identifies 5 distinct features requiring 5 Tier 1 opaque-box tests each (25 total).
- Feature 1: Candidate Registration & Files
- Feature 2: KKM Rank & Pass/Fail Status
- Feature 3: Interview Scheduling (Rules)
- Feature 4: AI Interview Questions & Scoring
- Feature 5: Multi-Tier Accounts & Limits
All tests must target REST APIs or the Playwright UI without relying on internal implementation details or direct DB queries (unless used strictly for setup).

## 2. Logic Chain
To satisfy Tier 1 (Feature Coverage: happy path and basic equivalence classes), the following 25 test cases have been designed to validate the core logic boundaries of each feature:

### Feature 1: Candidate Registration & Files
1. **T1F1-01: Successful Registration with Complete Data (Happy Path)**
   - **Purpose**: Verify a candidate can register by providing all required data (personal info, CV, certificates).
   - **Steps**: Hit registration API/UI with valid inputs -> Expect success response -> Verify candidate data is correctly stored via profile API.
2. **T1F1-02: Registration Fails Missing Required Documents (Equivalence Class)**
   - **Purpose**: Verify system rejects registration if CV is missing.
   - **Steps**: Submit registration with valid personal info but no CV -> Expect validation error (400 Bad Request) -> Verify candidate is not registered.
3. **T1F1-03: Registration Allows Multiple Certificates (Equivalence Class)**
   - **Purpose**: Verify candidate can upload multiple certificates during registration.
   - **Steps**: Submit registration with valid info, CV, and >1 certificate -> Expect success -> Verify profile shows all uploaded certificates.
4. **T1F1-04: Registration Handles Invalid File Types (Equivalence Class)**
   - **Purpose**: Verify file upload validation for CV/certificates.
   - **Steps**: Submit registration with an unsupported file (e.g., executable) as CV -> Expect validation error -> Verify no registration occurs.
5. **T1F1-05: Duplicate Email Prevention (Equivalence Class)**
   - **Purpose**: Ensure a candidate cannot register twice with the same email.
   - **Steps**: Register successfully -> Attempt to register again with same email -> Expect conflict error (409).

### Feature 2: KKM Rank & Pass/Fail Status
6. **T1F2-01: Candidate Above KKM Shows Pass Status (Equivalence Class)**
   - **Purpose**: Verify candidate exceeding the KKM threshold receives a 'Pass' status.
   - **Steps**: Mock/submit test score above threshold -> Fetch candidate status API -> Verify status is 'Pass' and rank is assigned.
7. **T1F2-02: Candidate Below KKM Shows Fail Status (Equivalence Class)**
   - **Purpose**: Verify candidate scoring below KKM receives a 'Fail' status.
   - **Steps**: Mock/submit test score below threshold -> Fetch candidate status API -> Verify status is 'Fail'.
8. **T1F2-03: Exact KKM Score Shows Pass (Boundary Value)**
   - **Purpose**: Verify a score exactly equal to the KKM threshold results in a 'Pass'.
   - **Steps**: Mock/submit test score exactly at the threshold -> Fetch candidate status -> Verify status is 'Pass'.
9. **T1F2-04: KKM Rank Visibility is Anonymous (Happy Path)**
   - **Purpose**: Ensure a candidate's UI only shows their own rank and pass/fail status without revealing others.
   - **Steps**: Login as candidate -> Request ranking data -> Verify response only contains current candidate's info and total count, no PII of others.
10. **T1F2-05: Real-Time Rank Updating on New Score (Happy Path)**
    - **Purpose**: Verify ranking recalculates when a new candidate submits a test score.
    - **Steps**: Check current candidate rank -> Another candidate scores higher -> Re-check first candidate's rank -> Verify rank dropped by 1.

### Feature 3: Interview Scheduling (Rules)
11. **T1F3-01: Valid Interview Date Acceptance (Happy Path)**
    - **Purpose**: Verify HR can propose an interview date more than 2 days in the future.
    - **Steps**: Set interview date = current date + 3 days -> Submit via API/UI -> Expect success.
12. **T1F3-02: Invalid Interview Date Rejection (Boundary Value)**
    - **Purpose**: Verify system rejects interview schedules less than 1-2 days from current date.
    - **Steps**: Set interview date = current date + 1 day -> Submit -> Expect validation error.
13. **T1F3-03: Candidate Can Accept Interview (Happy Path)**
    - **Purpose**: Verify a candidate can accept a proposed interview slot.
    - **Steps**: Create valid interview proposal -> Login as candidate -> Accept interview via API/UI -> Verify interview status changes to 'Accepted'.
14. **T1F3-04: Candidate Can Reject Interview (Happy Path)**
    - **Purpose**: Verify a candidate can reject a proposed interview slot.
    - **Steps**: Create valid interview proposal -> Login as candidate -> Reject interview -> Verify interview status changes to 'Rejected'.
15. **T1F3-05: Interview Scheduling Requires Passed KKM (Equivalence Class)**
    - **Purpose**: Ensure interviews cannot be scheduled for candidates who failed the KKM.
    - **Steps**: Find/Create candidate with 'Fail' status -> Attempt to schedule interview -> Expect business logic error.

### Feature 4: AI Interview Questions & Scoring
16. **T1F4-01: AI Follow-Up Questions Generated (Happy Path)**
    - **Purpose**: Verify that the system generates AI recommended questions based on test answers.
    - **Steps**: Submit mock test chat transcript for a candidate -> Request AI interview questions -> Verify a list of questions is returned in response.
17. **T1F4-02: AI Questions Missing on No Test Data (Equivalence Class)**
    - **Purpose**: Verify system behavior when attempting to get AI questions without a valid test transcript.
    - **Steps**: Request AI questions for candidate with no transcript -> Expect empty list or appropriate error message.
18. **T1F4-03: HR Can Submit Interview Score (Happy Path)**
    - **Purpose**: Verify HR can assign points post-interview.
    - **Steps**: Set candidate to 'Interview Accepted' status -> HR submits interview score -> Expect success response -> Verify score is saved.
19. **T1F4-04: Interview Score Updates Final Ranking (Happy Path)**
    - **Purpose**: Verify post-interview score affects the final candidate ranking.
    - **Steps**: Check initial ranking -> Submit high interview score -> Fetch updated ranking -> Verify rank improved/changed appropriately.
20. **T1F4-05: Unauthorized Scoring Prevention (Equivalence Class)**
    - **Purpose**: Verify that non-HR accounts (e.g. Candidate) cannot submit interview scores.
    - **Steps**: Login as Candidate -> Attempt to submit interview score -> Expect 403 Forbidden.

### Feature 5: Multi-Tier Accounts & Limits
21. **T1F5-01: Main Account Can Create Sub-Account (Happy Path)**
    - **Purpose**: Verify an Admin (Main Account) can successfully add a sub-account.
    - **Steps**: Login as Admin -> Create Sub-account -> Verify sub-account exists and can authenticate.
22. **T1F5-02: Sub-Account Cannot Perform Admin Actions (Equivalence Class)**
    - **Purpose**: Verify that a Sub-account is restricted from performing Main Account level actions (e.g., creating another sub-account).
    - **Steps**: Login as Sub-account -> Attempt to create a sub-account -> Expect 403 Forbidden.
23. **T1F5-03: Job Application Before Deadline Succeeds (Happy Path)**
    - **Purpose**: Verify a candidate can apply to a job before its configured deadline.
    - **Steps**: Create job with deadline in the future -> Apply as candidate -> Expect successful application.
24. **T1F5-04: Job Application After Deadline Rejected (Boundary Value)**
    - **Purpose**: Verify job postings automatically reject new applications if the current time exceeds the time limit.
    - **Steps**: Create job with deadline in the past -> Apply as candidate -> Expect validation error (job expired).
25. **T1F5-05: Configurable Job Deadline Verification (Happy Path)**
    - **Purpose**: Verify that an authorized account can successfully update a job's deadline.
    - **Steps**: Create job -> Update deadline via API -> Apply as candidate based on new deadline rules -> Expect behavior matching new deadline.

## 3. Caveats
- Precise API endpoints and UI locators are not defined here as this is a high-level design specification. They must be mapped to actual routes in implementation.
- Setup methods (e.g., mocking scores or transcripts) may require specific backend scaffolding or database seeding mechanisms before running these tests.
- We assume Playwright tests can mock dates or backend limits to reliably test time boundaries (e.g. interview deadline logic).

## 4. Conclusion
The 25 test case designs fully cover the Tier 1 scope by asserting the happy path and basic constraints (equivalence classes and boundary values) for all 5 identified features.

## 5. Verification Method
- **Implementation Mapping**: Ensure the implementer translates these 25 designs into actual `playwright` `.spec.ts` files inside `d:/projects/JHIC-rev/e2e/tests/tier1`.
- **Run Command**: After implementation, execute `npx playwright test --grep @tier1` or equivalent command to verify all 25 tests pass against a live or mocked instance.
