# Handoff: Tier 2 Boundary & Corner E2E Tests Design

## 1. Observation
- Read `ORIGINAL_REQUEST.md`: Defines 5 core features (Registration, KKM, Interview Scheduling, AI Questions, Multi-tier accounts).
- Read `TEST_INFRA.md`: Requires exactly 5 boundary/corner (Tier 2) test cases per feature (Total: 25) for E2E opaque-box testing using Playwright in TypeScript.
- Read `SCOPE.md`: Reinforces the architecture (`e2e tests using Playwright + TypeScript in d:/projects/JHIC-rev/e2e/tests/tier2`) and interface contracts (opaque-box, self-contained).

## 2. Logic Chain

Using Boundary Value Analysis (BVA), error guessing, and corner case isolation, I have mapped 5 specific test scenarios for each of the 5 features.

### Feature 1: Candidate Registration & Files
1. `test_registration_max_file_size`: Upload a file exactly at the maximum allowed size boundary (e.g., 5MB). Assert successful registration and file persistence.
2. `test_registration_unsupported_file_type`: Upload an executable (`.exe` or `.sh`) file. Assert the API and UI reject the upload with an appropriate validation error.
3. `test_registration_max_certificates_limit`: Upload exactly the maximum allowed number of certificate files (e.g., 5). Assert registration succeeds and all files are attached.
4. `test_registration_duplicate_email`: Register a candidate, then attempt to register another candidate with the exact same email. Assert the second registration fails with a 409 Conflict.
5. `test_registration_all_optional_fields_empty`: Register with all mandatory fields populated but every single optional field omitted. Assert successful registration and correct fallback state.

### Feature 2: KKM Rank & Pass/Fail Status
1. `test_kkm_exact_threshold_pass`: Assign a candidate score exactly equal to the KKM boundary. Assert pass status is `true` and rank is calculated.
2. `test_kkm_one_point_below_threshold_fail`: Assign a candidate score exactly `KKM - 1`. Assert pass status is `false`.
3. `test_kkm_perfect_score_upper_bound`: Assign a candidate a 100% (or max) score. Assert pass status is `true` and candidate achieves Rank 1 (or shared Rank 1).
4. `test_kkm_zero_score_lower_bound`: Assign a candidate a 0 score. Assert pass status is `false` and candidate is ranked at the very bottom.
5. `test_kkm_tie_breaking`: Create two candidates with the exact same score exactly at the KKM. Assert both are marked as passed and the UI renders shared ranks accurately without revealing the other candidate's identity.

### Feature 3: Interview Scheduling (Rules)
1. `test_interview_schedule_exactly_min_distance`: Schedule an interview exactly 24 hours (or the configured 1-day minimum) from the current time. Assert scheduling succeeds.
2. `test_interview_schedule_below_min_distance`: Schedule an interview 23 hours and 59 minutes from the current time. Assert the system rejects the scheduling due to minimum distance constraint.
3. `test_interview_schedule_quota_zero`: Set the HR quota to 0 available slots. Attempt to auto-schedule or recommend. Assert the system gracefully handles the lack of slots (returns empty or shows a full quota error).
4. `test_interview_accept_deadline_boundary`: Candidate accepts the proposed interview exactly 1 minute before the interview starts. Assert acceptance is processed successfully.
5. `test_interview_schedule_far_future`: Schedule an interview for December 31, 2099. Assert scheduling succeeds and timestamp is stored correctly without overflow.

### Feature 4: AI Interview Questions & Scoring
1. `test_ai_questions_empty_transcript`: Provide an empty string or 1-word string as the technical test answers. Assert the HR dashboard displays a fallback/generic AI question without crashing.
2. `test_ai_questions_max_transcript_length`: Provide a massive character string (e.g., 50,000 chars) simulating maximum transcript length. Assert the AI backend successfully processes it or cleanly truncates without a 500 error.
3. `test_scoring_zero_points`: HR assigns exactly 0 points post-interview. Assert the score is accepted and the final ranking calculates correctly.
4. `test_scoring_max_points`: HR assigns exactly the maximum allowed points (e.g., 100). Assert the score is accepted.
5. `test_scoring_out_of_bounds`: HR attempts to assign -1 points or 101 points. Assert the API and UI reject the input.

### Feature 5: Multi-Tier Accounts & Limits
1. `test_sub_account_cannot_create_sub_account`: Log in as a Sub-Account. Attempt to create another Sub-Account. Assert access denied (403 Forbidden).
2. `test_sub_account_cannot_edit_main_account`: Log in as a Sub-Account. Attempt to mutate Main Account settings or global configuration. Assert access denied.
3. `test_job_apply_exactly_on_deadline`: Apply for a job at the exact second of the deadline. Assert the application is successfully submitted.
4. `test_job_apply_one_second_after_deadline`: Apply for a job exactly 1 second after the deadline. Assert the application is rejected.
5. `test_job_creation_past_deadline`: Main Account creates a job posting with a deadline in the past. Assert the job creation fails validation.

## 3. Caveats
- Exact numerical limits (maximum file size, maximum number of certificates, maximum score) are assumed variables. The actual Playwright implementation will need to reference configuration constants or environment variables.
- AI test cases (`test_ai_questions_empty_transcript`, `test_ai_questions_max_transcript_length`) assume there is a mock AI service or a staging AI endpoint. If hitting a real LLM, tests might be slow or flaky and may require mocking at the API layer for the opaque-box test.

## 4. Conclusion
Proposed exactly 25 Tier 2 boundary and corner test cases scoped for Playwright + TypeScript E2E opaque-box testing. The design covers file size boundaries, exact KKM thresholds, time-based boundary limits for scheduling and applications, edge cases for AI transcripts, and RBAC constraint violations.

## 5. Verification Method
- **Implementation Inspection**: Review `d:/projects/JHIC-rev/e2e/tests/tier2` to ensure 25 test blocks (e.g., `test('...')`) exist.
- **Execution**: Run `npx playwright test --project=tier2` (or equivalent runner command) to verify the 25 test cases execute and correctly validate the application's boundaries.
