from copy import deepcopy
import logging
from typing import Iterator, List

from .insect import Insect, Bee, Spider, Ant, GrassHopper, Beetle
from .hive import Hive
from .action import Action, Move, Drop
from .hex import Hex

logger = logging.getLogger(__name__)

# TODO good naming
# Private functions

class State:
    insects = ("bee",
               "spider", "spider",
               "ant", "ant", "ant",
               "grasshopper", "grasshopper", "grasshopper",
               "beetle", "beetle")
    mapping = {"bee": Bee,
               "spider": Spider,
               "ant": Ant,
               "grasshopper": GrassHopper,
               "beetle": Beetle}

    def __init__(self, hive=None, bee_move=(False, False), turn_number=0, availables=None):
        self.hive = hive if hive else Hive()
        self._bee_move = list(bee_move)
        self.turn_number = turn_number
        if availables is None:
            self._availables = [[i for i in self.insects],
                               [i for i in self.insects]]
        else:
            self._availables = availables
        self.articulation_points = self.hive.one_hive()

    def __repr__(self):
        return f"State({self.hive}, {self._bee_move}, {self.turn_number}, {self._availables})"

    @property
    def current_team(self) -> bool:
        return self.turn_number % 2

    @property
    def bee_move(self) -> bool:
        return self._bee_move[self.current_team]

    def availables(self) -> List[str]:
        return self._availables[self.current_team]

    def insect_from_name(self, name: str) -> Insect:
        """ Get an insect instance by name for the current team """
        return self.mapping[name](self.current_team)

    def __add__(self, action) -> "State":
        assert isinstance(action, Action) is True
        if self.validate_action(action):
            logger.debug(f"Validated action {action} successfully")
            # Create new state
            new_state = deepcopy(self)
            new_hive = new_state.hive
            destination = action.destination
            if isinstance(action, Move): # Action
                insect = new_hive.insect_at_hex(action.origin)
                new_hive.remove_insect(action.origin)
            else: # Drop
                insect = self.insect_from_name(action.insect)
                if isinstance(insect, Bee):
                    # TODO setter
                    new_state._bee_move[self.current_team] = True
                new_state.availables().remove(insect.name)
            new_hive.add_insect(destination, insect)
            new_state.turn_number += 1
            # Not so nice / bad practice, new instantiation instead of copy?
            new_state.articulation_points = new_hive.one_hive()
            logger.debug(f"Created new state {new_state}")
            return new_state
        logger.warn(f"Validation for action {action} failed!")
        return None

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
        insect = self.hive.insect_at_hex(hex)
        # Wrong Team
        if insect.team != self.current_team:
            logger.warn(f"The insect at {hex} belongs to player {self.current_team}")
            return False
        # Bee not played yet
        if not self.bee_move:
            logger.warn(f"Insects can't be moved before the bee is played")
            return False
        if self.hive.height(hex) == 1 and hex in self.articulation_points:
            logger.warn(f"The insect can't be moved due to the one hive rule")
            return False
        # Check if the target is valid
        possible_moves = list(self.hive.generate_moves_for_insect(insect.name, hex))
        logger.debug(f"Checking the possible moves {possible_moves}")
        return move.destination in possible_moves


    def validate_drop(self, drop: Drop) -> bool:
        """
        Check if adding a stone to the board is legal:
        it may not be adjacent to stones of the enemy and must touch
        atleast one friendly stone.
        (the highest counts if they are stacked)
        The queen must be dropped in the first four moves
        """
        logger.debug(f"Valdidating drop: {drop}")
        if drop.insect not in self.availables():
            logger.warn(f"The insect {drop.insect} is not available for dropping anymore")
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
            return any(self.hive.neighbors(hex))
        logger.debug("Checking the surrounded insects for their color")
        return self.hive.neighbor_team(hex, self.current_team)

    @property
    def game_result(self):
        """ If a queen is completely surrounded the other player wins """
        white_lost = black_lost = False
        for hex, insects in self.hive.items():
            insect = insects[0]
            if isinstance(insect, Bee):
                if self.hive.hex_surrounded(hex):
                    if insect.team:
                        white_lost = True
                    else:
                        black_lost = True
        return 0 if white_lost and black_lost else 1 if white_lost else -1 if black_lost else None

    def is_game_over(self) -> bool:
        """ Check if the game is over """
        return not self.game_result is None

    def unique_droppable_insects(self):
        return set(self.availables())

    def generate_actions(self) -> Iterator[Move]:
        """ Generate all legal actions for the current state """
        if self.turn_number == 0:
            for insect in self.unique_droppable_insects():
                yield Drop(insect, Hex(0, 0))
        elif self.turn_number == 1:
            root = self.hive.get_root_hex()
            for hex in root.neighbors():
                for insect in self.unique_droppable_insects():
                    yield Drop(insect, hex)
        elif self.turn_number >= 6 and not self.bee_move:
            for drop_hex in self.hive.generate_drops(self.current_team):
                yield Drop("bee", drop_hex)
        else:
            for drop_hex in self.hive.generate_drops(self.current_team):
                for insect in self.unique_droppable_insects():
                    yield Drop(insect, drop_hex)
            if self.bee_move:
                for origin, destination in self.hive.generate_moves(self.current_team):
                    yield Move(origin, destination)


