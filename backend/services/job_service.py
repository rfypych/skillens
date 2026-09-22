from sqlalchemy.orm import Session
from sqlalchemy import select
from fastapi import HTTPException, BackgroundTasks
from typing import List
import uuid
import logging
import models, schemas
from tasks import generate_assessment_for_job, generate_assessment_for_job_sync

def create_job(db: Session, job: schemas.JobCreate, current_user: models.User) -> models.Job:
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Only recruiters can create jobs")
        
    magic_token = str(uuid.uuid4())
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
        max_questions=job.max_questions,
        archetype=(job.archetype or "teknis").lower(),
        kkm_score=job.kkm_score,
        deadline=job.deadline,
        status="open",
        magic_link_token=magic_token
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    
    # Generate the assessment (scenario + trap word) deterministically.
    # By default (USE_CELERY=False) the scenario is generated inline so the job is
    # always usable. Celery is only used when explicitly enabled and a worker runs.
    # If even the inline generation fails, seed a default scenario so the job never
    # silently lacks an assessment.
    logger = logging.getLogger(__name__)
    generated = False
    from config import settings as app_settings
    if app_settings.USE_CELERY:
        try:
            generate_assessment_for_job.delay(db_job.id)
            generated = True
        except Exception as e:
            logger.warning(f"Celery task failed, generating assessment inline: {e}")

    if not generated:
        try:
            generate_assessment_for_job_sync(db_job.id)
        except Exception as inline_e:
            logger.error(f"Inline assessment generation failed: {inline_e}")
            try:
                import random
                trap_words = ["mentimun", "jerapah", "kulkas", "sepeda", "semangka", "kalkulator", "lemari", "jendela", "bantal", "gajah", "durian", "payung", "sepatu", "sendok", "garpu"]
                db.add(models.Assessment(
                    job_id=db_job.id,
                    scenario_prompt=(
                        "### Background Context\nYou are joining a fast-growing product team on a critical week.\n\n"
                        "### The Challenge\nA production incident has just been reported and the team is under pressure to deliver a solution.\n\n"
                        "### Your Mission\n1. Explain how you would diagnose the issue.\n2. Propose a step-by-step action plan.\n3. Describe how you would communicate with stakeholders."
                    ),
                    hidden_prompt=random.choice(trap_words),
                ))
                db.commit()
            except Exception as seed_e:
                logger.error(f"Default assessment seeding failed: {seed_e}")
    return db_job

def get_jobs(db: Session, skip: int = 0, limit: int = 100) -> List[models.Job]:
    from sqlalchemy.orm import selectinload
    jobs = db.query(models.Job)\
        .options(selectinload(models.Job.applications).load_only(models.Application.id))\
        .filter(models.Job.status == "open")\
        .offset(skip).limit(limit).all()
    return jobs

def get_my_jobs(db: Session, current_user: models.User, skip: int = 0, limit: int = 100) -> List[models.Job]:
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Only recruiters can view their managed jobs")
    from sqlalchemy.orm import selectinload
    query = db.query(models.Job).options(selectinload(models.Job.applications).load_only(models.Application.id))
    
    if current_user.company_id:
        company_users = select(models.User.id).where(models.User.company_id == current_user.company_id)
        query = query.filter(models.Job.owner_id.in_(company_users))
    else:
        query = query.filter(models.Job.owner_id == current_user.id)
        
    jobs = query.offset(skip).limit(limit).all()
    return jobs

def get_job(db: Session, job_id: int) -> models.Job:
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

def get_job_by_magic(db: Session, token: str) -> models.Job:
    job = db.query(models.Job).filter(models.Job.magic_link_token == token).first()
    if job is None:
        raise HTTPException(status_code=404, detail="Invalid magic link")
    if job.status != "open":
        raise HTTPException(status_code=400, detail="Job posting is closed")
    return job

# ── JD Debiasing Check (heuristik ringan, tanpa LLM) ──
BIASED_PATTERNS = [
    (r"\b(muda|berusia muda|fresh graduate saja|usia maksimal \d+)\b", "Hindari batasan usia; ganti dengan kebutuhan pengalaman."),
    (r"\b(laki-?laki|perempuan|cowok|cewek|cantik|ganteng)\b", "Hindari penyebutan gender/fisik; fokus pada kompetensi."),
    (r"\b(agresif|dominan|ninja|rockstar|guru|jagoan)\b", "Gunakan bahasa netral: 'proaktif', 'kolaboratif', 'berpengalaman'."),
    (r"\b(suku|agama|ras|berdarah|pribumi|non-?pribumi)\b", "Hindari referensi SARA; fokus pada keterampilan."),
    (r"\b(mustahil|tidak cocok untuk (wanita|perempuan|difabel|disabilitas))\b", "Kalimat eksklusif; ganti dengan akomodasi yang tersedia."),
    (r"\b(kerja lembur terus|siap lembur setiap hari|tanpa kehidupan)\b", "Hindari ekspektasi overwork; jelaskan jam kerja wajar."),
]

INCLUSIVE_TIPS = [
    "Gunakan 'Anda' yang netral dan sebutkan akomodasi disabilitas.",
    "Ganti syarat usia dengan rentang pengalaman yang terukur.",
    "Tambahkan kalimat: 'Kami mendorong pelamar dari semua latar belakang.'",
]

def check_jd_bias(title: str = "", description: str = "", expected_outcomes: str = "", specific_skills: str = "") -> dict:
    import re
    text = f"{title}\n{description}\n{expected_outcomes}\n{specific_skills}"
    issues = []
    for pattern, suggestion in BIASED_PATTERNS:
        for m in re.finditer(pattern, text, flags=re.IGNORECASE):
            issues.append({"match": m.group(0), "suggestion": suggestion})
            if len(issues) >= 10:
                break
    bias_score = min(100, len(issues) * 20)
    return {
        "bias_score": bias_score,
        "label": "Rendah" if bias_score < 20 else ("Sedang" if bias_score < 60 else "Tinggi"),
        "issues": issues,
        "suggestions": INCLUSIVE_TIPS if issues else ["Deskripsi sudah inklusif. Pertahankan bahasa netral."],
    }

def update_job(db: Session, job_id: int, job_update: schemas.JobUpdate, current_user: models.User) -> models.Job:
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if current_user.company_id:
        company_users = select(models.User.id).where(models.User.company_id == current_user.company_id)
        job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id.in_(company_users)).first()
    else:
        job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    update_data = job_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(job, key, value)
        
    db.commit()
    db.refresh(job)
    return job

def delete_job(db: Session, job_id: int, current_user: models.User):
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    if current_user.company_id:
        company_users = select(models.User.id).where(models.User.company_id == current_user.company_id)
        job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id.in_(company_users)).first()
    else:
        job = db.query(models.Job).filter(models.Job.id == job_id, models.Job.owner_id == current_user.id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job.status = "closed"
    db.commit()
    return {"message": "Job successfully closed"}
