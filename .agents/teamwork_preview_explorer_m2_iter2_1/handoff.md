# Handoff Report

## 1. Observation
- Inspected `backend/services/job_service.py` at line 13-27. The `create_job` function instantiates a new `models.Job` but explicitly maps fields individually from the `schemas.JobCreate` object (`job.title`, `job.description`, etc.).
- The `kkm_score` and `max_questions` fields exist in `schemas.JobCreate` (inherited from `JobBase`) and `models.Job`, but they are omitted in the `models.Job(...)` constructor inside `create_job`.
- As a result, when a new job is created, the database falls back to the default `kkm_score` defined in the model, which is `0.0`.
- Inspected `backend/routers/candidates.py` `get_applications` endpoint at line 91. The `passed_kkm` logic is implemented as `app_resp.passed_kkm = score >= job.kkm_score`. Since `job.kkm_score` is effectively `0.0`, all candidates with a score `> 0.0` incorrectly pass.
- Verified that `backend/services/job_service.py`'s `update_job` correctly updates fields using a dynamic loop (`job_update.dict(exclude_unset=True)`), meaning the bug only happens on job creation.

## 2. Logic Chain
1. The frontend or API caller correctly passes `kkm_score` when calling `POST /api/jobs/`.
2. The payload reaches `backend/services/job_service.py:create_job` as `job: schemas.JobCreate`.
3. Due to manually mapping fields into `models.Job`, the `kkm_score` attribute is dropped because it is missing from the constructor arguments.
4. The database default `kkm_score=0.0` is persisted instead.
5. In `get_applications`, the comparison `score >= job.kkm_score` evaluates to `score >= 0.0`. 
6. This logically breaks the milestone requirement, falsely assigning `passed_kkm: True` to candidates with low scores.

## 3. Caveats
- There is a noticeable performance flaw in `backend/routers/candidates.py:get_applications`. Calculating the rank involves pulling all applications for every job the candidate applied to, and lazy-loading their `assessment_results` and `job` objects in a loop. This results in severe N+1 query patterns. However, this is a scaling issue, not a correctness issue for KKM tracking.

## 4. Conclusion
The root cause of the broken KKM tracking is the manual instantiation of the `Job` model in `create_job` missing the `kkm_score` field. 

**Recommended Fix Strategy:**
1. **Fix Job Creation**: In `backend/services/job_service.py:create_job` (around line 13), add `kkm_score=job.kkm_score` to the `models.Job()` constructor.
   ```python
   # Recommended change in backend/services/job_service.py
   db_job = models.Job(
       owner_id=current_user.id,
       title=job.title,
       description=job.description,
       expected_outcomes=job.expected_outcomes,
       specific_skills=job.specific_skills,
       compliance_criteria=job.compliance_criteria,
       language=job.language,
       location=job.location,
       salary_range=job.salary_range,
       job_type=job.job_type,
       deadline=job.deadline,
       status="open",
       magic_link_token=magic_token,
       kkm_score=job.kkm_score,         # <-- ADD THIS
       max_questions=job.max_questions  # <-- ADD THIS AS WELL
   )
   ```
2. **Optimize `get_applications` (Optional but highly recommended)**: Refactor the rank computation in `backend/routers/candidates.py` to use a SQL Window function (`RANK() OVER (PARTITION BY job_id ORDER BY overall_score DESC)`) to evaluate rankings and KKM at the database level rather than fetching entire application tables into Python memory.

## 5. Verification Method
- After applying the fix, run the test script: `python .agents/teamwork_preview_challenger_m2_3/test_m2.py`.
- It should pass successfully without the `Cand2 should not have passed KKM` assertion error, because Cand2's score (70) will now be correctly compared against the job's actual KKM score (75).
