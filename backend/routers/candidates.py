from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
import os
import shutil
from datetime import datetime

from database import get_db
import models, schemas
from utils.auth import get_current_user
from config import settings

router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"]
)

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload", response_model=schemas.CandidateDocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("resume"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can upload documents")

    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    # Sanitize filename to prevent path traversal / arbitrary file writes
    import uuid as _uuid
    original_name = os.path.basename(file.filename or "resume")
    safe_filename = f"{timestamp}_{_uuid.uuid4().hex[:8]}_{original_name}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_url = f"/uploads/{safe_filename}"

    new_doc = models.CandidateDocument(
        user_id=current_user.id,
        document_type=document_type,
        file_url=file_url,
        name=file.filename
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)

    return new_doc

@router.get("/applications", response_model=List[schemas.CandidateApplicationDetailedResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != "candidate":
        raise HTTPException(status_code=403, detail="Only candidates can view their applications")

    applications = db.query(models.Application).filter(
        models.Application.user_id == current_user.id
    ).order_by(desc(models.Application.created_at)).all()

    results = []
    for app in applications:
        app_resp = schemas.CandidateApplicationDetailedResponse.model_validate(app)
        
        job = app.job
        all_apps = db.query(models.Application).filter(
            models.Application.job_id == job.id
        ).all()
        
        def get_score(a):
            if a.assessment_results and len(a.assessment_results) > 0:
                score = a.assessment_results[0].overall_score
                return score if score is not None else -1.0
            return -1.0
        
        all_apps_sorted = sorted(all_apps, key=get_score, reverse=True)
        
        try:
            rank = all_apps_sorted.index(app) + 1
            app_resp.rank = rank
        except ValueError:
            pass

        if app.assessment_results and len(app.assessment_results) > 0:
            score = app.assessment_results[0].overall_score
            if score is not None and job.kkm_score is not None:
                app_resp.passed_kkm = score >= job.kkm_score
            else:
                app_resp.passed_kkm = False
        else:
            app_resp.passed_kkm = False

        results.append(app_resp)

    return results
