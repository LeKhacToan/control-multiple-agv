import time

from config.redis import redis
from .graph_type import Location
from .constant import GRID_GRAPH_WALL_KEY, STEP_TIME


async def time_enhanced(agv: int, obstacles: list[Location]):
    keys = await redis.keys(f'{GRID_GRAPH_WALL_KEY}:*')
    sorted_keys = keys.sort()
    field = f'{agv}'

    if sorted_keys.length > obstacles.length:
        for index, name in sorted_keys:
            value = f'{obstacles[index]}'
            if index >= obstacles.length:
                await redis.hdel(name, field)
            else:
                await redis.hset(name, field, value)
    else:
        for index, obs in obstacles:
            value = f'{obs}'
            if index >= sorted_keys.length:
                now = time.time()
                key = f'{GRID_GRAPH_WALL_KEY}:{now}'
                await redis.hset(key, mapping={field: value})
                time_out = index * STEP_TIME
                await redis.expire(key, time_out)
            else:
                await redis.hset(name, field, value)
