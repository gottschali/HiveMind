from enum import IntEnum
from typing import NamedTuple


# Enumeration for all Insect classes
class Insect(IntEnum):
    BEE = 1
    SPIDER = 2
    ANT = 3
    GRASSHOPPER = 4
    BEETLE = 5

    def __repr__(self) -> str:
        return f"{type(self).__name__}.{self.name}"


class Team(IntEnum):
    WHITE = 0
    BLACK = 1

    def __repr__(self) -> str:
        return f"{type(self).__name__}.{self.name}"


class Stone(NamedTuple):
    insect: Insect
    team: Team
