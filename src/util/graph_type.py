from typing import Tuple, Protocol, TypeVar

GridLocation = Tuple[int, int]
Location = TypeVar('Location')


class Graph(Protocol):
    def neighbors(self, id: Location) -> list[Location]: pass


class WeightedGraph(Graph):
    def cost(self, from_id: Location, to_id: Location) -> float: pass