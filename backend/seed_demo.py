"""
Skillens Demo Seeding Script
=============================
Creates realistic demo candidates with full assessment results
for the LKS National demo on 2026-08-14.

Run: python seed_demo.py
"""
import sys, os, json, random
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal
import models
from passlib.context import CryptContext
from datetime import datetime, timezone

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
db = SessionLocal()

# ── Demo recruiter ─────────────────────────────────────────────────────────────

RECRUITER_EMAIL = "demo-recruiter@skillens.id"
RECRUITER_PASS  = "SkillensDemo2024!"

def get_or_create_recruiter():
    rec = db.query(models.User).filter(models.User.email == RECRUITER_EMAIL).first()
    if rec:
        print(f"  [OK] Recruiter already exists: {RECRUITER_EMAIL}")
        return rec
    rec = models.User(
        email=RECRUITER_EMAIL,
        hashed_password=pwd_ctx.hash(RECRUITER_PASS),
        full_name="Demo Recruiter",
        role="recruiter",
        is_active=True,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    print(f"  [+] Recruiter created: {RECRUITER_EMAIL} / {RECRUITER_PASS}")
    return rec

# ── Demo job ───────────────────────────────────────────────────────────────────

JOB_TITLE = "Senior Product Engineer"
JOB_DESC  = """
Kami mencari seorang Senior Product Engineer yang memiliki kemampuan teknis kuat sekaligus 
pemahaman mendalam tentang kebutuhan pengguna. Kandidat ideal mampu memimpin desain solusi 
teknis dari konsep hingga produksi, berkolaborasi lintas tim, dan mengambil keputusan dengan 
data. Pengalaman minimum 3 tahun dalam software engineering, lebih diutamakan yang pernah 
bekerja di startup tahap pertumbuhan.
"""

def get_or_create_job(recruiter: models.User):
    job = db.query(models.Job).filter(models.Job.title == JOB_TITLE).first()
    if job:
        print(f"  [OK] Job already exists: {JOB_TITLE}")
        return job
    job = models.Job(
        title=JOB_TITLE,
        description=JOB_DESC.strip(),
        recruiter_id=recruiter.id,
        is_active=True,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    print(f"  [+] Job created: {JOB_TITLE}")
    return job

# ── Candidate profiles ─────────────────────────────────────────────────────────

CANDIDATES = [
    {
        "name": "Arka Pratama",
        "email": "arka@demo.skillens.id",
        "label": "Highly Validated",
        "score": 87.5,
        "score_problem": 9.0,
        "score_solution": 8.5,
        "score_logic": 8.8,
        "score_comm": 8.2,
        "score_quality": 8.9,
        "tab_switches": 1,
        "copy_paste": 0,
        "ai_cheat": False,
        "time_taken": 1250,
        "wpm": 68,
        "backspace_ratio": 14.5,
        "silence_ratio": 0.38,
        "summary": "Kandidat menunjukkan kemampuan analitik yang sangat kuat dengan pendekatan sistematis. Solusi yang diberikan membuktikan pemahaman mendalam terhadap arsitektur sistem dan trade-off teknis. Tidak ada indikasi kecurangan — pengetikan organik dengan pola refleksi alami.",
        "cheat_note": None,
    },
    {
        "name": "Sinta Maharani",
        "email": "sinta@demo.skillens.id",
        "label": "Hidden Gem",
        "score": 79.2,
        "score_problem": 7.5,
        "score_solution": 8.8,
        "score_logic": 7.2,
        "score_comm": 9.0,
        "score_quality": 8.5,
        "tab_switches": 2,
        "copy_paste": 0,
        "ai_cheat": False,
        "time_taken": 1800,
        "wpm": 42,
        "backspace_ratio": 22.0,
        "silence_ratio": 0.55,
        "summary": "Kandidat memiliki kejelasan komunikasi yang luar biasa — jawaban terstruktur dengan sangat baik meski waktu pengerjaan lebih lama. Pola berpikir mendalam terlihat dari rasio silence yang tinggi. Hidden Gem: latar belakang non-tradisional dengan potensi besar.",
        "cheat_note": None,
    },
    {
        "name": "Rafi Zaidan",
        "email": "rafi@demo.skillens.id",
        "label": "Likely Fabricated",
        "score": 45.0,
        "score_problem": 4.0,
        "score_solution": 5.5,
        "score_logic": 3.5,
        "score_comm": 5.0,
        "score_quality": 4.8,
        "tab_switches": 12,
        "copy_paste": 5,
        "ai_cheat": True,
        "time_taken": 380,
        "wpm": 120,
        "backspace_ratio": 2.1,
        "silence_ratio": 0.04,
        "summary": "Terdeteksi pola kecurangan signifikan: 12 perpindahan tab, 5 peristiwa paste, kecepatan pengetikan jauh di atas normal (120 WPM), dan rasio backspace sangat rendah (2.1%) yang mengindikasikan teks tidak diketik secara organik. Jawaban tidak mencerminkan proses berpikir asli.",
        "cheat_note": "Copy-paste dari sumber eksternal, kemungkinan AI-generated. Waktu pengerjaan 6 menit untuk soal yang umumnya membutuhkan 25-30 menit.",
    },
    {
        "name": "Maya Dewi Santosa",
        "email": "maya@demo.skillens.id",
        "label": "Validated",
        "score": 72.3,
        "score_problem": 7.0,
        "score_solution": 7.5,
        "score_logic": 7.2,
        "score_comm": 7.1,
        "score_quality": 7.3,
        "tab_switches": 3,
        "copy_paste": 0,
        "ai_cheat": False,
        "time_taken": 1560,
        "wpm": 55,
        "backspace_ratio": 18.0,
        "silence_ratio": 0.35,
        "summary": "Kandidat solid dengan performa konsisten di semua dimensi. Kemampuan teknis memadai untuk level mid-senior. Komunikasi baik dan pendekatan terstruktur. Tidak ada red flag behavioral.",
        "cheat_note": None,
    },
    {
        "name": "Deni Kurniawan",
        "email": "deni@demo.skillens.id",
        "label": "Validated",
        "score": 68.0,
        "score_problem": 7.2,
        "score_solution": 6.5,
        "score_logic": 7.0,
        "score_comm": 6.2,
        "score_quality": 6.8,
        "tab_switches": 4,
        "copy_paste": 1,
        "ai_cheat": False,
        "time_taken": 1420,
        "wpm": 48,
        "backspace_ratio": 16.5,
        "silence_ratio": 0.30,
        "summary": "Kandidat menunjukkan kemampuan teknis yang memadai namun komunikasi perlu ditingkatkan. Satu peristiwa paste terdeteksi namun konteksnya wajar (paste dari format tabel). Perlu sesi wawancara lanjutan untuk konfirmasi.",
        "cheat_note": None,
    },
]

# ── Demo chat transcript ──────────────────────────────────────────────────────

def make_transcript(name: str, label: str) -> str:
    if "Fabricated" in label:
        return json.dumps([
            {"role": "assistant", "content": "Halo! Saya adalah asisten evaluasi Skillens. Siap memulai sesi evaluasi Anda. Pertama, ceritakan pendekatan Anda dalam mendesain sistem yang harus menangani 1 juta pengguna konkuren."},
            {"role": "user", "content": "Untuk sistem dengan 1 juta pengguna konkuren, pendekatan yang optimal adalah menggunakan arsitektur microservices dengan load balancing menggunakan Nginx atau HAProxy, implementasi caching layer dengan Redis untuk mengurangi database load, database sharding horizontal untuk distribusi data, CDN untuk static assets, message queue seperti Kafka untuk async processing, dan auto-scaling group di cloud provider."},
            {"role": "assistant", "content": "Jawaban yang komprehensif. Sekarang, bagaimana Anda akan menangani database bottleneck jika terjadi spike traffic mendadak?"},
            {"role": "user", "content": "Database bottleneck dapat diatasi dengan read replicas, connection pooling menggunakan PgBouncer, query optimization dengan proper indexing, materialized views untuk complex queries, dan circuit breaker pattern untuk mencegah cascade failure."},
        ])
    elif "Hidden Gem" in label:
        return json.dumps([
            {"role": "assistant", "content": "Halo! Saya asisten evaluasi Skillens. Mari kita mulai. Ceritakan bagaimana Anda mendekati masalah skalabilitas sistem?"},
            {"role": "user", "content": "Mmm, saya rasa pertama saya ingin memahami dulu — skalabilitas seperti apa yang dimaksud? Horizontal atau vertikal? Karena jawabannya cukup berbeda. Kalau dari pengalaman saya di proyek NGO kemarin, kami tidak punya budget untuk cloud premium, jadi kami harus kreatif..."},
            {"role": "assistant", "content": "Menarik! Bisa ceritakan lebih detail tentang solusi kreatif yang Anda temukan?"},
            {"role": "user", "content": "Kami menggunakan SQLite dengan WAL mode sebetulnya, dan ternyata cukup untuk 50k pengguna dengan proper indexing. Saya belajar bahwa over-engineering itu nyata. Tapi kalau skalanya memang besar, saya akan mulai dari profiling dulu — temukan bottleneck actual sebelum solusi, bukan asumsi."},
        ])
    else:
        return json.dumps([
            {"role": "assistant", "content": "Halo! Saya asisten evaluasi Skillens. Mari kita mulai sesi evaluasi Anda. Bagaimana pendekatan Anda dalam merancang REST API yang scalable?"},
            {"role": "user", "content": f"Terima kasih. Dalam merancang REST API yang scalable, saya biasanya mulai dari desain kontrak API terlebih dahulu menggunakan OpenAPI spec. Kemudian mempertimbangkan versioning strategy — biasanya URI versioning untuk simplicity. Untuk skalabilitas, stateless design adalah kunci sehingga horizontal scaling mudah dilakukan."},
            {"role": "assistant", "content": "Bagus. Bagaimana Anda menangani authentication dan rate limiting?"},
            {"role": "user", "content": "Untuk autentikasi, JWT dengan refresh token pattern adalah pilihan saya karena stateless. Rate limiting bisa dilakukan di gateway level menggunakan sliding window algorithm — lebih fair dibanding fixed window. Untuk production, biasanya saya integrasikan dengan Redis untuk distributed rate limiting."},
        ])

# ── Replay history ────────────────────────────────────────────────────────────

def make_replay(transcript_str: str) -> str:
    transcript = json.loads(transcript_str)
    history = []
    t = 0
    for msg in transcript:
        t += random.randint(8000, 45000)
        history.append({"time": t, "chat": transcript[:transcript.index(msg)+1], "input": msg.get("content", "")})
    return json.dumps(history)

# ── Main seeding ──────────────────────────────────────────────────────────────

def seed():
    print("\n🌱 Skillens Demo Seeder")
    print("=" * 40)

    recruiter = get_or_create_recruiter()
    job = get_or_create_job(recruiter)

    for c in CANDIDATES:
        # Check if candidate already exists
        user = db.query(models.User).filter(models.User.email == c["email"]).first()
        if not user:
            user = models.User(
                email=c["email"],
                hashed_password=pwd_ctx.hash("Demo1234!"),
                full_name=c["name"],
                role="candidate",
                is_active=True,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            print(f"  [+] Candidate: {c['name']} ({c['email']})")
        else:
            print(f"  [OK] Candidate exists: {c['name']}")

        # Check if application already exists
        app = db.query(models.Application).filter(
            models.Application.user_id == user.id,
            models.Application.job_id == job.id,
        ).first()

        if not app:
            app = models.Application(
                user_id=user.id,
                job_id=job.id,
                status="evaluated",
            )
            db.add(app)
            db.commit()
            db.refresh(app)

        # Check if assessment result exists
        existing_result = db.query(models.AssessmentResult).filter(
            models.AssessmentResult.application_id == app.id
        ).first()

        if not existing_result:
            transcript = make_transcript(c["name"], c["label"])
            replay     = make_replay(transcript)

            km = json.dumps({
                "total_chars": int(c["wpm"] * (c["time_taken"] / 60) * 0.6),
                "backspace_count": int(c["backspace_ratio"] * 10),
                "backspace_ratio": c["backspace_ratio"],
                "wpm": c["wpm"],
                "silence_ratio": c["silence_ratio"],
            })

            ar = models.AssessmentResult(
                application_id=app.id,
                overall_score=c["score"],
                score_problem_understanding=c["score_problem"],
                score_solution_approach=c["score_solution"],
                score_logic_execution=c["score_logic"],
                score_communication=c["score_comm"],
                score_response_quality=c["score_quality"],
                tab_switches=c["tab_switches"],
                copy_paste_attempts=c["copy_paste"],
                ai_cheating_detected=c["ai_cheat"],
                time_taken_seconds=c["time_taken"],
                claim_vs_evidence_label=c["label"],
                executive_summary=c["summary"],
                candidate_answer=transcript,
                replay_history=replay,
                keystroke_metrics=km,
            )
            db.add(ar)
            db.commit()
            print(f"    [+] Assessment result seeded — Score: {c['score']} | Label: {c['label']}")
        else:
            print(f"    [OK] Assessment result exists for {c['name']}")

    db.close()
    print("\n✅ Seeding complete!")
    print(f"\nDemo Recruiter Login:")
    print(f"  Email : {RECRUITER_EMAIL}")
    print(f"  Pass  : {RECRUITER_PASS}")
    print(f"\nDemo URL: https://skillens-app.vercel.app/login")

if __name__ == "__main__":
    seed()
