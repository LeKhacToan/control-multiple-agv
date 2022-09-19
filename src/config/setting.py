import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

_env = os.environ.get

REDIS_URL = _env.get("REDIS_URL")

GRID_WIDTH = _env.get('GRID_WIDTH', 500)
GRID_HEIGHT = _env.get('GRID_HEIGHT', 500)