from enum import IntEnum
from typing import NamedTuple


IntEnum.__repr__ = lambda self: f"{type(self).__name__}.{self.name}"


# Enumeration for all Insect classes
class Insect(IntEnum):
    BEE = 1
    SPIDER = 2
    ANT = 3
    GRASSHOPPER = 4
    BEETLE = 5


class Team(IntEnum):
    WHITE = 0
    BLACK = 1


class Stone(NamedTuple):
    insect: Insect
    team: Team
