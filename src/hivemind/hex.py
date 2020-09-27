# Adapted from -- http://www.redblobgames.com/grids/hexagons/


import math
from typing import Iterator, Tuple


class Hex:
    """
    Represents a tile in a hexagonal grid.
    q and r represent the axial coordinates.
    The third cube coordinate s is calculated implicitly.
    """
    directions = (
        (+1, -1, 0),
        (+1, 0, -1),
        (0, +1, -1),
        (-1, +1, 0),
        (-1, 0, +1),
        (0, -1, +1),
        )
    def __init__(self, q: int = 0, r: int = 0, _=None):
        self.q = q
        self.r = r
        self.s = -(q + r)
        self._coords = (self.q, self.r, self.s)

    def __eq__(self, other: "Hex") -> bool:
        try:
            return self.q == other.q and self.r == other.r
        except:
            return False

    def __getitem__(self, index: int) -> int:
        return self._coords[index]

    def __repr__(self) -> str:
        return f"Hex({self.q}, {self.r}, {self.s})"

    def __hash__(self) -> int:
        return hash(self._coords)

    def __add__(self, other) -> "Hex":
        return Hex(self.q + other[0], self.r + other[1])

    def __sub__(self, other: "Hex") -> "Hex":
        return Hex(self.q - other[0], self.r - other[1])

    def __neg__(self) -> "Hex":
        return Hex(-self.q, -self.r)

    def __mul__(self, scalar: int) -> "Hex":
        return Hex(self.q * scalar, self.r * scalar)

    def neighbors(self) -> Iterator["Hex"]:
        return (self + direction for direction in self.directions)

    def circle_iterator(self) -> Iterator[Tuple["Hex", "Hex", "Hex"]]:
        """ Yields 6 tuples of 3 neighboring hexes """
        neighbors = list(self.neighbors())
        for i in range(6):
            yield neighbors[i], neighbors[(i + 1) % 6], neighbors[(i + 2) % 6]

    def adjacent(self, other: "Hex") -> bool:
        """ Returns whether two hexes share a common side """
        return other in self.neighbors()


