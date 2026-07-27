## 2026-07-13T20:00:21Z
You are a Worker for Milestone 1 of Tier 2 E2E Tests (Iteration 2).
Scope: Feature 1: Candidate Registration boundary tests. The test file is at `e2e/tests/tier2/candidate-registration-boundary.spec.ts`.
Working directory: d:/projects/JHIC-rev/.agents/teamwork_preview_worker_m1_iter2.

Feedback from Reviewers and Challengers on the previous implementation:
1. False Negatives on Size Tests: The 5MB dummy PDF buffers were constructed using just `'a'` characters. A proper backend rejects these for missing PDF magic bytes before even checking size. You MUST prepend `%PDF-` to all PDF buffers (e.g., `Buffer.concat([Buffer.from('%PDF-'), Buffer.alloc(size - 5, 'a')])`).
2. Broken Email Validation Test: The test submitted an invalid PDF and accepted any UI error as proof of email validation. Ensure the email validation test uploads a *valid* PDF (e.g. with `%PDF-` and <= 5MB) so the backend evaluates the email field.
3. Spoofing Test Flaw: The previous test just set `mimeType: 'text/plain'` on a `.pdf`. Fix this to test real MIME spoofing (e.g., a file with a non-PDF payload faking `application/pdf`).
4. Playwright Anti-pattern: Do not wrap `expect(...).toBeVisible()` in a `try/catch` block. Use `await errorLocator.isVisible()` or proper non-flaky assertions.

MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.

Rewrite the tests in `e2e/tests/tier2/candidate-registration-boundary.spec.ts` to address these issues. Output your findings in a handoff.md file in your working directory and notify me when done.
