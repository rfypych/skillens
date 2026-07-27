# Handoff: Tier 2 Boundary & Corner Test Design

## 1. Observation
- `ORIGINAL_REQUEST.md` details 5 primary features: 1) Candidate Registration, 2) KKM Rank & Status, 3) Interview Scheduling, 4) AI Interview Questions, and 5) Multi-Tier Accounts & Limits.
- `TEST_INFRA.md` specifies Tier 2 testing requires exactly 5 boundary/corner test cases per feature (Total: 25 tests), utilizing Opaque-box methodology with Category-Partition, BVA (Boundary Value Analysis), and Corner/Error conditions.
- `SCOPE.md` confirms these E2E tests are to be written using Playwright and TypeScript in the `d:/projects/JHIC-rev/e2e/tests/tier2` directory.

## 2. Logic Chain
1.  **Feature 1 (Registration)** requires file uploads and mandatory/optional data. Boundary cases must target file size limits (max, max+1, 0 bytes) and format verification (spoofed extensions).
2.  **Feature 2 (KKM Rank)** revolves around score thresholds. Boundary cases must target the exact KKM limit, KKM-1, and scenarios where multiple candidates cluster precisely at the boundary or rank limit.
3.  **Feature 3 (Scheduling)** enforces a 1-2 day minimum distance rule and HR quotas. BVA focuses on exactly 24 hours (accept) vs 23:59 hours (reject), and exactly reaching HR capacity.
4.  **Feature 4 (AI & Scoring)** involves passing text to AI and numeric scoring by HR. Corner cases include extreme inputs (1 char vs 10k chars) to the AI, error fallbacks, and boundary numeric scores (0, max, negative, decimal).
5.  **Feature 5 (Accounts & Limits)** enforces application deadlines and access controls. BVA targets exactly the deadline timestamp, maximum sub-account counts, and mid-session permission revocations.

## 3. Caveats
- Precise numeric limits (e.g., maximum file size, exact KKM increment, maximum text limit for AI, sub-account limits) are assumed to be configurable or standardized. Tests must read these limits dynamically or have them mocked.
- For AI tests, opaque-box testing implies intercepting/mocking AI responses in Playwright, as interacting with live AI can yield non-deterministic results.
- Time-based boundaries (e.g. "exactly 24 hours") may require clock mocking in Playwright (`page.clock`) to reliably hit exact second boundaries.

## 4. Conclusion
Below are the proposed 25 Tier 2 test cases to be implemented in Playwright.

### Feature 1: Candidate Registration & Files
1.  **`upload_max_size_accept`**: Upload a CV/certificate exactly equal to the maximum allowed byte limit (e.g., exactly 5MB). Assert success.
2.  **`upload_max_size_reject`**: Upload a CV/certificate exactly 1 byte over the maximum allowed limit. Assert validation error message and rejection.
3.  **`upload_zero_byte_reject`**: Upload an empty (0-byte) mandatory file. Assert rejection.
4.  **`upload_spoofed_extension`**: Upload an unsupported executable file (`.exe` or `.sh`) renamed to `.pdf`. Assert the backend/UI rejects the invalid mime type.
5.  **`registration_missing_optional`**: Submit registration with all mandatory fields/files present, but completely omit all optional fields/files. Assert successful registration.

### Feature 2: KKM Rank & Pass/Fail Status
6.  **`kkm_exact_boundary_pass`**: Submit a candidate test score exactly equal to the KKM. Assert the real-time status is "Pass".
7.  **`kkm_exact_boundary_fail`**: Submit a candidate test score exactly 1 minimum unit (e.g. 1 point or 0.01) below the KKM. Assert status is "Fail".
8.  **`kkm_tied_score_boundary`**: Concurrently finalize two candidate scores that are identically at the KKM boundary. Assert both pass and rank calculation handles ties predictably (no crash).
9.  **`rank_limit_cutoff`**: (If a quota exists for top N passes) Finalize a candidate whose score pushes them to exactly the maximum allowed rank (e.g. 90th). Assert pass.
10. **`kkm_dynamic_update_race`**: While a candidate is viewing the UI, simulate an admin changing the KKM mid-session. Trigger a score update and assert the candidate receives the *new* accurate pass/fail state.

### Feature 3: Interview Scheduling (Rules)
11. **`schedule_minimum_time_accept`**: Propose an interview date exactly 24 hours (or configured 1-day minimum) from the current system time. Assert proposal is accepted.
12. **`schedule_minimum_time_reject`**: Propose an interview date exactly 23 hours, 59 minutes, and 59 seconds from the current system time. Assert rejection/error.
13. **`schedule_accept_deadline_boundary`**: Candidate accepts an interview invitation exactly at the last possible minute before the session locks/expires. Assert acceptance is logged.
14. **`hr_quota_exact_limit`**: HR proposes an interview that perfectly fills their daily quota limit (e.g. 5th interview for a 5-interview quota). Assert accepted.
15. **`hr_quota_exceeded_limit`**: HR attempts to propose an interview that exceeds their quota by exactly 1. Assert rejection with a quota-limit warning.

### Feature 4: AI Interview Questions & Scoring
16. **`ai_minimum_input_fallback`**: Feed the AI recommendation system an extremely short technical test transcript (e.g. "ok" or 1 character). Assert AI UI does not crash and provides a fallback question.
17. **`ai_maximum_input_truncate`**: Feed a massively long transcript (e.g. 100,000+ characters) to the AI endpoint. Assert it handles token limits gracefully (truncates or returns error) without bringing down the UI.
18. **`score_numeric_boundaries`**: HR inputs exactly the minimum allowed score (0) and maximum allowed score (100). Assert calculations succeed.
19. **`score_invalid_input`**: HR attempts to submit a negative score (-1) or a decimal (99.9) where only integers are allowed. Assert validation prevents submission.
20. **`ai_service_500_fallback`**: Mock the AI service to return a 500 error. Assert the HR UI displays a graceful empty/error state, allowing manual interviewing to continue without blocking the entire page.

### Feature 5: Multi-Tier Accounts & Limits
21. **`job_deadline_exact_accept`**: Candidate submits an application exactly 1 second before the job posting deadline. Assert application is received.
22. **`job_deadline_exact_reject`**: Candidate submits an application exactly on the deadline timestamp or 1 second after. Assert automatic rejection.
23. **`subaccount_max_creation`**: Main Account creates exactly the maximum allowed number of Sub-Accounts. Assert successful creation, and then assert the (Max + 1) attempt is blocked.
24. **`subaccount_unauthorized_api`**: A Sub-Account attempts to delete a job posting or modify KKM (Admin actions). Assert UI buttons are hidden, and direct API mocks return 403 Forbidden.
25. **`session_invalidation_mid_action`**: Revoke a Sub-Account's permissions (via Admin) while the Playwright session for the Sub-Account is actively viewing a protected route. Attempt an action. Assert the action is blocked and user is redirected/logged out.

## 5. Verification Method
- **Implementation Location**: To verify this design, implement these tests in `d:/projects/JHIC-rev/e2e/tests/tier2/`.
- **Command**: Run `npx playwright test --project=tier2` (or equivalent configured command).
- **Invalidation Condition**: The tests will be invalidated if the product owner alters boundary rules (e.g. changing 1-2 days rule to a strictly business-days rule, or removing quotas entirely).
