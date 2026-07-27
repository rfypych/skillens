import asyncio
import sys
import os
import json

# Ensure backend directory is in path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
import models
from services.ai_evaluator import evaluate_candidate_answer_task

async def test_personas():
    db = SessionLocal()
    try:
        # 1. Create Dummy Job & User
        print("Setting up dummy data...")
        company = db.query(models.Company).first()
        if not company:
            company = models.Company(name="Test Corp")
            db.add(company)
            db.commit()

        user = db.query(models.User).filter_by(email="test@genius.com").first()
        if not user:
            user = models.User(email="test@genius.com", hashed_password="pw", full_name="John Doe", company_id=company.id)
            db.add(user)
            db.commit()

        job = db.query(models.Job).filter_by(title="Senior Backend Engineer (Test)").first()
        if not job:
            job = models.Job(
                owner_id=user.id,
                title="Senior Backend Engineer (Test)",
                description="Test job",
                expected_outcomes="Build scalable APIs.",
                specific_skills="Python, PostgreSQL, FastAPI",
                language="Indonesian"
            )
            db.add(job)
            db.commit()
            
        # 2. Persona A: The Genius Human
        # Fast typing (10 CPS), 0 backspaces, no pasting, direct and clean code
        genius_answer = json.dumps([
            {"role": "user", "content": "Tolong perbaiki N+1 query ini."},
            {"role": "assistant", "content": "Berikut solusinya menggunakan SQLAlchemy joinedload:\n```python\nquery = db.query(User).options(joinedload(User.company)).all()\n```\nIni akan melakukan JOIN di level database."}
        ])
        
        genius_telemetry = {
            "total_chars": 150, 
            "backspace_count": 0, 
            "backspace_ratio": 0.0
        }

        app1 = models.Application(user_id=user.id, job_id=job.id, status="testing")
        db.add(app1)
        db.commit()

        res1 = models.AssessmentResult(
            application_id=app1.id,
            candidate_answer=genius_answer,
            tab_switches=0,
            copy_paste_attempts=0,
            time_taken_seconds=15, # 150 chars / 15s = 10 CPS (Fast human)
            keystroke_metrics=json.dumps(genius_telemetry)
        )
        db.add(res1)
        db.commit()

        # 3. Persona B: The Cheater (ChatGPT)
        # 1500 chars in 10 seconds, pasted, AI style language
        cheater_answer = json.dumps([
            {"role": "user", "content": "Tolong perbaiki N+1 query ini."},
            {"role": "assistant", "content": "Tentu, saya dapat membantu Anda dengan masalah tersebut! Isu N+1 Query adalah masalah umum dalam ORM. Berikut adalah penjelasan mendetail dan solusinya...\n\n```python\nquery = db.query(User).options(joinedload(User.company)).all()\n```\n\nSemoga ini membantu! Beritahu saya jika ada pertanyaan lain."}
        ])
        
        cheater_telemetry = {
            "total_chars": 1500, 
            "backspace_count": 0, 
            "backspace_ratio": 0.0
        }

        app2 = models.Application(user_id=user.id, job_id=job.id, status="testing")
        db.add(app2)
        db.commit()

        res2 = models.AssessmentResult(
            application_id=app2.id,
            candidate_answer=cheater_answer,
            tab_switches=3,
            copy_paste_attempts=1,
            time_taken_seconds=10, # 1500 chars / 10s = 150 CPS (Impossible for human)
            keystroke_metrics=json.dumps(cheater_telemetry)
        )
        db.add(res2)
        db.commit()

        print("\n🤖 Running AI Evaluator for Persona A (The Genius Human)...")
        await evaluate_candidate_answer_task(app1.id, res1.id)
        
        print("🤖 Running AI Evaluator for Persona B (The ChatGPT Cheater)...")
        await evaluate_candidate_answer_task(app2.id, res2.id)

        # 4. Fetch and Print Results
        db.refresh(res1)
        db.refresh(res2)

        print("\n" + "="*50)
        print("🧑‍💻 HASIL PERSONA A (Manusia Jenius & Cepat):")
        print(f"Skor Keseluruhan : {res1.overall_score}")
        print(f"Label AI         : {res1.claim_vs_evidence_label}")
        print(f"Tuduhan Curang?  : {res1.ai_cheating_detected}")
        print(f"Feedback Juri    : {res1.evaluation_feedback}")
        
        print("\n" + "="*50)
        print("🤖 HASIL PERSONA B (Pelaku Copy-Paste / Bot):")
        print(f"Skor Keseluruhan : {res2.overall_score}")
        print(f"Label AI         : {res2.claim_vs_evidence_label}")
        print(f"Tuduhan Curang?  : {res2.ai_cheating_detected}")
        print(f"Feedback Juri    : {res2.evaluation_feedback}")
        print("="*50)

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(test_personas())
