# Handoff Report

## 1. Observation
- Inspected `backend/services/job_service.py` at lines 13-27. The `create_job` function explicitly instantiates `models.Job` using fields from `schemas.JobCreate` but omits `kkm_score` and `max_questions`.
- Inspected `backend/routers/candidates.py:get_applications` (lines 65-98). For each application a candidate has, it queries the database for *all* applications for the corresponding job (`all_apps = db.query(models.Application).filter(models.Application.job_id == job.id).all()`).
- Then it sorts `all_apps` in memory based on `assessment_results[0].overall_score`. Accessing `a.assessment_results` inside the `get_score(a)` loop triggers lazy-loading queries for each application's assessments.
- KKM validation checks `score >= job.kkm_score`. Because `kkm_score` is never saved, it stays at its default of `0.0`, resulting in a `passed_kkm = True` for any candidate with a score > 0.0.

## 2. Logic Chain
1. The missing assignment of `kkm_score=job.kkm_score` in `job_service.py` causes the `models.Job` object to be created with the default `0.0` value in the database.
2. The missing assignment of `max_questions=job.max_questions` causes it to default to `5` even if provided otherwise.
3. Because the job's KKM is stored as `0.0`, the frontend's evaluation logic and the backend's `/applications` endpoint incorrectly pass everyone who took the assessment.
4. The ranking logic in `candidates.py` fetches `all_apps` for every candidate application. If a job has 1000 applications, fetching `all_apps` triggers 1 query, but then the Python-side sort accesses `a.assessment_results`, which lazy-loads the assessments for all 1000 applications. This results in an N+1 query storm (1001 queries per job applied to), leading to O(N^2) latency and massive memory consumption.

## 3. Caveats
- I did not run the challenger's `test_m2.py` successfully as it was experiencing `ModuleNotFoundError`/`InvalidRequestError` issues due to python pathing and double-importing of the SQLAlchemy Base metadata. Visual inspection definitively confirms the bug.
- I haven't deeply investigated whether the ranking performance issue also applies to recruiter dashboards, but it definitively exists in the candidate dashboard's `get_applications` endpoint.

## 4. Conclusion
To fix the KKM tracking issues and the severe performance bottleneck, implement the following strategy:
1. **Fix Job Creation**: In `backend/services/job_service.py`, update `create_job` to include `kkm_score=job.kkm_score` and `max_questions=job.max_questions` when instantiating `models.Job`.
2. **Optimize Rank Calculation**: Rewrite the `get_applications` logic in `backend/routers/candidates.py` to calculate rank efficiently. Do not query all applications and sort in memory. Instead, use SQLAlchemy's `func.rank().over()` window function partitioned by `job_id` and ordered by `AssessmentResult.overall_score` descending, or use a grouped/joined query to get the rank directly from the database to avoid the N+1 lazy loading trap.

## 5. Verification Method
- **Code Inspection**: Look at `backend/services/job_service.py:create_job` and verify `kkm_score` is assigned.
- **Run Unit Tests**: Write a simple test passing `kkm_score: 75` to POST `/jobs` and verify the GET `/jobs/{id}` returns `kkm_score: 75`.
- **Database Profiling**: Turn on SQL echo (`echo=True` in engine) and hit `/api/candidates/applications` with multiple candidates applied to a job. Verify that it generates a small constant number of SQL queries rather than N queries.
