from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="allow")
    PROJECT_NAME: str = "Skillens API"
    ENVIRONMENT: str = "development"
    DATABASE_URL: str
    REDIS_URL: str = "redis://localhost:6379/0"
    JWT_SECRET_KEY: str
    # When true, AI evaluations are dispatched to Celery (requires a running worker).
    # When false (default), evaluations run inline in a background task so results
    # are always produced even without Redis/worker infrastructure.
    USE_CELERY: bool = False
    # Production domain(s) for CORS, comma-separated (e.g. https://skillens.id)
    FRONTEND_URL: str = ""
    # LLM contract: primary via OPENAI_* (OpenAI-compatible, default Groq),
    # fallback via GROQ_API_KEY (or reuse OPENAI_API_KEY) + LLM_FALLBACK_MODEL.
    OPENAI_API_KEY: str = ""
    OPENAI_API_BASE: str = "https://api.groq.com/openai/v1"
    LLM_MODEL_NAME: str = "qwen/qwen3.8-27b"
    GROQ_API_KEY: str = ""
    LLM_FALLBACK_MODEL: str = "openai/gpt-oss-120b"
    # Free key at https://aistudio.google.com/apikey — enables portfolio
    # photo vision (services/vision.py). Empty = vision endpoint returns 503.
    GOOGLE_API_KEY: str = ""
    
    @field_validator("JWT_SECRET_KEY")
    @classmethod
    def validate_jwt_secret(cls, v):
        if len(v) < 32:
            raise ValueError("JWT_SECRET_KEY must be at least 32 characters long")
        return v

settings = Settings()
