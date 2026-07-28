import sys
import os

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal, engine, Base
import models
from utils.auth import get_password_hash

def seed():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Seeding Company...")
        company = db.query(models.Company).filter_by(name="Skillens Tech Indonesia").first()
        if not company:
            company = models.Company(
                name="Skillens Tech Indonesia",
                description="Platform penilaian bakat AI interaktif terdepan di Indonesia."
            )
            db.add(company)
            db.commit()
            db.refresh(company)

        print("Seeding Recruiter User...")
        recruiter = db.query(models.User).filter_by(email="recruiter@skillens.com").first()
        if not recruiter:
            recruiter = models.User(
                email="recruiter@skillens.com",
                hashed_password=get_password_hash("password123"),
                role="recruiter",
                full_name="HR Manager (Skillens Demo)",
                company_id=company.id
            )
            db.add(recruiter)
            db.commit()
            db.refresh(recruiter)

        print("Seeding Candidate User...")
        candidate = db.query(models.User).filter_by(email="kandidat@skillens.com").first()
        if not candidate:
            candidate = models.User(
                email="kandidat@skillens.com",
                hashed_password=get_password_hash("password123"),
                role="candidate",
                full_name="Budi Santoso (Kandidat Demo)"
            )
            db.add(candidate)
            db.commit()
            db.refresh(candidate)

        print("Seeding Sample Job Posting...")
        job = db.query(models.Job).filter_by(title="Senior Frontend Engineer (React / Next.js)").first()
        if not job:
            job = models.Job(
                title="Senior Frontend Engineer (React / Next.js)",
                description="Kami mencari Senior Frontend Engineer berpengalaman untuk mengembangkan antarmuka Skillens AI Platform.",
                expected_outcomes="Mengembangkan UI responsive modern, integrasi WebGL shaders, dan REST API authentication.",
                specific_skills="React, Next.js 16, TypeScript, Tailwind CSS, WebGL, REST API.",
                compliance_criteria="Minimal 3+ tahun pengalaman kerja bidang Frontend Engineering.",
                language="Indonesian",
                status="active",
                owner_id=recruiter.id
            )
            db.add(job)
            db.commit()

        print("\nSeed successful! Test Credentials Created:")
        print("------------------------------------------")
        print("RECRUITER / REKRUTER:")
        print("  Email:    recruiter@skillens.com")
        print("  Password: password123")
        print("  Role:     recruiter")
        print("\nCANDIDATE / KANDIDAT:")
        print("  Email:    kandidat@skillens.com")
        print("  Password: password123")
        print("  Role:     candidate")
        print("------------------------------------------")

    except Exception as e:
        print("Error during seeding:", e)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
