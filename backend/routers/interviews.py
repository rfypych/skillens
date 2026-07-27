from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List, Optional
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from database import get_db
import models, schemas
from utils.auth import get_current_user

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)

# --- Schemas ---

class InterviewScheduleCreate(BaseModel):
    application_id: int
    scheduled_at: datetime
    location: Optional[str] = None
    notes: Optional[str] = None

class InterviewResponse(BaseModel):
    id: int
    application_id: int
    scheduled_at: datetime
    location: Optional[str] = None
    notes: Optional[str] = None
    status: str  # "pending", "accepted", "rejected", "completed"
    interview_score: Optional[float] = None
    score_notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class InterviewScoreUpdate(BaseModel):
    interview_score: float
    score_notes: Optional[str] = None


def _notify_user(db: Session, user_id: int, message: str):
    notif = models.Notification(user_id=user_id, message=message)
    db.add(notif)


# --- Routes ---

@router.post("/", response_model=InterviewResponse)
def create_interview(
    payload: InterviewScheduleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """HR schedules an interview for a candidate. Minimum 1 day notice required."""
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Only recruiters can schedule interviews")

    app = db.query(models.Application).filter(
        models.Application.id == payload.application_id
    ).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Verify the job belongs to the current user's company
    job = app.job
    if job.owner.company_id != current_user.company_id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized for this application")

    # Enforce minimum 1-day notice (using timezone-aware datetime)
    now = datetime.now(timezone.utc)
    scheduled_at = payload.scheduled_at
    if scheduled_at.tzinfo is None:
        scheduled_at = scheduled_at.replace(tzinfo=timezone.utc)

    if scheduled_at < now + timedelta(days=1):
        raise HTTPException(
            status_code=400,
            detail="Interview must be scheduled at least 1 day in advance"
        )

    # Check if interview already exists
    existing = db.query(models.Interview).filter(
        models.Interview.application_id == payload.application_id,
        models.Interview.status.in_(["pending", "accepted"])
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="An active interview already exists for this application")

    interview = models.Interview(
        application_id=payload.application_id,
        scheduled_at=scheduled_at,
        location=payload.location,
        notes=payload.notes,
        status="pending"
    )
    db.add(interview)

    # Update application status
    app.status = "interview"

    # Notify candidate
    _notify_user(
        db, app.user_id,
        f"You have been invited for an interview for '{job.title}' on {scheduled_at.strftime('%d %b %Y %H:%M')} UTC. Please accept or decline."
    )

    db.commit()
    db.refresh(interview)
    return interview


@router.get("/my", response_model=List[InterviewResponse])
def get_my_interviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Candidate: get their own interview invitations."""
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can access this endpoint")

    app_ids = [a.id for a in current_user.applications]
    if not app_ids:
        return []

    interviews = db.query(models.Interview).filter(
        models.Interview.application_id.in_(app_ids)
    ).order_by(desc(models.Interview.created_at)).all()
    return interviews


@router.get("/recruiter", response_model=List[InterviewResponse])
def get_recruiter_interviews(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Recruiter: get all interviews for their jobs."""
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Only recruiters can access this endpoint")

    # Get all job IDs for this recruiter's company
    job_ids = db.query(models.Job.id).filter(
        models.Job.owner.has(company_id=current_user.company_id)
    ).scalar_subquery()

    app_ids = db.query(models.Application.id).filter(
        models.Application.job_id.in_(job_ids)
    ).scalar_subquery()

    interviews = db.query(models.Interview).filter(
        models.Interview.application_id.in_(app_ids)
    ).order_by(desc(models.Interview.scheduled_at)).all()
    return interviews


@router.put("/{interview_id}/respond")
def respond_to_interview(
    interview_id: int,
    action: str,  # "accept" or "reject"
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Candidate accepts or rejects an interview invitation."""
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can respond to interviews")

    if action not in ("accept", "reject"):
        raise HTTPException(status_code=400, detail="Action must be 'accept' or 'reject'")

    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    # Verify this interview belongs to the candidate
    app = interview.application
    if app.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not your interview")

    if interview.status != "pending":
        raise HTTPException(status_code=400, detail=f"Interview is already {interview.status}")

    interview.status = "accepted" if action == "accept" else "rejected"

    # Notify the recruiter
    recruiter = app.job.owner
    action_text = "accepted" if action == "accept" else "declined"
    _notify_user(
        db, recruiter.id,
        f"{app.user.full_name or app.user.email} has {action_text} the interview for '{app.job.title}'."
    )

    db.commit()
    return {"status": interview.status, "message": f"Interview {action_text} successfully"}


@router.put("/{interview_id}/score", response_model=InterviewResponse)
def score_interview(
    interview_id: int,
    payload: InterviewScoreUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """HR submits post-interview score for final ranking."""
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Only recruiters can score interviews")

    if not (0 <= payload.interview_score <= 100):
        raise HTTPException(status_code=400, detail="Score must be between 0 and 100")

    interview = db.query(models.Interview).filter(
        models.Interview.id == interview_id
    ).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    interview.interview_score = payload.interview_score
    interview.score_notes = payload.score_notes
    interview.status = "completed"

    # Notify candidate
    _notify_user(
        db, interview.application.user_id,
        f"Your interview for '{interview.application.job.title}' has been completed. Results will be communicated soon."
    )

    db.commit()
    db.refresh(interview)
    return interview


@router.get("/recommend/{job_id}", response_model=List[schemas.ApplicationResponse])
def recommend_candidates(
    job_id: int,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """HR gets AI-ranked recommended candidates based on assessment scores vs KKM."""
    if current_user.role not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Only recruiters can get recommendations")

    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    # Get all evaluated applications with scores above KKM
    apps = db.query(models.Application).filter(
        models.Application.job_id == job_id,
        models.Application.status.in_(["evaluated", "interview"])
    ).all()

    # Filter by KKM and sort by score descending
    def get_score(a):
        if a.assessment_results:
            s = a.assessment_results[0].overall_score
            return s if s is not None else -1.0
        return -1.0

    kkm = job.kkm_score or 0.0
    filtered = [a for a in apps if get_score(a) >= kkm]
    filtered.sort(key=get_score, reverse=True)

    return filtered[:limit]
