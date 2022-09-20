import time

from .graph_type import Location
from .constant import GRID_GRAPH_WALL_KEY, STEP_TIME
from ..config.redis import redis


async def time_enhanced(agv: int, obstacles: list[Location]):
    keys = await redis.keys(f'{GRID_GRAPH_WALL_KEY}:*')
    sorted_keys = sorted(keys) if keys else []
    field = f'{agv}'

    if len(sorted_keys) > len(obstacles):
        for index, name in enumerate(sorted_keys):
            value = f'{obstacles[index]}'
            if index >= len(obstacles):
                await redis.hdel(name, field)
            else:
                await redis.hset(name, field, value)
    else:
        for index, obs in enumerate(obstacles):
            value = f'{obs}'
            if index >= len(sorted_keys):
                now = time.time()
                key = f'{GRID_GRAPH_WALL_KEY}:{now}'
                await redis.hset(key, mapping={field: value})
                time_out = (index + 1) * STEP_TIME
                await redis.expire(key, time_out)
            else:
                name = sorted_keys[index]
                await redis.hset(name, field, value)
