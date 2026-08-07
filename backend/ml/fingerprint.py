"""
Cognitive Fingerprint prediction.

Loads the trained model (backend/ml/fingerprint_model.joblib) and predicts the
six cognitive dimensions from assessment telemetry. If the model file is
missing or fails to load, falls back to the deterministic expert heuristics so
the API never breaks.
"""

import json
import logging
import os
from typing import Any, Dict, List

from ml.features import extract_features

logger = logging.getLogger(__name__)

_MODEL_PATH = os.path.join(os.path.dirname(__file__), "fingerprint_model.joblib")

DIMENSIONS = [
    "analytical_depth",
    "communication_clarity",
    "execution_velocity",
    "integrity_index",
    "creative_synthesis",
    "pressure_resilience",
]

_model_cache = None


def _load_model():
    global _model_cache
    if _model_cache is None:
        try:
            import joblib
            artifact = joblib.load(_MODEL_PATH)
            _model_cache = artifact
        except Exception as e:
            logger.warning(f"Fingerprint model unavailable, using heuristics: {e}")
            _model_cache = False
    return _model_cache


def predict_fingerprint(result: Any) -> Dict[str, float]:
    """Return the 6 cognitive dimensions (0-100) + overall score."""
    artifact = _load_model()
    if artifact:
        try:
            features = extract_features(result)
            values = {}
            for dim in DIMENSIONS:
                pipe = artifact["models"][dim]
                pred = float(pipe.predict([features])[0])
                values[dim] = round(max(0.0, min(100.0, pred)), 1)
            values["overall"] = round(sum(values.values()) / 6, 1)
            return values
        except Exception as e:
            logger.error(f"Model prediction failed, using heuristics: {e}")

    # ── Fallback: deterministic expert heuristics ────────────────────────────
    km: Dict[str, Any] = {}
    if getattr(result, "keystroke_metrics", None):
        try:
            km = json.loads(result.keystroke_metrics)
        except Exception:
            km = {}

    s_prob = getattr(result, "score_problem_understanding", None) or 0
    s_sol = getattr(result, "score_solution_approach", None) or 0
    s_logic = getattr(result, "score_logic_execution", None) or 0
    s_comm = getattr(result, "score_communication", None) or 0
    s_qual = getattr(result, "score_response_quality", None) or 0

    tab_sw = getattr(result, "tab_switches", None) or 0
    copy_paste = getattr(result, "copy_paste_attempts", None) or 0
    time_taken = max(getattr(result, "time_taken_seconds", None) or 1, 1)
    cheat = bool(getattr(result, "ai_cheating_detected", False))

    backspace_ratio = km.get("backspace_ratio", 20.0)
    wpm = km.get("wpm", 30.0)
    silence_ratio = km.get("silence_ratio", 0.3)

    def _norm(v, lo, hi):
        if hi <= lo:
            return 50.0
        return max(0.0, min(100.0, (v - lo) / (hi - lo) * 100.0))

    analytical = s_prob * 0.45 + s_logic * 0.40 + s_sol * 0.15
    communication = s_comm * 0.55 + s_qual * 0.45
    wpm_score = _norm(wpm, 10, 80)
    time_score = 100 - abs(_norm(time_taken, 60, 1800) - 55)
    execution = max(0.0, min(100.0, wpm_score * 0.6 + time_score * 0.4))
    integrity = 100.0
    if cheat:
        integrity -= 40
    integrity -= min(tab_sw * 8, 30)
    integrity -= min(copy_paste * 12, 25)
    if backspace_ratio > 10:
        integrity = min(100.0, integrity + 3)
    integrity = max(0.0, integrity)
    creative = s_sol * 0.60 + s_qual * 0.40
    pressure = _norm(silence_ratio, 0.05, 0.60) * 0.5 + _norm(100 - backspace_ratio, 50, 100) * 0.5

    values = {
        "analytical_depth": round(analytical, 1),
        "communication_clarity": round(communication, 1),
        "execution_velocity": round(execution, 1),
        "integrity_index": round(integrity, 1),
        "creative_synthesis": round(creative, 1),
        "pressure_resilience": round(max(0.0, min(100.0, pressure)), 1),
    }
    values["overall"] = round(sum(values.values()) / 6, 1)
    return values
