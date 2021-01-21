from copy import deepcopy
import logging
from typing import Iterator, List, Set, Tuple
from functools import cached_property
import random
import json

from .insect import Insect, Team, Stone
from .hive import Hive
from .hex import Hex

logger = logging.getLogger(__name__)


class Action:
    """ Base class for abstract game action that can be performed in a turn """
    def __eq__(self, other: "Action") -> bool:
        return self.__dict__ == other.__dict__

    def __repr__(self) -> str:
        args = ", ".join((v.__repr__() for v in self.__dict__.values()))
        return f"{type(self).__name__}({args})"

class Move(Action):
    """ Move from a origin Hex to a destination Hex """
    def __init__(self, origin: Hex, destination: Hex):
        self.origin = origin
        self.destination = destination


class Drop(Action):
    """ Drop a stone to a destination Hex """
    def __init__(self, stone: Stone, destination: Hex):
        self.stone = stone
        self.destination = destination

class Pass(Action):
    """ When no action is possible you have to pass """
    pass


class State:
    """
    State contains all information to completely describe each state of the game
    and some helper functions/attributes to optimize the processing.
    Necessary information is:
    - hive: Dict[Hex: List[Stone]]
    - turn_number: int
    Derivable from the atomic information
    - _bee_move
    - _availables

    Only valid states are representable.
    Root is the only starting point and every state is an ancestor of it.
    Any child is yielded from the application of a valid action on the parent state.
    """
    # TODO: good naming
    # TODO: Private functions
    # - avoid recomputation
    # TODO: behaviour when no moves possible for a player
    # TODO: Root state as subclass, better ini
    # TODO: beemove

    def __repr__(self):
        return f"State({self.hive}, {self._bee_move}, {self.turn_number}, {self.availables})"

    def to_json(self):
        dump = {}
        dump["hive"] = []
        for hex, stack in self.hive.items():
            for height, stone in enumerate(stack):
                dump["hive"].append({})
                temp = dump["hive"][-1]
                # r, s, h, name, team
                temp["q"] = hex.q
                temp["r"] = hex.r
                temp["height"] = height
                temp["name"] = stone.insect.value
                temp["team"] = stone.team.value
        # dump["availables"] = self.availables
        # TODO: add more information
        return json.dumps(dump)

    @property
    def current_team(self) -> Team:
        return Team.WHITE if self.turn_number % 2 else Team.BLACK

    @property
    def bee_move(self) -> bool:
        return self._bee_move[self.current_team.value]

    def __add__(self, action: Action) -> "State":
        """ Returns a new State with the action performed """
        assert action in self.possible_actions
        new_state = deepcopy(self)
        new_hive = new_state.hive
        if isinstance(action, Move):
            # Remove the stone from the old position and add it at the new one
            stone = new_hive.stone_at_hex(action.origin)
            new_hive.remove_stone(action.origin)
            new_hive.add_stone(action.destination, stone)
        elif isinstance(action, Drop):
            stone = action.stone
            if stone.insect == Insect.BEE:
                # TODO setter
                # Update that the bee is dropped
                new_state._bee_move[self.current_team.value] = True
            # Remove the dropped stone from the availables and add it to the hive
            new_state.availables.remove(stone)
            new_hive.add_stone(action.destination, stone)
        new_state.turn_number += 1
        # Unset them so they are recomputed on the new state
        if hasattr(new_state, "possible_actions"):
            del new_state.__dict__["possible_actions"]
        logger.debug(f"Created new state {new_state}")
        return new_state

    @property
    def game_result(self):
        """ If a queen is completely surrounded the other player wins """
        # Maybe move to Hive
        white_lost = black_lost = False
        for hex, stones in self.hive.items():
            stone = stones[0]
            if stone.insect == Insect.BEE:
                if self.hive.hex_surrounded(hex):
                    if stone.team == Team.WHITE:
                        white_lost = True
                    else:
                        black_lost = True
        return 0 if white_lost and black_lost else 1 if white_lost else -1 if black_lost else None

    def is_game_over(self) -> bool:
        """ Check if the game is over """
        return not (self.game_result is None)

    def _unique_availables(self) -> Set[Stone]:
        """ Returns the unique availables Stones that can be dropped by the current team """
        return {a for a in self.availables if a.team == self.current_team}

    @cached_property
    def possible_actions(self) -> Tuple[Action]:
        """ Generate all legal actions for the current state """
        opts = []
        drop_stones = self._unique_availables()
        if self.turn_number == 0:
            opts = [Drop(stone, Hex(0, 0)) for stone in drop_stones]
        elif self.turn_number == 1:
            neighbours = self.hive.get_root_hex().neighbors()
            opts = [Drop(stone, hex) for stone in drop_stones for hex in neighbours]
        elif self.turn_number >= 6 and not self.bee_move:
            for drop_hex in self.hive.generate_drops(self.current_team):
                opts.append(Drop(Stone(Insect.BEE, self.current_team), drop_hex))
        else:
            for drop_hex in self.hive.generate_drops(self.current_team):
                opts.extend(Drop(stone, drop_hex) for stone in drop_stones)
            if self.bee_move:
                for origin, destination in self.hive.generate_moves(self.current_team):
                    opts.append(Move(origin, destination))
        return tuple(opts) if opts else (Pass(),)

    def children(self) -> Tuple[Action]:
        return tuple(self + action for action in self.possible_actions)

    def next_state(self, policy=random.choice):
        return self + policy(self.possible_actions)


class Root(State):

    def __init__(self):
        self.hive = Hive()
        self._bee_move = [False, False]
        self.turn_number = 0
        insects = (Insect.BEE,
                    Insect.SPIDER, Insect.SPIDER,
                    Insect.ANT, Insect.ANT, Insect.ANT,
                    Insect.GRASSHOPPER, Insect.GRASSHOPPER, Insect.GRASSHOPPER,
                    Insect.BEETLE, Insect.BEETLE)
        self.availables = [Stone(insect, team) for insect in insects for team in list(Team)]
