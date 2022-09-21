import os
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

_env = os.environ.get

REDIS_URL = _env("REDIS_URL")

GRID_WIDTH = _env('GRID_WIDTH', 50)
GRID_HEIGHT = _env('GRID_HEIGHT', 30)