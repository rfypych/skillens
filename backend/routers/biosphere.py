"""
Skillens Biosphere — Cognitive Fingerprint Extraction & Simulation Engine
=========================================================================
Derives a 6-dimension cognitive fingerprint from assessment telemetry,
then uses an LLM to generate a predictive simulation report for the recruiter.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from utils import auth
from openai import AsyncOpenAI
import os, json, math
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/biosphere", tags=["Biosphere"])

client = AsyncOpenAI(
    api_key=os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY"),
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    if os.getenv("GEMINI_API_KEY")
    else None,
)
MODEL = "gemini-2.0-flash" if os.getenv("GEMINI_API_KEY") else "gpt-4o-mini"


# ── Cognitive Fingerprint Algorithm ─────────────────────────────────────────

def _norm(value: float, min_v: float, max_v: float) -> float:
    """Normalize a value to 0–100 range."""
    if max_v == min_v:
        return 50.0
    return max(0.0, min(100.0, (value - min_v) / (max_v - min_v) * 100))


def extract_cognitive_fingerprint(result: models.AssessmentResult) -> dict:
    """
    Derive 6 cognitive dimensions from raw telemetry & AI scores.

    Dimensions:
    1. Analytical Depth        — How deep the candidate dissects problems
    2. Communication Clarity   — Quality of language & structure
    3. Execution Velocity      — How efficiently they work under time pressure
    4. Integrity Index         — Anti-cheating behaviour signals
    5. Creative Synthesis      — Novelty & approach originality
    6. Pressure Resilience     — Composure signals from keystroke patterns
    """
    km = {}
    if result.keystroke_metrics:
        try:
            km = json.loads(result.keystroke_metrics)
        except Exception:
            km = {}

    # Raw scores (0–10 each, already from AI evaluator)
    s_prob  = result.score_problem_understanding or 0
    s_sol   = result.score_solution_approach or 0
    s_logic = result.score_logic_execution or 0
    s_comm  = result.score_communication or 0
    s_qual  = result.score_response_quality or 0

    # Telemetry signals
    tab_sw     = result.tab_switches or 0
    copy_paste = result.copy_paste_attempts or 0
    time_taken = max(result.time_taken_seconds or 1, 1)
    cheat      = result.ai_cheating_detected or False

    backspace_ratio = km.get("backspace_ratio", 20.0)  # lower = more deliberate
    wpm             = km.get("wpm", 30.0)
    silence_ratio   = km.get("silence_ratio", 0.3)     # ratio of long pauses = deep thinking

    total_chars = km.get("total_chars", len(result.candidate_answer or ""))

    # ── Dimension 1: Analytical Depth (0–100)
    analytical_depth = round(
        (s_prob * 0.45 + s_logic * 0.40 + s_sol * 0.15) / 10 * 100, 1
    )

    # ── Dimension 2: Communication Clarity (0–100)
    communication_clarity = round(
        (s_comm * 0.55 + s_qual * 0.45) / 10 * 100, 1
    )

    # ── Dimension 3: Execution Velocity (0–100)
    # High WPM and reasonable time → high velocity
    wpm_score   = _norm(wpm, 10, 80)
    # Reward completing quickly (but not TOO fast — that's suspicious)
    time_score  = _norm(time_taken, 60, 1800)  # 60s=too fast,1800s=too slow
    time_score  = 100 - abs(time_score - 55)   # peak around 45% of range
    execution_velocity = round((wpm_score * 0.6 + time_score * 0.4), 1)
    execution_velocity = max(0, min(100, execution_velocity))

    # ── Dimension 4: Integrity Index (0–100)
    # Starts at 100 and decays with suspicious signals
    integrity = 100.0
    if cheat:
        integrity -= 40
    integrity -= min(tab_sw * 8, 30)
    integrity -= min(copy_paste * 12, 25)
    # High backspace ratio can indicate genuine thinking — slight bonus
    if backspace_ratio > 10:
        integrity = min(100, integrity + 3)
    integrity_index = round(max(0, integrity), 1)

    # ── Dimension 5: Creative Synthesis (0–100)
    # Based on solution approach + response quality (these correlate with originality)
    creative_synthesis = round(
        (s_sol * 0.60 + s_qual * 0.40) / 10 * 100, 1
    )

    # ── Dimension 6: Pressure Resilience (0–100)
    # High silence ratio (deep thinking pauses) + low backspace = composed under pressure
    silence_score    = _norm(silence_ratio, 0.05, 0.60) * 0.5  # 0–50
    backspace_score  = _norm(100 - backspace_ratio, 50, 100) * 0.5  # 0–50
    pressure_resilience = round(
        silence_score + backspace_score, 1
    )
    pressure_resilience = max(0, min(100, pressure_resilience))

    return {
        "analytical_depth": analytical_depth,
        "communication_clarity": communication_clarity,
        "execution_velocity": execution_velocity,
        "integrity_index": integrity_index,
        "creative_synthesis": creative_synthesis,
        "pressure_resilience": pressure_resilience,
        "overall": round(
            (analytical_depth + communication_clarity + execution_velocity +
             integrity_index + creative_synthesis + pressure_resilience) / 6, 1
        )
    }


# ── LLM Simulation Prompt ────────────────────────────────────────────────────

async def generate_simulation_report(
    fingerprint: dict,
    job_title: str,
    candidate_name: str,
    job_description: str,
    overall_score: float,
    claim_vs_evidence: str,
) -> str:
    """Call Gemini/GPT to generate a structured simulation report in Bahasa Indonesia."""

    prompt = f"""Anda adalah **Skillens Biosphere Intelligence Engine** — sistem AI yang mensimulasikan masa depan organisasi sebelum keputusan rekrutmen dibuat.

Berdasarkan data berikut, buat laporan simulasi prediktif (dalam **Bahasa Indonesia**) untuk rekruter:

## Data Kandidat
- **Nama:** {candidate_name}
- **Posisi Dilamar:** {job_title}
- **Skor Keseluruhan:** {overall_score:.1f}/100
- **Label Evaluasi:** {claim_vs_evidence}

## Cognitive Fingerprint (Skala 0-100)
- Analytical Depth (Kedalaman Analitik): {fingerprint['analytical_depth']}
- Communication Clarity (Kejelasan Komunikasi): {fingerprint['communication_clarity']}
- Execution Velocity (Kecepatan Eksekusi): {fingerprint['execution_velocity']}
- Integrity Index (Indeks Integritas): {fingerprint['integrity_index']}
- Creative Synthesis (Sintesis Kreatif): {fingerprint['creative_synthesis']}
- Pressure Resilience (Ketahanan Tekanan): {fingerprint['pressure_resilience']}

## Deskripsi Pekerjaan (Ringkasan)
{job_description[:500]}

---
Hasilkan laporan JSON dengan format TEPAT berikut (tanpa markdown code block, langsung JSON):

{{
  "prediction_30_days": "Narasi singkat prediksi performa bulan pertama (2-3 kalimat)",
  "prediction_90_days": "Narasi prediksi bulan ketiga termasuk potensi friction atau sinergi (2-3 kalimat)",
  "prediction_180_days": "Proyeksi jangka menengah: apakah kandidat berkembang, stagnan, atau berisiko keluar? (2-3 kalimat)",
  "team_compatibility_score": <angka 0-100>,
  "success_probability": <angka 0-100>,
  "cognitive_archetype": "<nama arketipe unik, contoh: 'Systematic Innovator', 'Pressure-Forged Executor', 'Visionary Analyst'>",
  "archetype_description": "Deskripsi 1 kalimat tentang arketipe kognitif ini",
  "risk_factors": ["risiko 1 (spesifik)", "risiko 2", "risiko 3"],
  "strength_signals": ["kekuatan 1 (spesifik)", "kekuatan 2", "kekuatan 3"],
  "recruiter_recommendation": "Satu paragraf rekomendasi konkret untuk rekruter: apakah direkrut, dicoba probation, atau ditolak — dengan alasan spesifik berdasarkan fingerprint",
  "counter_measure": "Jika ada risiko utama, strategi mitigasi konkret apa yang bisa dilakukan perusahaan (mentor pairing, role adjustment, dll)"
}}"""

    response = await client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=1200,
    )

    raw = response.choices[0].message.content.strip()

    # Robustly extract JSON: strip all markdown fences then find first { ... }
    import re
    # Remove ```json ... ``` or ``` ... ``` fences
    raw = re.sub(r"^```[a-z]*\n?", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\n?```$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    # If there's still non-JSON prefix text, extract the JSON object
    match = re.search(r"\{[\s\S]*\}", raw)
    if match:
        raw = match.group(0)

    return raw.strip()


# ── Route ────────────────────────────────────────────────────────────────────

@router.get("/fingerprint/{app_id}")
async def get_cognitive_fingerprint(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """Return the cognitive fingerprint for a given application (no LLM call)."""
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Recruiter access required")

    if not app.assessment_results:
        raise HTTPException(status_code=404, detail="No assessment results yet")

    # Use the latest completed result
    result = app.assessment_results[-1]
    fingerprint = extract_cognitive_fingerprint(result)
    return {"fingerprint": fingerprint, "application_id": app_id}


@router.post("/simulate/{app_id}")
async def run_biosphere_simulation(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    Full Biosphere simulation: extract fingerprint + generate AI prediction report.
    Returns fingerprint + structured simulation JSON.
    """
    app = db.query(models.Application).filter(models.Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if current_user.role not in ["recruiter", "admin"]:
        raise HTTPException(status_code=403, detail="Recruiter access required")
    if not app.assessment_results:
        raise HTTPException(status_code=404, detail="No assessment results yet")

    result = app.assessment_results[-1]
    fingerprint = extract_cognitive_fingerprint(result)

    candidate_name = app.user.full_name or "Kandidat Anonim"
    job_title      = app.job.title if app.job else "Posisi Tidak Diketahui"
    job_description = app.job.description if app.job else ""
    overall_score  = result.overall_score or 0
    claim_vs_ev    = result.claim_vs_evidence_label or "Unknown"

    try:
        simulation_raw = await generate_simulation_report(
            fingerprint=fingerprint,
            job_title=job_title,
            candidate_name=candidate_name,
            job_description=job_description,
            overall_score=overall_score,
            claim_vs_evidence=claim_vs_ev,
        )
        simulation = json.loads(simulation_raw)
    except Exception as e:
        simulation = {
            "prediction_30_days": "Simulasi tidak dapat dihasilkan saat ini.",
            "prediction_90_days": "Simulasi tidak dapat dihasilkan saat ini.",
            "prediction_180_days": "Simulasi tidak dapat dihasilkan saat ini.",
            "team_compatibility_score": round(fingerprint["overall"]),
            "success_probability": round(fingerprint["overall"]),
            "cognitive_archetype": "Data Insufficient",
            "archetype_description": str(e),
            "risk_factors": [],
            "strength_signals": [],
            "recruiter_recommendation": "Harap ulangi simulasi.",
            "counter_measure": "-",
        }

    return {
        "application_id": app_id,
        "candidate_name": candidate_name,
        "job_title": job_title,
        "fingerprint": fingerprint,
        "simulation": simulation,
    }
