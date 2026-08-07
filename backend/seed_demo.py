"""
Skillens Demo Seeding Script
=============================
Creates a realistic demo workspace for the JHIC 2.0 / LKS demo:
one recruiter with a company, one job with an assessment, and five
candidates with full assessment results, CV text and telemetry that
exercise the Biosphere (fingerprint, simulation, CV analysis).

Run: python seed_demo.py
Idempotent: re-running creates missing records only.
"""
import sys
import os
import json

sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal  # noqa: E402
import models  # noqa: E402
from utils.auth import get_password_hash  # noqa: E402

db = SessionLocal()

RECRUITER_EMAIL = "demo-recruiter@skillens.id"
RECRUITER_PASS = "SkillensDemo2024!"
COMPANY_NAME = "Skillens Tech"
JOB_TITLE = "Senior Product Engineer"
JOB_LANG = "Bahasa Indonesia"


def get_or_create_company():
    company = db.query(models.Company).filter(models.Company.name == COMPANY_NAME).first()
    if not company:
        company = models.Company(name=COMPANY_NAME, description="Perusahaan teknologi fiktif untuk demo.")
        db.add(company)
        db.commit()
        db.refresh(company)
        print(f"  [+] Company created: {COMPANY_NAME}")
    return company


def get_or_create_recruiter():
    company = get_or_create_company()
    rec = db.query(models.User).filter(models.User.email == RECRUITER_EMAIL).first()
    if rec:
        print(f"  [OK] Recruiter exists: {RECRUITER_EMAIL}")
        return rec
    rec = models.User(
        email=RECRUITER_EMAIL,
        hashed_password=get_password_hash(RECRUITER_PASS),
        full_name="Demo Recruiter",
        role="recruiter",
        company_id=company.id,
    )
    db.add(rec)
    db.commit()
    db.refresh(rec)
    print(f"  [+] Recruiter created: {RECRUITER_EMAIL} / {RECRUITER_PASS}")
    return rec


def get_or_create_job(recruiter):
    job = db.query(models.Job).filter(models.Job.title == JOB_TITLE).first()
    if job:
        print(f"  [OK] Job exists: {JOB_TITLE}")
        return job
    job = models.Job(
        title=JOB_TITLE,
        description=(
            "Kami mencari seorang Senior Product Engineer dengan kemampuan teknis yang kuat "
            "sekaligus pemahaman mendalam tentang kebutuhan pengguna. Kandidat ideal mampu "
            "memimpin desain solusi teknis dari konsep hingga produksi, berkolaborasi lintas "
            "tim, dan mengambil keputusan berbasis data. Pengalaman minimum 3 tahun di software "
            "engineering; pengalaman di startup tahap pertumbuhan lebih diutamakan."
        ),
        expected_outcomes=(
            "Menghasilkan arsitektur solusi yang scalable dan maintainable; memimpin code review "
            "dan mentoring; mendorong budaya pengukuran dan eksperimen."
        ),
        specific_skills="System Design, Python, React, Distributed Systems, Product Thinking",
        compliance_criteria="",
        language=JOB_LANG,
        location="Remote / Jakarta",
        salary_range="Rp 18–30 juta",
        job_type="Full-time",
        kkm_score=70.0,
        status="open",
        owner_id=recruiter.id,
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    assessment = models.Assessment(
        job_id=job.id,
        scenario_prompt=(
            "Perusahaan e-commerce Anda mengalami downtime 45 menit setiap kali ada flash sale "
            "dengan lonjakan trafik 10x. Anda diminta merancang strategi penanganannya. Jelaskan "
            "langkah-langkah Anda dari identifikasi akar masalah hingga solusi yang Anda terapkan, "
            "termasuk trade-off yang Anda pertimbangkan."
        ),
        hidden_prompt="mentimun",
    )
    db.add(assessment)
    db.commit()
    print(f"  [+] Job created with assessment: {JOB_TITLE}")
    return job


# ── Demo candidates ────────────────────────────────────────────────────────────

CANDIDATES = [
    {
        "name": "Arka Pratama",
        "email": "arka@demo.skillens.id",
        "label": "Highly Validated",
        "overall": 87.5,
        "score_problem_understanding": 9.0,
        "score_solution_approach": 8.5,
        "score_logic_execution": 8.8,
        "score_communication": 8.2,
        "score_response_quality": 8.9,
        "tab_switches": 1,
        "copy_paste_attempts": 0,
        "ai_cheating_detected": False,
        "time_taken_seconds": 1250,
        "wpm": 68,
        "backspace_ratio": 14.5,
        "silence_ratio": 0.38,
        "feedback": (
            "Kandidat menunjukkan kemampuan analitik yang sangat kuat dengan pendekatan sistematis. "
            "Solusi membuktikan pemahaman mendalam terhadap arsitektur sistem dan trade-off teknis. "
            "Tidak ada indikasi kecurangan — pengetikan organik dengan pola refleksi alami."
        ),
        "resume_text": (
            "ARKA PRATAMA\nSenior Software Engineer\n\nPENGALAMAN\n2021–sekarang — Senior Backend Engineer, PT Nusantara Digital\n"
            "Merancang sistem distribusi pesan berbasis Kafka untuk 5 juta pengguna; memotong waktu "
            "respons p95 dari 1.2s ke 350ms.\n2018–2021 — Backend Engineer, Tokopedia\nMembangun layanan "
            "rekomendasi dan antrean flash sale.\n\nKETERAMPILAN\nPython, Go, PostgreSQL, Redis, Kafka, "
            "Docker, Kubernetes\nPendidikan: S.T. Informatika, ITB\n\nBahasa: Indonesia (native), English (profesional)"
        ),
        "interview_questions": (
            "Jelaskan bagaimana Anda memverifikasi trade-off saat memilih Kafka dibandingkan SQS.\n"
            "Bagaimana Anda mengukur dampak dari pengurangan p95 latency terhadap revenue?\n"
            "Ceritakan saat Anda harus mengubah keputusan arsitektur karena data."
        ),
    },
    {
        "name": "Sinta Maharani",
        "email": "sinta@demo.skillens.id",
        "label": "Hidden Gem",
        "overall": 79.2,
        "score_problem_understanding": 7.5,
        "score_solution_approach": 8.8,
        "score_logic_execution": 7.2,
        "score_communication": 9.0,
        "score_response_quality": 8.5,
        "tab_switches": 2,
        "copy_paste_attempts": 0,
        "ai_cheating_detected": False,
        "time_taken_seconds": 1800,
        "wpm": 42,
        "backspace_ratio": 22.0,
        "silence_ratio": 0.55,
        "feedback": (
            "Kejelasan komunikasi luar biasa — jawaban terstruktur meski waktu pengerjaan lebih lama. "
            "Pola berpikir mendalam terlihat dari rasio silence yang tinggi. Hidden Gem: latar belakang "
            "non-tradisional dengan potensi besar."
        ),
        "resume_text": (
            "SINTA MAHARANI\nProduct Engineer\n\nPENGALAMAN\n2019–sekarang — Fullstack Engineer, PT Solusi Digital\n"
            "Membangun platform CRM untuk 200+ klien UMKM; memimpin migrasi monolith ke modular services.\n"
            "2017–2019 — Junior Developer, Freelance\nBerbagai proyek web untuk bisnis lokal.\n\n"
            "KETERAMPILAN\nJavaScript, TypeScript, React, Node.js, PostgreSQL\nPendidikan: D3 Teknik Komputer, UGM\n\n"
            "Catatan: berpindah dari bidang non-teknis (fotografi) ke engineering, autodidak."
        ),
        "interview_questions": (
            "Bagaimana Anda memutuskan modularisasi layanan tanpa over-engineering?\n"
            "Apa metrik keberhasilan migrasi dari monolith?\n"
            "Ceritakan bagaimana latar belakang non-teknis membantu Anda memahami kebutuhan pengguna."
        ),
    },
    {
        "name": "Rafi Zaidan",
        "email": "rafi@demo.skillens.id",
        "label": "Likely Fabricated",
        "overall": 45.0,
        "score_problem_understanding": 4.0,
        "score_solution_approach": 5.5,
        "score_logic_execution": 4.2,
        "score_communication": 5.0,
        "score_response_quality": 4.8,
        "tab_switches": 9,
        "copy_paste_attempts": 4,
        "ai_cheating_detected": True,
        "time_taken_seconds": 320,
        "wpm": 320,
        "backspace_ratio": 0.4,
        "silence_ratio": 0.05,
        "feedback": (
            "Telemetry override: Superhuman typing speed terdeteksi (320 char/sec). Kandidat "
            "menginjeksi teks pra-tulis dengan tool yang mem-bypass event listener paste browser."
        ),
        "resume_text": (
            "RAFI ZAIDAN\nLead Engineer\n\nPENGALAMAN\n2020–sekarang — Lead Engineer, PT Maju Bersama\n"
            "Memimpin tim 20 engineer; membangun platform fintech nasional.\n2016–2020 — Senior Engineer, "
            "PT Finansial Nusantara\n\nKETERAMPILAN\nEverything: Microservices, Blockchain, AI/ML, Cloud, "
            "Big Data, DevOps\nPendidikan: S2 Computer Science, MIT (online certificate)"
        ),
        "interview_questions": (
            "Jelaskan secara konkret arsitektur platform fintech yang Anda klaim.\n"
            "Apa metrik yang Anda gunakan untuk menilai performa tim?\n"
            "Ceritakan satu kegagalan teknis dan pelajaran yang diambil."
        ),
    },
    {
        "name": "Dimas Pradana",
        "email": "dimas@demo.skillens.id",
        "label": "Mismatch",
        "overall": 58.0,
        "score_problem_understanding": 6.0,
        "score_solution_approach": 6.5,
        "score_logic_execution": 5.8,
        "score_communication": 5.2,
        "score_response_quality": 5.5,
        "tab_switches": 2,
        "copy_paste_attempts": 0,
        "ai_cheating_detected": False,
        "time_taken_seconds": 1600,
        "wpm": 38,
        "backspace_ratio": 18.0,
        "silence_ratio": 0.45,
        "feedback": (
            "CV mengklaim pengalaman 8 tahun sebagai arsitek sistem, namun kedalaman jawaban tidak "
            "mencerminkan klaim tersebut — pemahaman konsep dasar masih dangkal. Label: Mismatch antara "
            "klaim CV dan performa aktual."
        ),
        "resume_text": (
            "DIMAS PRADANA\nSolutions Architect\n\nPENGALAMAN\n2015–sekarang — Solutions Architect, PT Arsitek Data\n"
            "Merancang arsitektur data lake untuk institusi keuangan; lead solution design.\n"
            "2012–2015 — System Analyst\n\nKETERAMPILAN\nAWS, Big Data, Hadoop, Spark, System Design\n"
            "Pendidikan: S1 Sistem Informasi, Binus"
        ),
        "interview_questions": (
            "Jelaskan perbedaan arsitektur batch dan streaming beserta kasus penggunaannya.\n"
            "Bagaimana Anda menangani skew pada join data besar?\n"
            "Apa trade-off antara data lake dan warehouse modern?"
        ),
    },
    {
        "name": "Rania Kusuma",
        "email": "rania@demo.skillens.id",
        "label": "Highly Validated",
        "overall": 83.0,
        "score_problem_understanding": 8.5,
        "score_solution_approach": 8.0,
        "score_logic_execution": 8.6,
        "score_communication": 8.0,
        "score_response_quality": 8.2,
        "tab_switches": 0,
        "copy_paste_attempts": 0,
        "ai_cheating_detected": False,
        "time_taken_seconds": 1450,
        "wpm": 58,
        "backspace_ratio": 16.0,
        "silence_ratio": 0.4,
        "feedback": (
            "Pendekatan solusi yang pragmatis dan terukur. Kandidat menyeimbangkan kedalaman teknis "
            "dengan pertimbangan bisnis. Pengetikan organik dengan fokus tinggi (tanpa perpindahan tab)."
        ),
        "resume_text": (
            "RANIA KUSUMA\nSenior Product Engineer\n\nPENGALAMAN\n2020–sekarang — Product Engineer, PT Karya Kreatif\n"
            "Memimpin pengembangan fitur pembayaran yang menaikkan konversi 12%.\n2017–2020 — Software Engineer, "
            "PT Eksplorasi Digital\n\nKETERAMPILAN\nTypeScript, Node.js, React, PostgreSQL, Product Analytics\n"
            "Pendidikan: S.T. Informatika, UI"
        ),
        "interview_questions": (
            "Bagaimana Anda mengukur dampak fitur pembayaran terhadap konversi?\n"
            "Apa saja trade-off ketika memilih arsitektur microservice?\n"
            "Ceritakan konflik tim yang pernah Anda selesaikan."
        ),
    },
]


def build_chat(label: str) -> list:
    """Build a plausible chat transcript for the demo candidate."""
    opening = (
        "Untuk menangani downtime saat flash sale, saya mulai dengan memetakan titik bottleneck. "
        "Pertama, saya akan menganalisis log dan tracing untuk menemukan komponen yang pertama kali "
        "saturasi — biasanya database atau koneksi external."
    )
    body = (
        "Setelah menemukan bottleneck, saya menerapkan cache untuk payload yang read-heavy, "
        "memindahkan workload berat ke antrean asinkron, dan menambahkan auto-scaling berbasis "
        "metrik kustom (bukan CPU saja). Saya juga memasukkan circuit breaker agar satu kegagalan "
        "tidak menjatuhkan seluruh sistem."
    )
    closing = (
        "Yang paling penting adalah memvalidasi asumsi dengan load test yang mereplikasi pola trafik "
        "flash sale, lalu menetapkan SLO dan on-call runbook sebelum deployment besar. Trade-off utama: "
        "kompleksitas tambahan versus keandalan yang didapat."
    )
    chat = [
        {"role": "assistant", "content": "Selamat datang di Micro-Interview. Silakan baca skenario dan berikan jawaban awal Anda."},
        {"role": "user", "content": opening},
        {"role": "assistant", "content": "Bagus. Bagaimana Anda menentukan bahwa database adalah bottleneck, bukan jaringan atau DNS?"},
        {"role": "user", "content": body},
        {"role": "assistant", "content": "Dengan tambahan kompleksitas tersebut, bagaimana Anda menjaga sistem tetap maintainable oleh tim kecil?"},
        {"role": "user", "content": closing},
        {"role": "assistant", "content": "Terima kasih atas wawancara Anda. Silakan klik tombol Kirim Jawaban untuk menyelesaikan evaluasi."},
    ]
    return chat


def create_candidate(candidate, job):
    user = db.query(models.User).filter(models.User.email == candidate["email"]).first()
    if not user:
        user = models.User(
            email=candidate["email"],
            hashed_password=get_password_hash("password123"),
            full_name=candidate["name"],
            role="candidate",
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    profile = db.query(models.CandidateProfile).filter(models.CandidateProfile.user_id == user.id).first()
    if not profile:
        profile = models.CandidateProfile(user_id=user.id, resume_url=None)
        db.add(profile)
        db.commit()

    app = db.query(models.Application).filter(
        models.Application.user_id == user.id,
        models.Application.job_id == job.id,
    ).first()
    if not app:
        app = models.Application(
            user_id=user.id,
            job_id=job.id,
            status="evaluated",
            hidden_prompt="mentimun",
            resume_text=candidate["resume_text"],
        )
        db.add(app)
        db.commit()
        db.refresh(app)

    existing = db.query(models.AssessmentResult).filter(
        models.AssessmentResult.application_id == app.id
    ).first()
    if existing:
        print(f"  [OK] {candidate['name']} already has assessment result")
        return

    keystroke = json.dumps({
        "wpm": candidate["wpm"],
        "backspace_ratio": candidate["backspace_ratio"],
        "silence_ratio": candidate["silence_ratio"],
        "total_chars": int(candidate["overall"] * 11),
        "backspace_count": 40,
    })
    replay = json.dumps([
        {"time": 0, "chat": [], "input": ""},
        {"time": 250, "chat": build_chat(candidate["label"]), "input": candidate["name"]},
    ])
    chat = json.dumps(build_chat(candidate["label"]), ensure_ascii=False)

    result = models.AssessmentResult(
        application_id=app.id,
        candidate_answer=chat,
        score_problem_understanding=candidate["score_problem_understanding"] * 10,
        score_solution_approach=candidate["score_solution_approach"] * 10,
        score_logic_execution=candidate["score_logic_execution"] * 10,
        score_communication=candidate["score_communication"] * 10,
        score_response_quality=candidate["score_response_quality"] * 10,
        overall_score=candidate["overall"],
        ai_cheating_detected=candidate["ai_cheating_detected"],
        tab_switches=candidate["tab_switches"],
        copy_paste_attempts=candidate["copy_paste_attempts"],
        time_taken_seconds=candidate["time_taken_seconds"],
        keystroke_metrics=keystroke,
        replay_history=replay,
        claim_vs_evidence_label=candidate["label"],
        evaluation_feedback=candidate["feedback"],
        interview_questions=candidate["interview_questions"],
    )
    db.add(result)
    db.commit()
    print(f"  [+] {candidate['name']} assessment created (label: {candidate['label']})")


def main():
    print("=== Skillens Demo Seeding ===")
    recruiter = get_or_create_recruiter()
    job = get_or_create_job(recruiter)
    print(f"  Creating {len(CANDIDATES)} demo candidates...")
    for candidate in CANDIDATES:
        create_candidate(candidate, job)
    print("=== Done. Login sebagai demo-recruiter@skillens.id / SkillensDemo2024! ===")
    db.close()


if __name__ == "__main__":
    main()
