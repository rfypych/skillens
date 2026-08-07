import os
import sys
import logging
from celery_app import celery
from database import SessionLocal
import models
from openai import OpenAI
from dotenv import load_dotenv

# Ensure the backend directory is in the path for celery workers
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()
logger = logging.getLogger(__name__)


# ── Plain sync implementations (no Celery/Redis required) ──────────────────

def generate_assessment_for_job_sync(job_id: int):
    """Generate the LLM scenario + trap word for a job. Runs inline, no Celery needed."""
    db = SessionLocal()
    try:
        job = db.query(models.Job).filter(models.Job.id == job_id).first()
        if not job:
            return

        auto_generate = job.description == "AUTO_GENERATE"

        system_prompt = f"""You are an expert HR and Lead Engineer.
Your task is to generate a highly complex, immersive, and realistic case study scenario for a job application.
DO NOT just list the job requirements as tasks. Instead, create a real-world, problematic situation (a "day-in-the-life" crisis or project) that the candidate must solve through an interactive chat.
The scenario must present specific context, constraints, and mock data/logs if applicable.
Language: {job.language}

Job Title: {job.title}
Job Description: {job.description if not auto_generate else 'Please generate a detailed and professional Job Description based on the outcomes and skills.'}
Expected Outcome: {job.expected_outcomes}
Specific Skills: {job.specific_skills}

Output Format: You MUST reply ONLY in raw JSON format with {"TWO keys: 'scenario' and 'job_description'" if auto_generate else "a single key 'scenario'"}.
CRITICAL INSTRUCTION FOR SCENARIO CONTENT: 
The scenario text must be beautifully formatted in Markdown. 
Use clear H3 headers (###) and bullet points. 
Include sections for:
1. '### Background Context': Set the scene (e.g., "You are joining us on a day when our core database is experiencing 100% CPU spikes...").
2. '### The Challenge': Detail the specific technical or business problem.
3. '### Your Mission': Clearly list 3-4 specific questions or actions the candidate needs to answer or perform in this interview.
Make it immersive, professional, and challenging!

VERY IMPORTANT JSON RULE: 
DO NOT use the markdown headings as JSON keys. 
All of the markdown text MUST be combined into a SINGLE long string value assigned to the "scenario" key. 
Do NOT output markdown code blocks (like ```json) for the JSON envelope, just return the raw JSON object.
"""

        scenario_prompt = ""
        generated_job_desc = None
        import json
        import re

        def extract_json_scenario(raw_text):
            match = re.search(r'\{.*\}', raw_text, re.DOTALL)
            text_to_parse = match.group(0) if match else raw_text
            try:
                data = json.loads(text_to_parse)
                scenario = data.get("scenario", "Failed to extract scenario from JSON.")
                if isinstance(scenario, dict) or isinstance(scenario, list):
                    scenario = json.dumps(scenario, indent=2)
                else:
                    scenario = str(scenario)
                return scenario, data.get("job_description")
            except Exception:
                return raw_text, None  # Fallback to raw text if JSON parsing completely fails

        try:
            client = OpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                base_url=os.getenv("OPENAI_API_BASE"),
                default_headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"},
                timeout=30.0
            )
            response = client.chat.completions.create(
                model=os.getenv("LLM_MODEL_NAME", "qwen3.7-plus"),
                messages=[{"role": "user", "content": system_prompt}],
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=1500
            )
            scenario_prompt, generated_job_desc = extract_json_scenario(response.choices[0].message.content.strip())
        except Exception as e:
            logger.error(f"Primary LLM error generating scenario: {str(e)}. Falling back to Groq.")
            try:
                groq_client = OpenAI(
                    api_key=os.getenv("GROQ_API_KEY"),
                    base_url="https://api.groq.com/openai/v1",
                    timeout=30.0
                )
                response = groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": system_prompt}],
                    response_format={"type": "json_object"},
                    temperature=0.7,
                    max_tokens=1500
                )
                scenario_prompt, generated_job_desc = extract_json_scenario(response.choices[0].message.content.strip())
            except Exception as e2:
                logger.error(f"Fallback Groq failed: {e2}")
                raise e2

        import random
        trap_words = ["mentimun", "jerapah", "kulkas", "sepeda", "semangka", "kalkulator", "lemari", "jendela", "bantal", "gajah", "durian", "payung", "sepatu", "sendok", "garpu"]
        hidden_prompt = random.choice(trap_words)

        new_assessment = models.Assessment(
            job_id=job.id,
            scenario_prompt=scenario_prompt,
            hidden_prompt=hidden_prompt
        )

        if auto_generate and generated_job_desc:
            job.description = str(generated_job_desc)

        db.add(new_assessment)
        db.commit()
    finally:
        db.close()

    return {"status": "success", "job_id": job_id}


def run_ai_eval_sync(application_id: int, result_id: int):
    """Run AI evaluation synchronously in a fresh event loop. No Celery needed."""
    import asyncio
    from services.ai_evaluator import evaluate_candidate_answer_task

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        coro = evaluate_candidate_answer_task(application_id, result_id)
        loop.run_until_complete(asyncio.wait_for(coro, timeout=180.0))
        _notify_candidate_evaluated(application_id)
        logger.info(f"AI eval completed synchronously for application {application_id}")
    finally:
        loop.close()
    return {"status": "success", "application_id": application_id}


def _notify_candidate_evaluated(application_id: int):
    db = SessionLocal()
    try:
        app = db.query(models.Application).filter(models.Application.id == application_id).first()
        if app and app.job:
            notif = models.Notification(
                user_id=app.user_id,
                message=f"Your assessment for {app.job.title} has been evaluated."
            )
            db.add(notif)
            db.commit()
    except Exception as e:
        logger.error(f"Failed to notify candidate for application {application_id}: {e}")
    finally:
        db.close()


# ── Celery wrappers (optional — used when a worker is running) ─────────────

@celery.task(bind=True, max_retries=3, default_retry_delay=10)
def generate_assessment_for_job(self, job_id: int):
    try:
        return generate_assessment_for_job_sync(job_id)
    except Exception as e:
        logger.error(f"Assessment generation failed for job {job_id}: {e}")
        raise self.retry(exc=e)


@celery.task(bind=True, max_retries=3, default_retry_delay=10)
def run_ai_eval_sync_task(self, application_id: int, result_id: int):
    import asyncio

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        from services.ai_evaluator import evaluate_candidate_answer_task
        coro = evaluate_candidate_answer_task(application_id, result_id)
        loop.run_until_complete(asyncio.wait_for(coro, timeout=120.0))
        _notify_candidate_evaluated(application_id)
        return {"status": "success", "application_id": application_id}
    except asyncio.TimeoutError as e:
        logger.error(f"AI Eval timed out for application {application_id} after 120s.")
        raise self.retry(exc=e, max_retries=3, countdown=15)
    except Exception as e:
        logger.error(f"AI Eval failed for application {application_id}: {str(e)}")
        raise self.retry(exc=e)
    finally:
        loop.close()
