# Handoff Report: Tier 2 E2E Test Cases

## 1. Observation
- `ORIGINAL_REQUEST.md` details 5 primary features: 1) Candidate Registration, 2) KKM Rank, 3) Interview Scheduling, 4) AI Interview Questions, 5) Multi-Tier Accounts.
- `TEST_INFRA.md` specifies Tier 2 tests are for boundary, corner, Category-Partition, and BVA testing.
- `SCOPE.md` states: "Tier 2 requires 5 boundary/corner test cases per feature (Total: 25)" using "Playwright + TypeScript in `d:/projects/JHIC-rev/e2e/tests/tier2`".

## 2. Logic Chain
- **Feature 1 (Registration)**: Focuses on boundary sizes and corner cases for file uploads (CVs/certificates).
- **Feature 2 (KKM Ranking)**: Boundary tests naturally land on the threshold (exactly KKM, KKM-1), as well as extremes (KKM=0, KKM=MAX).
- **Feature 3 (Interview Scheduling)**: Requirement specifies "1-2 day minimum distance". We must test exactly the minimum allowed distance and just below it.
- **Feature 4 (AI & Scoring)**: AI inputs can be extreme (empty or massive token limits). Scoring has boundary minimums and maximums.
- **Feature 5 (Accounts & Limits)**: Involves job expiration deadlines (exactly at, just after) and privilege boundaries (sub-account attempting admin actions).

## 3. Caveats
- Precise byte limits for file uploads, KKM max scores, and exact "1-2 day" duration definitions (e.g., 24h vs 48h) must be aligned with the backend configuration during implementation. Tests assume configurable constants can be imported or mocked.
- AI token limits in Feature 4 may require mocking the LLM API to avoid actual API costs and unreliability during testing.

## 4. Conclusion
Below is the proposed design for the 25 Tier 2 tests.

### Feature 1: Candidate Registration & Files
1. **T2_F1_01_max_file_size_boundary**: Upload a CV file exactly at the maximum allowed size limit. *Assertion*: Should succeed.
2. **T2_F1_02_max_file_size_exceeded**: Upload a CV file 1 byte over the maximum allowed size limit. *Assertion*: Should show validation error and reject.
3. **T2_F1_03_unsupported_file_type**: Upload an executable (`.exe`) instead of PDF for certificates. *Assertion*: Should reject upload.
4. **T2_F1_04_max_attachments_limit**: Upload the maximum number of certificates vs limit + 1. *Assertion*: Max limit should succeed, Max+1 should fail.
5. **T2_F1_05_special_chars_in_filename**: Upload a file with a long name and special characters (e.g., `cv_!@#$%^&()_+.pdf`). *Assertion*: Should succeed and download correctly.

### Feature 2: KKM Rank & Pass/Fail Status
1. **T2_F2_01_score_exactly_on_kkm**: Candidate score is exactly equal to the KKM threshold. *Assertion*: Marked as Pass.
2. **T2_F2_02_score_just_below_kkm**: Candidate score is 1 point below the KKM threshold. *Assertion*: Marked as Fail.
3. **T2_F2_03_multiple_candidates_same_score**: 5 candidates have the exact same score at the KKM threshold. *Assertion*: System assigns consistent tied ranks and all pass.
4. **T2_F2_04_kkm_threshold_zero**: KKM is configured to 0. *Assertion*: All candidates pass.
5. **T2_F2_05_kkm_threshold_max**: KKM is configured to the maximum possible score. *Assertion*: Only perfect scores pass; max-1 fails.

### Feature 3: Interview Scheduling (Rules)
1. **T2_F3_01_schedule_exact_min_distance**: HR schedules interview exactly at the minimum distance (e.g., 24 hours) from current time. *Assertion*: Accepted.
2. **T2_F3_02_schedule_just_below_min_distance**: HR schedules interview 1 minute less than the minimum distance. *Assertion*: Rejected with error.
3. **T2_F3_03_schedule_max_quota_reached**: HR schedules candidates exceeding the daily quota limit. *Assertion*: N+1th candidate scheduling is rejected.
4. **T2_F3_04_schedule_in_past**: HR attempts to submit an interview time in the past via API. *Assertion*: Backend rejects the request.
5. **T2_F3_05_candidate_accept_last_minute**: Candidate accepts the interview exactly 1 minute before the interview starts. *Assertion*: Accepted (if no deadline) or cleanly rejected.

### Feature 4: AI Interview Questions & Scoring
1. **T2_F4_01_empty_test_transcript**: Technical test chat transcript is empty. *Assertion*: AI provides a generic fallback question set gracefully.
2. **T2_F4_02_massive_test_transcript**: Transcript exceeds typical token limits. *Assertion*: System truncates safely and generates questions without crashing.
3. **T2_F4_03_score_above_maximum**: HR submits a score above the maximum allowed (e.g., 101/100). *Assertion*: Rejected with boundary error.
4. **T2_F4_04_score_below_minimum**: HR submits a score below the minimum (e.g., -1). *Assertion*: Rejected with boundary error.
5. **T2_F4_05_concurrent_score_updates**: HR submits multiple score updates simultaneously. *Assertion*: Final ranking reflects the last valid update without race conditions.

### Feature 5: Multi-Tier Accounts & Limits
1. **T2_F5_01_apply_exactly_at_deadline**: Applicant submits application exactly at the deadline timestamp. *Assertion*: Accepted.
2. **T2_F5_02_apply_just_after_deadline**: Applicant submits application 1 second after the deadline timestamp. *Assertion*: Rejected.
3. **T2_F5_03_subaccount_privilege_escalation**: Sub-account attempts an Admin-only API action (e.g., deleting Main account). *Assertion*: HTTP 403 Forbidden.
4. **T2_F5_04_deadline_set_in_past**: Main account creates a job posting with a deadline in the past. *Assertion*: Job creation rejected by validation.
5. **T2_F5_05_subaccount_creates_subaccount**: Sub-account member attempts to invite another sub-account. *Assertion*: Action denied, only Admin can create members.

## 5. Verification Method
- The Implementer agent can read this file and construct the 25 `test()` blocks in Playwright under `e2e/tests/tier2/`.
- Review the implemented code against the descriptions provided above to ensure assertions precisely map to these boundary/corner conditions.
