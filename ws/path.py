import ast
from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from util.connection import manager
from util.grid_graph import GridWithWeights, reconstruct_path, convert_path_to_obstacle
from util.a_star import a_star_search
from util.time_enhanced import time_enhanced
from util.constant import GRID_GRAPH_WALL_KEY

from config.setting import GRID_HEIGHT, GRID_WIDTH
from config.redis import redis

router = APIRouter()


def parse_tuple(string):
    try:
        s = ast.literal_eval(str(string))
        if type(s) == tuple:
            return s
        return
    except:
        return


async def get_wall(agv_id: int):
    keys = await redis.keys(f'{GRID_GRAPH_WALL_KEY}:*')
    if not keys:
        return []

    sorted_keys = sorted(keys)
    key = sorted_keys[0]
    wall_raw = await redis.hgetall(key)
    print(wall_raw)
    wall_value = [parse_tuple(value)
                  for key, value in wall_raw.items() if int(key) != agv_id]
    return wall_value


@router.websocket("/path/{agv_id}")
async def path_finding(websocket: WebSocket, agv_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            direction = data['direction']
            start = (data['position']['x'], data['position']['y'])
            goal = (250, 10)

            diagram = GridWithWeights(GRID_WIDTH, GRID_HEIGHT)
            diagram.walls = await get_wall(agv_id)
            came_from, cost_so_far = a_star_search(diagram, start, goal)
            path = reconstruct_path(came_from, start=start, goal=goal)
            coordinates = [{"x": x, "y": y} for x, y in path]

            await manager.send_personal_message_json(coordinates, websocket)

            obstacles = convert_path_to_obstacle(
                path=path, direction=direction)
            await time_enhanced(agv_id, obstacles)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
