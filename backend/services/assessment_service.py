import logging
from sqlalchemy.orm import Session
from fastapi import HTTPException, BackgroundTasks
import models, schemas
import asyncio
from services.ai_evaluator import evaluate_candidate_answer_task

logger = logging.getLogger(__name__)

def run_ai_eval_sync(application_id: int, result_id: int):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(evaluate_candidate_answer_task(application_id, result_id))
    loop.close()

import uuid
import os
from fastapi import UploadFile
from typing import Optional
from utils.auth import create_access_token
from services.pdf_extractor import extract_pdf_text

def apply_for_job(
    db: Session, 
    job_id: int, 
    payload: schemas.ApplicationCreate, 
    file: Optional[UploadFile] = None,
    current_user: Optional[models.User] = None
) -> models.Application:
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    from datetime import datetime, timezone
    if job.deadline and datetime.now(timezone.utc) > job.deadline:
        raise HTTPException(status_code=400, detail="Job posting expired")

    if current_user:
        user = current_user
    else:
        if not payload.name or not payload.email:
            raise HTTPException(status_code=400, detail="Name and email are required for guest applications")
        user = db.query(models.User).filter(models.User.email == payload.email).first()
        if not user:
            import secrets
            from utils.auth import get_password_hash
            dummy_hash = get_password_hash(secrets.token_urlsafe(32))
            user = models.User(
                email=payload.email,
                hashed_password=dummy_hash,
                full_name=payload.name,
                role="candidate"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    assessment = db.query(models.Assessment).filter(models.Assessment.job_id == job.id).first()
    hidden_prompt = assessment.hidden_prompt if assessment else "mentimun"

    resume_url = None
    resume_text = None

    if file and file.filename:
        if file.content_type != "application/pdf" or not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=400, detail="Only PDF resumes are supported")

        # UploadFile has no `.size` attribute on starlette 0.41 — read bytes then check length.
        try:
            file_bytes = file.file.read()
        except Exception:
            raise HTTPException(status_code=400, detail="Failed to read the uploaded resume")

        if len(file_bytes) > 5 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")

        unique_filename = f"{uuid.uuid4()}.pdf"
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, unique_filename)
        
        try:
            with open(file_path, "wb") as buffer:
                buffer.write(file_bytes)
            
            resume_url = f"/uploads/{unique_filename}"
            
            # Extract text using pypdf, falling back to OCR for scanned PDFs
            resume_text = extract_pdf_text(file_path)
            
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            raise HTTPException(status_code=500, detail=f"Failed to process PDF resume: {str(e)}")

    # ── Auto-use stored profile CV if no new file was uploaded ──────────────────
    if not resume_url and current_user and hasattr(current_user, 'profile') and current_user.profile:
        profile_resume = current_user.profile.resume_url
        if profile_resume:
            resume_url = profile_resume
            # Try to re-extract text from locally stored PDF
            local_path = profile_resume.lstrip('/')  # strip leading slash for relative path
            if os.path.exists(local_path):
                try:
                    resume_text = extract_pdf_text(local_path)
                except Exception:
                    resume_text = None  # non-fatal; AI will still get the resume URL

    new_app = models.Application(
        user_id=user.id,
        job_id=job.id,
        hidden_prompt=hidden_prompt,
        status="testing",
        resume_url=resume_url,
        resume_text=resume_text
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    # Generate token so guest candidate can access interactive assessment
    access_token = create_access_token(data={"sub": user.email})
    new_app.access_token = access_token
    
    return new_app

def _job_visible_to(db: Session, job: models.Job, current_user: models.User) -> bool:
    """True if the recruiter/admin may access the given job (same company or admin)."""
    if current_user.role == "admin":
        return True
    if current_user.company_id:
        company_users = [u[0] for u in db.query(models.User.id).filter(models.User.company_id == current_user.company_id).all()]
        return job.owner_id in company_users
    return job.owner_id == current_user.id

def get_job_assessment(db: Session, job_id: int, current_user: models.User):
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job or not _job_visible_to(db, job, current_user):
        raise HTTPException(status_code=404, detail="Job not found")
    assessment = db.query(models.Assessment).filter(models.Assessment.job_id == job_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not ready")
    return {"scenario_prompt": assessment.scenario_prompt, "hidden_prompt": assessment.hidden_prompt}

def update_job_assessment(db: Session, job_id: int, payload: schemas.AssessmentUpdate, current_user: models.User):
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job or not _job_visible_to(db, job, current_user):
        raise HTTPException(status_code=404, detail="Job not found")
    assessment = db.query(models.Assessment).filter(models.Assessment.job_id == job_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    
    if payload.scenario_prompt:
        assessment.scenario_prompt = payload.scenario_prompt
    if payload.hidden_prompt:
        assessment.hidden_prompt = payload.hidden_prompt.strip().lower()
        # Sinkronkan trap word ke aplikasi yang masih testing (belum submit)
        db.query(models.Application).filter(
            models.Application.job_id == job_id,
            models.Application.status == "testing",
        ).update({"hidden_prompt": assessment.hidden_prompt}, synchronize_session=False)
    db.commit()
    return {"message": "Assessment updated successfully"}

def get_assessment_prompt(db: Session, application_id: int, current_user: models.User):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.user_id != current_user.id and current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    assessment = db.query(models.Assessment).filter(models.Assessment.job_id == app.job_id).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not ready")
    # NB: hidden_prompt (anti-cheat trap word) is intentionally NOT exposed to the candidate.
    return {"scenario_prompt": assessment.scenario_prompt}

def submit_assessment(db: Session, application_id: int, payload: schemas.AssessmentSubmit, current_user: models.User, background_tasks: BackgroundTasks = None):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.user_id != current_user.id and current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized to submit this assessment")

    # Guard against duplicate submission — a candidate can only submit once per application.
    existing = db.query(models.AssessmentResult).filter(models.AssessmentResult.application_id == app.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Assessment has already been submitted")

    app.status = "evaluated"
    
    result = models.AssessmentResult(
        application_id=app.id,
        candidate_answer=payload.answer,
        claim_vs_evidence_label="Pending AI Evaluation",
        overall_score=0,
        tab_switches=payload.tab_switches,
        copy_paste_attempts=payload.copy_paste_attempts,
        time_taken_seconds=payload.time_taken_seconds,
        keystroke_metrics=payload.keystroke_metrics,
        replay_history=payload.replay_history
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    # Dispatch AI evaluation. By default (USE_CELERY=False) evaluation runs inline
    # in a background task so a result is always produced even without a Celery
    # worker or Redis. Celery is only used when explicitly enabled and a worker runs.
    from config import settings as app_settings
    if app_settings.USE_CELERY:
        try:
            from tasks import run_ai_eval_sync_task
            run_ai_eval_sync_task.delay(app.id, result.id)
        except Exception as e:
            logger.warning(f"Celery AI eval unavailable ({e}) — running inline in background.")
            _schedule_inline_eval(app.id, result.id, background_tasks)
    else:
        _schedule_inline_eval(app.id, result.id, background_tasks)
    return {"message": "Assessment submitted successfully. AI evaluation started."}


def _schedule_inline_eval(application_id: int, result_id: int, background_tasks: BackgroundTasks = None):
    from tasks import run_ai_eval_sync
    # Run evaluation on a daemon thread decoupled from the request lifecycle.
    # This guarantees the evaluation always starts (and completes) even if the
    # HTTP request is torn down, and lets the submit response return instantly.
    import threading
    threading.Thread(target=run_ai_eval_sync, args=(application_id, result_id), daemon=True).start()

from openai import AsyncOpenAI

async def chat_assessment(db: Session, application_id: int, payload: schemas.ChatRequest, current_user: models.User):
    app = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if app.user_id != current_user.id and current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    job = app.job
    
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_API_BASE")
    model_name = os.getenv("LLM_MODEL_NAME")
    
    client = AsyncOpenAI(
        api_key=api_key, 
        base_url=base_url,
        default_headers={"User-Agent": "Mozilla/5.0"}
    )
    
    system_prompt = f"""You are an expert technical interviewer conducting a Micro-Interview.
You are evaluating a candidate for the following role:
Job Title: {job.title}
Job Outcomes (Expectations): {job.expected_outcomes}
Specific Skills Required: {job.specific_skills}

Instructions:
1. Review the conversation history. The first message is the scenario prompt.
2. Ask a short, highly specific, and challenging technical follow-up question based on the candidate's last answer.
3. If their last answer was vague, ask them to explain a specific concept they mentioned in detail.
4. If their answer was comprehensive, introduce a new constraint (e.g., "What if the database goes down?" or "How would you scale this to 10x traffic?").
5. Keep your response brief (max 2-3 sentences). Do NOT provide the answer. ONLY ask the question.
6. CRITICAL: If the candidate has provided 4 answers (this is turn 4), DO NOT ask another question. Instead, thank the candidate for their time, state that the evaluation session is complete, and instruct them to click the 'Kirim Jawaban' button to finish.
7. Speak in {job.language}.
"""
    
    messages = [{"role": "system", "content": system_prompt}]
    for msg in payload.messages:
        messages.append({"role": msg.role, "content": msg.content})
        
    try:
        response = await client.chat.completions.create(
            model=model_name,
            messages=messages,
            temperature=0.7,
            max_tokens=150
        )
        reply = response.choices[0].message.content.strip()
    except Exception as e:
        # Fallback handling for RateLimits or other API errors
        error_msg = str(e)
        logger.warning(f"LLM API Error: {error_msg}")
        raise HTTPException(status_code=503, detail="AI Service is currently unavailable (Rate limit or provider error). Please try again later.")
        
    return {"reply": reply}
