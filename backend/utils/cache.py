"""Tiny Redis read-through cache for hot list endpoints.

Fail-open by design: if Redis is unreachable or any step errors, the caller
falls through to the database. Short TTL (60s default) keeps staleness bounded
without needing write-path invalidation.
"""
import json
import logging

logger = logging.getLogger(__name__)

_redis = None
_redis_tried = False


def get_redis():
    global _redis, _redis_tried
    if _redis is not None:
        return _redis
    if _redis_tried:
        return None
    _redis_tried = True
    try:
        from config import settings
        import redis
        from urllib.parse import urlparse, parse_qsl, urlencode, urlunparse

        # Upstash-style URLs may carry ?ssl_cert_reqs=CERT_NONE which this
        # redis client rejects; strip it (rediss:// already implies TLS).
        u = urlparse(settings.REDIS_URL)
        q = [(k, v) for k, v in parse_qsl(u.query) if k.lower() != "ssl_cert_reqs"]
        url = urlunparse(u._replace(query=urlencode(q)))
        client = redis.Redis.from_url(
            url, socket_timeout=2, socket_connect_timeout=2,
            decode_responses=True,
        )
        client.ping()
        _redis = client
        return _redis
    except Exception as e:
        logger.warning(f"Redis cache disabled ({e})")
        return None


def cached_list(key: str, ttl: int = 60):
    """Return cached JSON list for key, or None on miss/unavailable."""
    r = get_redis()
    if r is None:
        return None
    try:
        hit = r.get(key)
        return json.loads(hit) if hit else None
    except Exception:
        return None


def store_list(key: str, value, ttl: int = 60):
    """Best-effort store of a JSON-serializable list. Never raises."""
    r = get_redis()
    if r is None:
        return
    try:
        r.setex(key, ttl, json.dumps(value))
    except Exception:
        pass
