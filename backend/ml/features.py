"""
Feature engineering for the Cognitive Fingerprint model.

Normalises raw assessment telemetry + AI evaluation scores into a consistent
numeric feature vector used both at training time and at prediction time.
"""

import json
from typing import Any, Dict, List


def extract_features(result: Any) -> List[float]:
    """Build the 13-dimension feature vector from an AssessmentResult row."""
    km: Dict[str, Any] = {}
    if getattr(result, "keystroke_metrics", None):
        try:
            km = json.loads(result.keystroke_metrics)
        except Exception:
            km = {}

    s_prob = _num(getattr(result, "score_problem_understanding", None))
    s_sol = _num(getattr(result, "score_solution_approach", None))
    s_logic = _num(getattr(result, "score_logic_execution", None))
    s_comm = _num(getattr(result, "score_communication", None))
    s_qual = _num(getattr(result, "score_response_quality", None))

    tab_sw = _num(getattr(result, "tab_switches", None))
    copy_paste = _num(getattr(result, "copy_paste_attempts", None))
    time_taken = max(_num(getattr(result, "time_taken_seconds", None)) or 1, 1)
    cheat = 1.0 if getattr(result, "ai_cheating_detected", False) else 0.0

    backspace_ratio = _num(km.get("backspace_ratio"), 20.0)
    wpm = _num(km.get("wpm"), 30.0)
    silence_ratio = _num(km.get("silence_ratio"), 0.3)

    return [
        s_prob,
        s_sol,
        s_logic,
        s_comm,
        s_qual,
        tab_sw,
        copy_paste,
        time_taken,
        cheat,
        backspace_ratio,
        wpm,
        silence_ratio,
        _num(km.get("total_chars"), 0),
    ]


def _num(value, default: float = 0.0) -> float:
    try:
        if value is None:
            return default
        return float(value)
    except (TypeError, ValueError):
        return default


FEATURE_NAMES = [
    "score_problem_understanding",
    "score_solution_approach",
    "score_logic_execution",
    "score_communication",
    "score_response_quality",
    "tab_switches",
    "copy_paste_attempts",
    "time_taken_seconds",
    "ai_cheating_detected",
    "backspace_ratio",
    "wpm",
    "silence_ratio",
    "total_chars",
]
