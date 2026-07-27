# Handoff Report: Candidate Registration Boundary Tests (Tier 2 - Milestone 1)

## 1. Observation
- **Frontend**: The `/signup` route uses `frontend/src/app/signup/page.tsx`. It contains a form with `<input type="email">`, `<input type="text">` for `full_name`, and `<input type="password">`. The frontend enforces standard HTML5 `required` attributes and `type="email"` validation.
- **Backend API**: The form submits to `/auth/signup` via `frontend/src/lib/api.ts`, which catches errors and displays them on the UI.
- **Backend Validation**: `backend/schemas.py` defines `UserCreate`. Pydantic handles validation:
  - `email`: Validated via `EmailStr`.
  - `password`: Enforces minimum length of 8 (`len(v) < 8`), at least one uppercase letter, and at least one digit via custom `@field_validator`.
- **Database Schema**: `backend/models.py` defines `full_name` and `email` as `String`. Because the database is SQLite, `String` types do not have strict character limits enforced at the DB level, and there is no explicit maximum length in the Pydantic schema for `full_name`.
- **Error Handling**: `frontend/src/lib/api.ts` parses Pydantic validation errors and joins them into a string (e.g., `body.password: Password must be at least 8 characters`), which is then rendered in the UI alert box on `/signup`.

## 2. Logic Chain
- **Requirement**: We must test boundary cases and invalid formats without mocking the API or UI.
- **Action**: Tests must interact with the real DOM, input specific boundary values, click submit, and assert the system's reaction (either native DOM validation or API errors rendered on the page).
- **Password boundaries**: We need tests for precisely 7 characters (just below the minimum), missing uppercase, and missing digits. Because `api.ts` formats errors dynamically, we should assert using regex (e.g., `/Password must be at least 8 characters/i`) to ensure the tests aren't brittle to minor prefix changes.
- **Max size boundary**: Testing a `full_name` of 300+ characters will verify how the system handles large inputs. Since SQLite doesn't natively constrain `String` length, we expect this test to succeed (navigate to `/candidate/dashboard`).
- **Format boundary**: For invalid emails (e.g., `invalid-email-no-domain`), the HTML5 `<input type="email">` validation will likely block submission before the API is called. We should assert that `el.validity.typeMismatch` is `true` via `page.$eval` and that the URL remains on `/signup`.

## 3. Caveats
- **Field Size Limits**: The 300-character test for `full_name` is expected to succeed because neither Pydantic nor SQLite explicitly restricts it in the current codebase. If the system is later migrated to PostgreSQL with strict `VARCHAR(255)` limits, this test would fail and need updating.
- **Email Spaces**: We propose a test for an email with leading/trailing spaces. Depending on the Pydantic version (v1 vs v2), `EmailStr` might implicitly trim spaces or throw a validation error. The test should be written to assert the current actual behavior.
- **Browser Tooltips**: Playwright does not capture native HTML5 validation tooltips as standard text elements, which is why we must use `page.$eval('input[name="email"]', el => el.validity.typeMismatch)` to verify native form validation.

## 4. Conclusion
We should implement the following 6 E2E test cases in `e2e/tests/tier2/candidate-registration-boundary.spec.ts`:

1. **Test 1: Password Length Boundary (7 chars)**
   - Fill valid email, `full_name`, and `password`="Valid1!". 
   - Assert: `page.locator('text=/Password must be at least 8 characters/i').toBeVisible()`.
2. **Test 2: Password Complexity (No Uppercase)**
   - Fill valid email, `full_name`, and `password`="valid123!".
   - Assert: `page.locator('text=/Password must contain at least one uppercase letter/i').toBeVisible()`.
3. **Test 3: Password Complexity (No Digit)**
   - Fill valid email, `full_name`, and `password`="ValidPassword!".
   - Assert: `page.locator('text=/Password must contain at least one digit/i').toBeVisible()`.
4. **Test 4: Maximum Field Size (Full Name = 300 chars)**
   - Fill valid email, `password`, and `full_name` with `"A".repeat(300)`.
   - Assert: Form successfully submits and navigates to `**/candidate/dashboard`.
5. **Test 5: Invalid Email Format (Native HTML5 Validation)**
   - Fill `full_name`, valid `password`, and `email`="invalid-email" (no domain).
   - Assert: `await page.$eval('input[name="email"]', el => el.validity.typeMismatch)` is `true`. Page URL remains on `/signup`.
6. **Test 6: Email Format Boundary (Leading/Trailing Spaces)**
   - Fill `full_name`, valid `password`, and `email`="  valid@example.com  ".
   - Assert: Registration either succeeds (backend auto-trims) OR shows an API validation error for invalid email. 

## 5. Verification Method
1. The implementer will create `e2e/tests/tier2/candidate-registration-boundary.spec.ts` with these tests.
2. Run `npx playwright test e2e/tests/tier2/candidate-registration-boundary.spec.ts` from the `e2e` (or root) directory.
3. If all tests pass against the real running application, the boundary cases are properly covered without mocking.
