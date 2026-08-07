"""
Cognitive Fingerprint model training pipeline.

The model learns the mapping from raw assessment telemetry + AI evaluation
scores to the six cognitive dimensions. Because we do not yet have a large
corpus of human-labelled fingerprints, the training data is *synthetic*: it is
generated from the same domain rules an expert would apply (encoded here as
`_heuristic_target`), with added realistic noise so the model generalises
instead of memorising.

As soon as real evaluation data accumulates (see `dump_labeled_dataset`), the
pipeline can be re-run with `--real` to train on actual outcomes.

Outputs (written to backend/ml/):
  - fingerprint_model.joblib   : fitted ensemble of regressors (one per dimension)
  - feature_columns.json       : feature names, used at inference to stay aligned

Usage:
  python ml/train_fingerprint.py [--n 12000] [--seed 42] [--out ml]
"""

import argparse
import json
import os
import random

import joblib
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

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

DIMENSIONS = [
    "analytical_depth",
    "communication_clarity",
    "execution_velocity",
    "integrity_index",
    "creative_synthesis",
    "pressure_resilience",
]


def _clamp(v, lo=0.0, hi=100.0):
    return max(lo, min(hi, v))


def _heuristic_target(f):
    """Expert-rule target used to synthesise labels (0-100 per dimension)."""
    s_prob, s_sol, s_logic, s_comm, s_qual, tab_sw, copy_paste, time_taken = f[:8]
    cheat, backspace_ratio, wpm, silence_ratio, total_chars = f[8:13]

    analytical = s_prob * 0.45 + s_logic * 0.40 + s_sol * 0.15
    communication = s_comm * 0.55 + s_qual * 0.45
    wpm_score = _clamp((wpm - 10.0) / (80.0 - 10.0) * 100.0)
    time_score = _clamp((time_taken - 60.0) / (1800.0 - 60.0) * 100.0)
    time_score = 100.0 - abs(time_score - 55.0)
    execution = wpm_score * 0.6 + time_score * 0.4
    integrity = 100.0
    if cheat:
        integrity -= 40
    integrity -= min(tab_sw * 8, 30)
    integrity -= min(copy_paste * 12, 25)
    if backspace_ratio > 10:
        integrity = min(100.0, integrity + 3)
    creative = s_sol * 0.60 + s_qual * 0.40
    silence_score = _clamp((silence_ratio - 0.05) / (0.60 - 0.05) * 100.0) * 0.5
    backspace_score = _clamp((100.0 - backspace_ratio - 50.0) / 50.0 * 100.0) * 0.5
    pressure = silence_score + backspace_score
    return [
        _clamp(analytical),
        _clamp(communication),
        _clamp(execution),
        _clamp(integrity),
        _clamp(creative),
        _clamp(pressure),
    ]


def _random_sample(rng: random.Random) -> list:
    """Sample a realistic assessment scenario."""
    profile = rng.choice(["strong", "mid", "weak", "cheat", "slow_typer"])

    if profile == "cheat":
        base = 60.0
        cheat = 1.0
        tab_sw = rng.randint(3, 12)
        copy_paste = rng.randint(1, 5)
        wpm = rng.uniform(15, 40)
    else:
        cheat = 0.0
        tab_sw = rng.randint(0, 4)
        copy_paste = rng.randint(0, 2)
        wpm = rng.uniform(20, 75)

    if profile == "strong":
        base = rng.uniform(72, 96)
    elif profile == "mid":
        base = rng.uniform(48, 74)
    elif profile == "weak":
        base = rng.uniform(8, 46)
    elif profile == "slow_typer":
        base = rng.uniform(55, 85)
        wpm = rng.uniform(10, 28)
    elif profile == "cheat":
        base = rng.uniform(50, 78)

    jitter = lambda spread: rng.uniform(-spread, spread)  # noqa: E731
    s_prob = _clamp(base + jitter(6))
    s_sol = _clamp(base + jitter(8))
    s_logic = _clamp(base + jitter(7))
    s_comm = _clamp(base + jitter(10))
    s_qual = _clamp(base + jitter(8))

    time_taken = rng.uniform(90, 1500)
    backspace_ratio = rng.uniform(3.0, 45.0)
    silence_ratio = rng.uniform(0.02, 0.75)
    total_chars = rng.uniform(300, 8000)

    return [
        s_prob, s_sol, s_logic, s_comm, s_qual,
        float(tab_sw), float(copy_paste), time_taken,
        cheat, backspace_ratio, wpm, silence_ratio, total_chars,
    ]


def generate_dataset(n: int, seed: int = 42):
    rng = random.Random(seed)
    X = []
    Y = []
    for _ in range(n):
        f = _random_sample(rng)
        targets = _heuristic_target(f)
        # Add realistic label noise so the model generalises.
        noisy = [_clamp(t + rng.uniform(-4.0, 4.0)) for t in targets]
        X.append(f)
        Y.append(noisy)
    return np.array(X, dtype=float), np.array(Y, dtype=float)


def dump_labeled_dataset(out_dir: str):
    """(Optional) Export any real AssessmentResults present for future retraining."""
    # Deliberately a no-op scaffold: point this at real data once available.
    path = os.path.join(out_dir, "labeled_dataset.csv")
    if not os.path.exists(path):
        with open(path, "w") as f:
            f.write("placeholder\n")
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n", type=int, default=12000)
    ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--out", default=os.path.join(os.path.dirname(__file__)))
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    X, Y = generate_dataset(args.n, args.seed)

    X_train, X_test, Y_train, Y_test = train_test_split(
        X, Y, test_size=0.15, random_state=args.seed
    )

    models = {}
    metrics = {}
    for i, dim in enumerate(DIMENSIONS):
        pipe = Pipeline([
            ("scaler", StandardScaler()),
            ("reg", GradientBoostingRegressor(
                n_estimators=220, max_depth=4, learning_rate=0.08,
                subsample=0.85, random_state=args.seed,
            )),
        ])
        pipe.fit(X_train, Y_train[:, i])
        pred = pipe.predict(X_test)
        mae = mean_absolute_error(Y_test[:, i], pred)
        models[dim] = pipe
        metrics[dim] = round(float(mae), 3)
        print(f"{dim:<24} MAE={mae:.3f}")

    artifact = {
        "feature_names": FEATURE_NAMES,
        "dimensions": DIMENSIONS,
        "models": models,
        "trained_on": "synthetic",
        "seed": args.seed,
        "n_samples": args.n,
        "test_mae": metrics,
    }
    model_path = os.path.join(args.out, "fingerprint_model.joblib")
    joblib.dump(artifact, model_path)

    with open(os.path.join(args.out, "feature_columns.json"), "w") as f:
        json.dump({"features": FEATURE_NAMES}, f, indent=2)

    mean_mae = sum(metrics.values()) / len(metrics)
    print(f"\nSaved model -> {model_path}")
    print(f"Avg test MAE across dimensions: {mean_mae:.3f} (0-100 scale)")
    dump_labeled_dataset(args.out)


if __name__ == "__main__":
    main()
