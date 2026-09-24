"""
Vision analysis for portfolio documentation photos.

Provider: Google Gemini (free tier) via its OpenAI-compatible endpoint.
Requires GOOGLE_API_KEY in backend/.env — free key in ~2 minutes at
https://aistudio.google.com/apikey (no credit card).

Why not local: evaluated honestly 2026-09-24 —
- Moondream2 (1.8B, CPU): OOM-kills this 12GB machine (fp32 ~7GB, fp16 still
  ~3.5GB+torch alongside the API server).
- SmolVLM-256M (CPU): runs but outputs garbage
  ("Kasus di kawin.") — unusable.
- Groq key: exposes no vision model. Free hosted fallback (pollinations):
  hallucinated an office from a panel sketch.
So: cloud vision behind a free key, everything else (extract/store/wire/UI)
already works without it.
"""
import logging
import threading

logger = logging.getLogger(__name__)

GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/openai/"
GEMINI_MODEL = "gemini-2.0-flash"


def _settings():
    from config import settings

    return settings


def is_available() -> bool:
    """True when a Gemini key is configured (extra check in .env.example)."""
    try:
        key = (_settings().GOOGLE_API_KEY or "").strip()
    except Exception:
        key = ""
    return bool(key)


def describe_photo(png_bytes: bytes, question: str) -> str | None:
    """Describe one photo via Gemini vision. None on any failure (never raises)."""
    try:
        import base64

        from openai import OpenAI

        key = (_settings().GOOGLE_API_KEY or "").strip()
        if not key:
            return None
        client = OpenAI(api_key=key, base_url=GEMINI_BASE, timeout=60.0)
        b64 = base64.b64encode(png_bytes).decode()
        resp = client.chat.completions.create(
            model=GEMINI_MODEL,
            max_tokens=300,
            temperature=0.2,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": question},
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{b64}"},
                        },
                    ],
                }
            ],
        )
        return (resp.choices[0].message.content or "").strip() or None
    except Exception as e:
        logger.warning(f"Gemini vision failed: {str(e)[:200]}")
        return None


FORENSIC_QUESTION = (
    "Foto dokumentasi kerja ini: (1) apakah terlihat orang yang sedang BEKERJA "
    "(bukan foto stok)? (2) peralatan atau aktivitas teknis apa yang terlihat? "
    "(3) adakah indikasi keselamatan kerja (APD, harness, barikade) atau bahaya? "
    "Jawab ringkas dalam Bahasa Indonesia, faktual saja, tanpa mengarang identitas orang."
)


def analyze_application_photos(app_id: int, photo_urls: list, upload_dir: str = "uploads"):
    """Background entry: analyze photos and persist JSON summary on the application."""
    import json
    import os
    from database import SessionLocal
    import models

    db = SessionLocal()
    try:
        findings = []
        for url in (photo_urls or [])[:3]:
            fname = url.rsplit("/", 1)[-1]
            fpath = os.path.join(upload_dir, fname)
            if not os.path.exists(fpath):
                continue
            try:
                with open(fpath, "rb") as f:
                    desc = describe_photo(f.read(), FORENSIC_QUESTION)
            except Exception:
                desc = None
            findings.append({"photo": url, "analysis": desc or "Tidak dapat dianalisis."})
        app = db.query(models.Application).filter(models.Application.id == app_id).first()
        if app:
            import datetime
            app.resume_visual_analysis = json.dumps({
                "analyzed_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "engine": "gemini-2.0-flash",
                "findings": findings,
            })
            db.commit()
            logger.info(f"Visual analysis stored for application {app_id}.")
    except Exception as e:
        logger.warning(f"Visual analysis job failed for {app_id}: {e}")
    finally:
        db.close()
