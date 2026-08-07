"""
Skillens Biosphere — Cognitive Fingerprint Extraction, Simulation & CV Intelligence
====================================================================================
The Biosphere treats every candidate as a digital twin and simulates how they would
behave inside the client's organization before a hiring decision is made.

Endpoints:
  GET  /biosphere/fingerprint/{app_id}   → 6-dimension cognitive fingerprint (no LLM)
  POST /biosphere/simulate/{app_id}      → fingerprint + predictive simulation report (LLM)
  POST /biosphere/analyze-cv/{app_id}    → LLM extraction of CV skills/insights (LLM)
"""
import os
import json
import math
import logging
import re
from typing import Dict, Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from openai import AsyncOpenAI
from dotenv import load_dotenv

from database import get_db
import models
from utils import auth

load_dotenv()
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/biosphere", tags=["Biosphere"])

DIMENSIONS = [
    "analytical_depth",
    "communication_clarity",
    "execution_velocity",
    "integrity_index",
    "creative_synthesis",
    "pressure_resilience",
]

MAX_PROMPT_CHARS = 4000


# ── LLM Client ───────────────────────────────────────────────────────────────

def _client() -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=os.getenv("OPENAI_API_KEY"),
        base_url=os.getenv("OPENAI_API_BASE"),
        default_headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Skillens-Biosphere"},
        timeout=60.0,
    )


def _model() -> str:
    return os.getenv("LLM_MODEL_NAME", "llama-3.3-70b-versatile")


async def _llm_complete(system: str, user: str) -> str:
    """Call the configured LLM, falling back to Groq on any error."""
    last_error: Exception | None = None
    try:
        response = await _client().chat.completions.create(
            model=_model(),
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            max_tokens=1400,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:  # noqa: BLE001
        last_error = e
        logger.warning(f"Primary LLM call failed for Biosphere: {e}. Trying Groq fallback.")

    try:
        groq = AsyncOpenAI(
            api_key=os.getenv("GROQ_API_KEY"),
            base_url="https://api.groq.com/openai/v1",
            timeout=60.0,
        )
        response = await groq.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            response_format={"type": "json_object"},
            max_tokens=1400,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:  # noqa: BLE001
        logger.error(f"Groq fallback also failed: {e}")
        raise last_error or e


def _parse_json(raw: str) -> dict:
    """Robust JSON extraction that tolerates markdown fences and stray text."""
    if not raw:
        raise ValueError("Empty LLM response")
    raw = raw.strip()
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    candidate = match.group(0) if match else raw
    try:
        return json.loads(candidate)
    except json.JSONDecodeError:
        # Try to salvage by removing trailing commas
        candidate = re.sub(r",\s*([}\]])", r"\1", candidate)
        return json.loads(candidate)


# ── Cognitive Fingerprint Algorithm ──────────────────────────────────────────

def _norm(value: float, min_v: float, max_v: float) -> float:
    """Normalize a value to 0–100 range."""
    if max_v == min_v:
        return 50.0
    return max(0.0, min(100.0, (value - min_v) / (max_v - min_v) * 100))


def extract_cognitive_fingerprint(result: models.AssessmentResult) -> dict:
    """
    Derive 6 cognitive dimensions from raw telemetry & AI evaluation scores.

    1. Analytical Depth        — How deeply the candidate dissects problems
    2. Communication Clarity   — Quality of language & structure
    3. Execution Velocity      — Efficiency working under time pressure
    4. Integrity Index         — Anti-cheating behaviour signals
    5. Creative Synthesis      — Novelty & originality of approach
    6. Pressure Resilience     — Composure signals from keystroke patterns
    """
    km: Dict[str, Any] = {}
    if result.keystroke_metrics:
        try:
            km = json.loads(result.keystroke_metrics)
        except Exception:
            km = {}

    # Raw scores are 0-100 (AI evaluator scale)
    s_prob = result.score_problem_understanding or 0
    s_sol = result.score_solution_approach or 0
    s_logic = result.score_logic_execution or 0
    s_comm = result.score_communication or 0
    s_qual = result.score_response_quality or 0

    tab_sw = result.tab_switches or 0
    copy_paste = result.copy_paste_attempts or 0
    time_taken = max(result.time_taken_seconds or 1, 1)
    cheat = bool(result.ai_cheating_detected)

    backspace_ratio = km.get("backspace_ratio", 20.0)
    wpm = km.get("wpm", 30.0)
    silence_ratio = km.get("silence_ratio", 0.3)

    # ── Dimension 1: Analytical Depth (0–100)
    analytical_depth = round(s_prob * 0.45 + s_logic * 0.40 + s_sol * 0.15, 1)

    # ── Dimension 2: Communication Clarity (0–100)
    communication_clarity = round(s_comm * 0.55 + s_qual * 0.45, 1)

    # ── Dimension 3: Execution Velocity (0–100)
    wpm_score = _norm(wpm, 10, 80)
    time_score = _norm(time_taken, 60, 1800)
    time_score = 100 - abs(time_score - 55)  # peak around 45% of range
    execution_velocity = round((wpm_score * 0.6 + time_score * 0.4), 1)
    execution_velocity = max(0.0, min(100.0, execution_velocity))

    # ── Dimension 4: Integrity Index (0–100)
    integrity = 100.0
    if cheat:
        integrity -= 40
    integrity -= min(tab_sw * 8, 30)
    integrity -= min(copy_paste * 12, 25)
    if backspace_ratio > 10:
        integrity = min(100.0, integrity + 3)
    integrity_index = round(max(0.0, integrity), 1)

    # ── Dimension 5: Creative Synthesis (0–100)
    creative_synthesis = round(s_sol * 0.60 + s_qual * 0.40, 1)

    # ── Dimension 6: Pressure Resilience (0–100)
    silence_score = _norm(silence_ratio, 0.05, 0.60) * 0.5
    backspace_score = _norm(100 - backspace_ratio, 50, 100) * 0.5
    pressure_resilience = round(max(0.0, min(100.0, silence_score + backspace_score)), 1)

    values = {
        "analytical_depth": analytical_depth,
        "communication_clarity": communication_clarity,
        "execution_velocity": execution_velocity,
        "integrity_index": integrity_index,
        "creative_synthesis": creative_synthesis,
        "pressure_resilience": pressure_resilience,
    }
    values["overall"] = round(sum(values.values()) / 6, 1)
    return values


# ── Access Control ───────────────────────────────────────────────────────────

def _can_access_app(db: Session, app: models.Application, current_user: models.User) -> bool:
    """True if current_user is the candidate, the job owner, a same-company recruiter, or admin."""
    if current_user.role == "admin":
        return True
    if app.user_id == current_user.id:
        return True
    if current_user.role in ("recruiter", "admin"):
        job = app.job
        if not job:
            return False
        return _can_access_job(db, job, current_user)
    return False


def _can_access_job(db: Session, job: models.Job, current_user: models.User) -> bool:
    """True if current_user may access the given job (same company or admin)."""
    if current_user.role == "admin":
        return True
    if current_user.role not in ("recruiter", "admin"):
        return False
    if current_user.company_id:
        company_users = [
            u[0] for u in db.query(models.User.id)
            .filter(models.User.company_id == current_user.company_id).all()
        ]
        return job.owner_id in company_users
    return job.owner_id == current_user.id


def _get_latest_result(app: models.Application) -> models.AssessmentResult:
    if not app.assessment_results:
        raise HTTPException(status_code=404, detail="No assessment results yet")
    return app.assessment_results[-1]


def _truncate(text: str, limit: int = MAX_PROMPT_CHARS) -> str:
    if not text:
        return ""
    return text[:limit]


# ── Routes ───────────────────────────────────────────────────────────────────

@router.get("/fingerprint/{app_id}")
async def get_cognitive_fingerprint(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Return the 6-dimension cognitive fingerprint for an application (no LLM call)."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app or not _can_access_app(db, app, current_user):
        raise HTTPException(status_code=404, detail="Application not found")

    result = _get_latest_result(app)
    fingerprint = extract_cognitive_fingerprint(result)

    return {
        "application_id": app_id,
        "candidate_name": app.user.full_name or "Kandidat Anonim",
        "job_title": app.job.title if app.job else None,
        "fingerprint": fingerprint,
    }


@router.post("/simulate/{app_id}")
async def run_biosphere_simulation(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    Full Biosphere simulation: extract the cognitive fingerprint, then ask the LLM
    to run a 10.000-hour digital-twin simulation and produce an Oracle Report.
    """
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app or not _can_access_app(db, app, current_user):
        raise HTTPException(status_code=404, detail="Application not found")

    result = _get_latest_result(app)
    fingerprint = extract_cognitive_fingerprint(result)

    candidate_name = app.user.full_name or "Kandidat Anonim"
    job = app.job
    job_title = job.title if job else "Posisi Tidak Diketahui"
    job_description = job.description if job else ""
    overall_score = result.overall_score or 0
    claim_vs_ev = result.claim_vs_evidence_label or "Unknown"
    resume_text = _truncate(app.resume_text or "")

    system_prompt = (
        "Anda adalah Skillens Biosphere Intelligence Engine - sistem AI yang "
        "mensimulasikan masa depan organisasi sebelum keputusan rekrutmen dibuat. "
        "Anda memproyeksikan bagaimana digital twin kandidat berperilaku selama "
        "10.000 jam (kira-kira 6 tahun) di dalam ekosistem perusahaan. "
        "Selalu balas HANYA dengan JSON valid, tanpa markdown code block."
    )

    user_prompt = f"""Buat laporan simulasi prediktif (dalam Bahasa Indonesia) untuk rekruter.

## Data Kandidat
- Nama: {candidate_name}
- Posisi Dilamar: {job_title}
- Skor Keseluruhan: {overall_score:.1f}/100
- Label Evaluasi: {claim_vs_ev}

## Cognitive Fingerprint (Skala 0-100)
- Analytical Depth (Kedalaman Analitik): {fingerprint['analytical_depth']}
- Communication Clarity (Kejelasan Komunikasi): {fingerprint['communication_clarity']}
- Execution Velocity (Kecepatan Eksekusi): {fingerprint['execution_velocity']}
- Integrity Index (Indeks Integritas): {fingerprint['integrity_index']}
- Creative Synthesis (Sintesis Kreatif): {fingerprint['creative_synthesis']}
- Pressure Resilience (Ketahanan Tekanan): {fingerprint['pressure_resilience']}

## Deskripsi Pekerjaan
{_truncate(job_description, 800)}

## Ringkasan CV Kandidat
{resume_text[:1200] if resume_text else "(Tidak ada CV yang diunggah)"}

Hasilkan JSON dengan format TEPAT berikut:
{{
  "prediction_30_days": "Narasi singkat prediksi performa bulan pertama (2-3 kalimat)",
  "prediction_90_days": "Narasi prediksi bulan ketiga termasuk potensi friction atau sinergi (2-3 kalimat)",
  "prediction_180_days": "Proyeksi jangka menengah: berkembang, stagnan, atau berisiko keluar? (2-3 kalimat)",
  "team_compatibility_score": <angka 0-100>,
  "success_probability": <angka 0-100>,
  "cognitive_archetype": "<nama arketipe unik, contoh: 'Systematic Innovator', 'Pressure-Forged Executor'>",
  "archetype_description": "Deskripsi 1 kalimat tentang arketipe kognitif ini",
  "risk_factors": ["risiko 1 (spesifik)", "risiko 2", "risiko 3"],
  "strength_signals": ["kekuatan 1 (spesifik)", "kekuatan 2", "kekuatan 3"],
  "recruiter_recommendation": "Satu paragraf rekomendasi konkret untuk rekruter: direkrut, dicoba probation, atau ditolak - dengan alasan spesifik berdasarkan fingerprint",
  "counter_measure": "Jika ada risiko utama, strategi mitigasi konkret (mentor pairing, role adjustment, dll)"
}}"""

    try:
        raw = await _llm_complete(system_prompt, user_prompt)
        simulation = _parse_json(raw)
        simulation["team_compatibility_score"] = _coerce_int(simulation.get("team_compatibility_score"))
        simulation["success_probability"] = _coerce_int(simulation.get("success_probability"))
    except Exception as e:
        logger.error(f"Biosphere simulation failed for app {app_id}: {e}")
        simulation = _fallback_simulation(fingerprint, str(e))

    return {
        "application_id": app_id,
        "candidate_name": candidate_name,
        "job_title": job_title,
        "fingerprint": fingerprint,
        "simulation": simulation,
    }


@router.post("/analyze-cv/{app_id}")
async def analyze_cv(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    LLM extraction of the candidate's CV into structured recruiter intelligence:
    verified skills, tenure claims, red flags, and recommended interview focus.
    """
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app or not _can_access_app(db, app, current_user):
        raise HTTPException(status_code=404, detail="Application not found")

    resume_text = _truncate(app.resume_text or "", 5000)
    if not resume_text:
        raise HTTPException(status_code=404, detail="No resume text available for this application")

    job_title = app.job.title if app.job else "Posisi Tidak Diketahui"

    system_prompt = (
        "Anda adalah analis CV senior berbasis AI untuk Skillens. Anda membaca teks mentah CV "
        "dan menghasilkan insight struktural untuk rekruter. Balas HANYA dengan JSON valid, "
        "tanpa markdown code block."
    )
    user_prompt = f"""Analisis CV kandidat untuk posisi "{job_title}".

Teks CV (mentah hasil ekstraksi PDF):
{resume_text}

Hasilkan JSON dengan format TEPAT berikut:
{{
  "extracted_skills": ["skill yang bisa diverifikasi dari CV"],
  "years_experience_estimate": <angka tahun pengalaman perkiraan>,
  "notable_strengths": ["kekuatan menonjol 2-3 item"],
  "red_flags": ["kejanggalan atau risiko 2-3 item, kosongkan array jika tidak ada"],
  "missing_evidence": ["klaim pengalaman/skill yang TIDAK didukung bukti dalam CV"],
  "interview_focus_areas": ["area yang harus digali saat wawancara"],
  "cv_quality_score": <angka 0-100>,
  "summary": "Ringkasan 2-3 kalimat tentang profil kandidat"
}}"""

    try:
        raw = await _llm_complete(system_prompt, user_prompt)
        analysis = _parse_json(raw)
        analysis["cv_quality_score"] = _coerce_int(analysis.get("cv_quality_score"))
    except Exception as e:
        logger.error(f"CV analysis failed for app {app_id}: {e}")
        analysis = {
            "extracted_skills": [],
            "years_experience_estimate": 0,
            "notable_strengths": [],
            "red_flags": [],
            "missing_evidence": [],
            "interview_focus_areas": [],
            "cv_quality_score": 0,
            "summary": "Analisis CV tidak dapat dihasilkan saat ini.",
        }

    return {
        "application_id": app_id,
        "candidate_name": app.user.full_name or "Kandidat Anonim",
        "cv_analysis": analysis,
    }


@router.get("/team/{job_id}")
async def get_team_fingerprints(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Return cognitive fingerprints for every evaluated applicant of a job."""
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not _can_access_job(db, job, current_user):
        raise HTTPException(status_code=404, detail="Job not found")

    team: list[dict] = []
    for app in job.applications:
        if not app.assessment_results:
            continue
        result = app.assessment_results[-1]
        if result.claim_vs_evidence_label == "Pending AI Evaluation":
            continue
        fingerprint = extract_cognitive_fingerprint(result)
        team.append({
            "application_id": app.id,
            "candidate_name": app.user.full_name or "Kandidat Anonim",
            "role": job.title,
            "fingerprint": fingerprint,
        })

    return {"job_id": job_id, "job_title": job.title, "team": team}


# ── Helpers ──────────────────────────────────────────────────────────────────

def _coerce_int(value: Any, default: int = 0) -> int:
    try:
        return max(0, min(100, int(float(value))))
    except (TypeError, ValueError):
        return default


def _fallback_simulation(fingerprint: dict, error: str) -> dict:
    overall = fingerprint.get("overall", 0)
    return {
        "prediction_30_days": "Simulasi tidak dapat dihasilkan saat ini karena layanan AI sibuk.",
        "prediction_90_days": "Simulasi tidak dapat dihasilkan saat ini.",
        "prediction_180_days": "Silakan coba lagi beberapa saat.",
        "team_compatibility_score": round(overall),
        "success_probability": round(overall),
        "cognitive_archetype": "Data Insufficient",
        "archetype_description": str(error)[:120],
        "risk_factors": [],
        "strength_signals": [],
        "recruiter_recommendation": "Harap ulangi simulasi ketika layanan AI tersedia.",
        "counter_measure": "-",
    }
