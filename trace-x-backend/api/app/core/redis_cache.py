import logging
import json
from typing import Optional, Any
import redis.asyncio as aioredis
from app.core.config import settings

logger = logging.getLogger("tracex_redis")

_redis_client: Optional[aioredis.Redis] = None


async def get_redis() -> Optional[aioredis.Redis]:
    global _redis_client
    if _redis_client is None:
        try:
            _redis_client = aioredis.from_url(
                settings.REDIS_URL,
                encoding="utf-8",
                decode_responses=True,
                socket_timeout=2.0,
            )
        except Exception as e:
            logger.warning(f"Could not connect to Redis at {settings.REDIS_URL}: {e}")
            return None
    return _redis_client


async def get_cached_json(key: str) -> Optional[Any]:
    """Retrieve and deserialize JSON from Redis. Return None if miss or unavailable."""
    try:
        r = await get_redis()
        if r:
            val = await r.get(key)
            if val:
                return json.loads(val)
    except Exception as e:
        logger.debug(f"Redis get cache failed for key {key}: {e}")
    return None


async def set_cached_json(key: str, data: Any, ttl_seconds: int = 45) -> None:
    """Serialize and cache JSON in Redis with specified TTL."""
    try:
        r = await get_redis()
        if r:
            serialized = json.dumps(data, default=str)
            await r.setex(key, ttl_seconds, serialized)
    except Exception as e:
        logger.debug(f"Redis set cache failed for key {key}: {e}")


async def invalidate_cache_pattern(pattern: str) -> None:
    """Invalidate all keys matching pattern (e.g. 'cases:network:*' or 'dashboard:summary:*')."""
    try:
        r = await get_redis()
        if r:
            keys = await r.keys(pattern)
            if keys:
                await r.delete(*keys)
                logger.info(f"Invalidated {len(keys)} Redis cache keys matching '{pattern}'")
    except Exception as e:
        logger.debug(f"Redis invalidate failed for pattern {pattern}: {e}")
