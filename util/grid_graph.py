from typing import Iterator

from .graph_type import GridLocation, Location
from .constant import Direction


class SquareGrid:
    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height
        self.walls: list[GridLocation] = []

    def in_bounds(self, id: GridLocation) -> bool:
        (x, y) = id
        return 0 <= x < self.width and 0 <= y < self.height

    def passable(self, id: GridLocation) -> bool:
        return id not in self.walls

    def neighbors(self, id: GridLocation) -> Iterator[GridLocation]:
        (x, y) = id
        neighbors = [(x+1, y), (x-1, y), (x, y-1), (x, y+1)]  # E W N S
        # see "Ugly paths" section for an explanation:
        if (x + y) % 2 == 0:
            neighbors.reverse()  # S N W E
        results = filter(self.in_bounds, neighbors)
        results = filter(self.passable, results)
        return results


class GridWithWeights(SquareGrid):
    def __init__(self, width: int, height: int):
        super().__init__(width, height)
        self.weights: dict[GridLocation, float] = {}

    def cost(self, from_node: GridLocation, to_node: GridLocation) -> float:
        return self.weights.get(to_node, 1)


def reconstruct_path(came_from: dict[Location, Location],
                     start: Location, goal: Location) -> list[Location]:

    current: Location = goal
    path: list[Location] = []
    if goal not in came_from:  # no path was found
        return []
    while current != start:
        path.append(current)
        current = came_from[current]
    path.append(start)  # optional
    path.reverse()  # optional
    return path


def change_direction(next_position: Location, position: Location,
                     direc: Direction) -> bool:
    next_x, next_y = next_position
    x, y = position

    horizontal = [x - 1, x + 1]  # E W
    vertical = [y - 1, y + 1]  # N S

    if next_x in horizontal and direc in [Direction.N.value, Direction.S.value]:
        return True, Direction.E.value
    if next_y in vertical and direc in [Direction.E.value, Direction.W.value]:
        return True, Direction.N.value

    return False, direc


def convert_path_to_obstacle(path: list[Location],
                             direction: Direction) -> list[Location]:
    obstacles = []
    current_direc = direction
    for index, location in enumerate(path):
        obstacles.append(location)
        if index == 0:
            # current position as obstacles (k=1)
            obstacles.append(location)

        next_index = index + 1
        if next_index < len(path):
            is_change, direc = change_direction(
                path[next_index], location, current_direc)
            current_direc = direc
            if is_change:
                # rotate -> 2 frames
                obstacles.append(location)
    return obstacles
