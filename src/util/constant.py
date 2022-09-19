from enum import Enum

class Direction(Enum):
    N = 'N'
    E = 'E'
    S = 'S'
    W = 'W'

STEP_TIME = 2 # seconds
GRID_GRAPH_WALL_KEY = 'grid_graph.wall'