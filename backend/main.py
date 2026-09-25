from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import database
import models
from routers import jobs, auth, applications, assessment, candidates, notifications, interviews, biosphere, seed

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Ensure Database Tables Exist
models.Base.metadata.create_all(bind=database.engine)

# Auto-seed initial demo accounts on startup & ensure password123 hash is up-to-date
def seed_demo_accounts():
    db = database.SessionLocal()
    try:
        from utils.auth import get_password_hash
        hashed_default = get_password_hash("password123")
        hashed_admin = get_password_hash("admin")
        hashed_user = get_password_hash("user")
        
        # Ensure company exists
        company = db.query(models.Company).filter(models.Company.name == "Skillens Tech").first()
        if not company:
            company = models.Company(name="Skillens Tech")
            db.add(company)
            db.commit()
            db.refresh(company)

        # Candidate Demo Account (candidate@skillens.com & kandidat@skillens.com)
        for cand_email in ["candidate@skillens.com", "kandidat@skillens.com"]:
            candidate = db.query(models.User).filter(models.User.email == cand_email).first()
            if not candidate:
                candidate = models.User(
                    email=cand_email,
                    hashed_password=hashed_default,
                    role="candidate",
                    full_name="Candidate Demo"
                )
                db.add(candidate)
                db.commit()
                db.refresh(candidate)
                profile = models.CandidateProfile(user_id=candidate.id)
                db.add(profile)
                db.commit()
            else:
                candidate.hashed_password = hashed_default
                db.commit()
            
        # Recruiter Demo Account (recruiter@skillens.com)
        recruiter = db.query(models.User).filter(models.User.email == "recruiter@skillens.com").first()
        if not recruiter:
            recruiter = models.User(
                email="recruiter@skillens.com",
                hashed_password=hashed_default,
                role="recruiter",
                full_name="Recruiter Demo",
                company_id=company.id
            )
            db.add(recruiter)
            db.commit()
        else:
            recruiter.hashed_password = hashed_default
            recruiter.company_id = company.id
            db.commit()

        # Admin Demo Accounts (admin / admin, admin@skillens.com / admin123, admin@admin.com / admin)
        for adm_email, adm_pwd, adm_role in [
            ("admin", hashed_admin, "admin"),
            ("admin@skillens.com", get_password_hash("admin123"), "admin"),
            ("admin@admin.com", hashed_admin, "admin"),
        ]:
            adm = db.query(models.User).filter(models.User.email == adm_email).first()
            if not adm:
                adm = models.User(
                    email=adm_email,
                    hashed_password=adm_pwd,
                    role=adm_role,
                    full_name="Administrator",
                    company_id=company.id
                )
                db.add(adm)
                db.commit()
            else:
                adm.hashed_password = adm_pwd
                adm.company_id = company.id
                db.commit()

        # User Demo Accounts (user / user, user@skillens.com / user123, user@user.com / user)
        for usr_email, usr_pwd in [
            ("user", hashed_user),
            ("user@skillens.com", get_password_hash("user123")),
            ("user@user.com", hashed_user),
        ]:
            usr = db.query(models.User).filter(models.User.email == usr_email).first()
            if not usr:
                usr = models.User(
                    email=usr_email,
                    hashed_password=usr_pwd,
                    role="candidate",
                    full_name="User Demo"
                )
                db.add(usr)
                db.commit()
                db.refresh(usr)
                p = models.CandidateProfile(user_id=usr.id)
                db.add(p)
                db.commit()
            else:
                usr.hashed_password = usr_pwd
                db.commit()
            
        logger.info("Successfully seeded & verified demo accounts (admin, user, recruiter, candidate)")
    except Exception as e:
        logger.error(f"Error seeding demo accounts: {e}")
    finally:
        db.close()

seed_demo_accounts()

app = FastAPI(
    title="Skillens API",
    description="Backend API for Skillens Pre-Screening Platform",
    version="0.1.0"
)

# CORS configuration (FRONTEND_URL env adds the VPS/production domain)
from config import settings as _cors_settings
_extra_origins = [o.strip() for o in (_cors_settings.FRONTEND_URL or "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://skillens.com",
        "https://skillens-app.vercel.app",
        "https://skillens-ai.vercel.app",
        "https://frontend-lime-alpha-rlgfjp477n.vercel.app",
        *_extra_origins,
    ],

    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from limiter import limiter
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Server Error: {str(exc)}"}
    )

from fastapi.staticfiles import StaticFiles
import os

app.include_router(auth.router)
app.include_router(jobs.router)
app.include_router(applications.router)
app.include_router(assessment.router)
app.include_router(candidates.router)
app.include_router(notifications.router)
app.include_router(interviews.router)
app.include_router(biosphere.router)
app.include_router(seed.router)

os.makedirs("uploads", exist_ok=True)

from fastapi.responses import FileResponse
import os as os_mod
from utils import auth as auth_utils
from fastapi import Depends, HTTPException

@app.get("/uploads/{filename}")
def get_upload_file(filename: str):
    from fastapi import HTTPException as HExc
    # Sanitize: only serve files directly inside the uploads directory
    safe_name = os_mod.path.basename(filename)
    file_path = os_mod.path.join("uploads", safe_name)
    if not os_mod.path.exists(file_path):
        raise HExc(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "0.1.0"}

@app.get("/")
def read_root():
    return {"message": "Welcome to Skillens API"}
