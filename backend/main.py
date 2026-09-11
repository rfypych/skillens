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
        hashed = get_password_hash("password123")
        
        # Candidate Demo Account
        candidate = db.query(models.User).filter(models.User.email == "candidate@skillens.com").first()
        if not candidate:
            candidate = models.User(
                email="candidate@skillens.com",
                hashed_password=hashed,
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
            candidate.hashed_password = hashed
            db.commit()
            
        # Recruiter Demo Account
        recruiter = db.query(models.User).filter(models.User.email == "recruiter@skillens.com").first()
        if not recruiter:
            company = db.query(models.Company).filter(models.Company.name == "Skillens Tech").first()
            if not company:
                company = models.Company(name="Skillens Tech")
                db.add(company)
                db.commit()
                db.refresh(company)
            recruiter = models.User(
                email="recruiter@skillens.com",
                hashed_password=hashed,
                role="recruiter",
                full_name="Recruiter Demo",
                company_id=company.id
            )
            db.add(recruiter)
            db.commit()
        else:
            recruiter.hashed_password = hashed
            db.commit()
            
        logger.info("Successfully seeded & reset demo accounts (candidate@skillens.com & recruiter@skillens.com / password123)")
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

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://skillens.com",
        "https://skillens-app.vercel.app",
        "https://skillens-ai.vercel.app",
        "https://frontend-lime-alpha-rlgfjp477n.vercel.app"
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
