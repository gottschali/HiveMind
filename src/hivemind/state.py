from copy import deepcopy
import logging
from typing import Iterator, List
from functools import cached_property
import random
import json

from .insect import Insect, Team, Stone
from .hive import Hive
from .hex import Hex

logger = logging.getLogger(__name__)

# TODO: Origin hex constant

class Action:
    """ Base class for abstract game action that can be performed in a turn """
    pass

class Move(Action):
    """ Move from a origin Hex to a destination Hex """
    def __init__(self, origin: Hex, destination: Hex):
        self.origin = origin
        self.destination = destination

    def __repr__(self):
        return f"Move({self.origin}, {self.destination})"

class Drop(Action):
    """ Drop a stone to a destination Hex """
    def __init__(self, stone: Stone, destination: Hex):
        self.stone = stone
        self.destination = destination

    def __repr__(self):
        return f"Drop('{self.stone}', {self.destination})"


class State:
    # TODO: good naming
    # TODO: Private functions
    # TODO Define specifications (immutability)
    # - Where is verification needed
    # - avoid recomputation
    # - lazy computation: only if necessary
    # TODO: behaviour when no moves possible for a player
    # TODO: Root state as subclass, better ini
    # TODO: beemove


    def __init__(self, hive, bee_move, turn_number, availables):
        self.hive = hive
        self._bee_move = bee_move
        self.turn_number = turn_number
        self.availables = availables
        self.articulation_points = self.hive.one_hive()

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
        # TODO : Invalid action
        assert action in self.possible_actions
        new_state = deepcopy(self)
        new_hive = new_state.hive
        destination = action.destination
        if isinstance(action, Move):
            # Remove the stone from the old position and add it at the new one
            stone = new_hive.stone_at_hex(action.origin)
            new_hive.remove_stone(action.origin)
            new_hive.add_stone(destination, stone)
        elif isinstance(action, Drop):
            stone = action.stone
            if stone.insect == Insect.BEE:
                # TODO setter
                # Update that the bee is dropped
                new_state._bee_move[self.current_team.value] = True
            # Remove the dropped stone from the availables and add it to the hive
            new_state.availables.remove(stone)
            new_hive.add_stone(destination, stone)
        new_state.turn_number += 1
        # Maybe cached property and unset them, so they are computed when needed
        new_state.articulation_points = new_hive.one_hive()
        new_state.possible_actions = tuple(new_state.generate_actions())
        logger.debug(f"Created new state {new_state}")
        return new_state

    def validate_action(self, action: Action) -> bool:
        logger.debug(f"Validating action: {action}")
        # TODO Bee latest played in fourth turn
        if isinstance(action, Move):
            return self.validate_move(action)
        elif isinstance(action, Drop):
            return self.validate_drop(action)
        else:
            raise Exception("Action must be either a Move or a Drop")

    def validate_move(self, move: Move) -> bool:
        logger.debug(f"Validating move: {move}")
        hex = move.origin
        # No insect at the location
        if hex not in self.hive:
            logger.warn(f"There is no insect at move origin {hex}")
            return False
        stone = self.hive.stone_at_hex(hex)
        # Wrong Team
        if stone.team != self.current_team:
            logger.warn(f"The stone at {hex} belongs to player {self.current_team}")
            return False
        # Bee not played yet
        if not self.bee_move:
            logger.warn(f"Insects can't be moved before the bee is played")
            return False
        if self.hive.height(hex) == 1 and hex in self.articulation_points:
            logger.warn(f"The insect can't be moved due to the one hive rule")
            return False
        # Check if the target is valid
        possible_actions = list(self.hive.generate_moves_for_stone(stone, hex))
        logger.debug(f"Checking the possible moves {possible_actions}")
        return move.destination in possible_actions


    def validate_drop(self, drop: Drop) -> bool:
        """
        Check if adding a stone to the board is legal:
        it may not be adjacent to stones of the enemy and must touch
        atleast one friendly stone.
        (the highest counts if they are stacked)
        The queen must be dropped in the first four moves
        """
        logger.debug(f"Valdidating drop: {drop}")
        if drop.stone not in self.availables:
            logger.warn(f"The insect {drop.stone} is not available for dropping anymore")
            return False
        # Only dropping on free hexes is allowed
        hex = drop.destination
        if hex in self.hive:
            logger.warn(f"You cannot drop insects on occupied tiles")
            return False
        if self.turn_number == 0:
            logger.debug(f"Every drop is valid in the first round")
            # Any hex is valid
            return True
        elif self.turn_number == 1:
            logger.debug(f"Checking if the second stone is adjacent to the first")
            # Only adjacent hexes to the first are valid
            return self.hive.get_root_hex().adjacent(hex)
        val = self.hive.neighbor_team(hex, self.current_team)
        logger.debug(f"Checking the surrounded insects for their color: {val}")
        return val

    @property
    def game_result(self):
        """ If a queen is completely surrounded the other player wins """
        white_lost = black_lost = False
        for hex, stones in self.hive.items():
            stone = stones[0]
            if stone.insect == Insect.BEE:
                if self.hive.hex_surrounded(hex):
                    if stone.team == team.WHITE:
                        white_lost = True
                    else:
                        black_lost = True
        return 0 if white_lost and black_lost else 1 if white_lost else -1 if black_lost else None

    def is_game_over(self) -> bool:
        """ Check if the game is over """
        return not self.game_result is None

    def unique_availables(self):
        # Unique only from team
        return {a for a in self.availables if a.team == self.current_team}

    def generate_actions(self) -> Iterator[Move]:
        """ Generate all legal actions for the current state """
        # TODO DRY
        if self.turn_number == 0:
            # TODO oneline
            for stone in self.unique_availables():
                yield Drop(stone, Hex(0, 0))
        elif self.turn_number == 1:
            root = self.hive.get_root_hex()
            # TODO oneline
            for hex in root.neighbors():
                for stone in self.unique_availables():
                    yield Drop(stone,hex)
        elif self.turn_number >= 6 and not self.bee_move:
            for drop_hex in self.hive.generate_drops(self.current_team):
                yield Drop(Stone(Insect.BEE, self.current_team), drop_hex)
        else:
            for drop_hex in self.hive.generate_drops(self.current_team):
                for stone in self.unique_availables():
                    yield Drop(stone, drop_hex)
            if self.bee_move:
                for origin, destination in self.hive.generate_moves(self.current_team):
                    yield Move(origin, destination)

    @cached_property
    def possible_actions(self):
        return tuple(self.generate_actions())

    def possible_actions_for_hex(self, hex):
        for action in self.possible_actions:
            if isinstance(action, Move):
                if action.origin == hex:
                    yield action.destination

    def children(self):
        for action in self.possible_actions:
            yield self + action

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
        self.articulation_points = self.hive.one_hive()
