import aioredis

from .setting import REDIS_URL


redis = aioredis.from_url(REDIS_URL, decode_responses=True)