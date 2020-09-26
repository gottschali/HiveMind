import pygame
import sprite
from collections import deque
from constants import *
from libhex import *
from utils import get_path
from one_hive import one_hive

"""
team True <-> White
team False <-> Black

    def move(self, hex, board, queen_move) -> bool:
        if self.validate_move(hex, board, queen_move):
            self._shift(hex, board)
            return True
        return False

    def _shift(self, hex, board) -> None:
        # CRITICAL
        board[self.hex].pop()
        if not len(board[self.hex]):
            del board[self.hex]
        self.hex = hex
        if hex not in board.keys():
            board[hex] = [self]
        else:
            board[hex].append(self)
        self._update()


    def drop(self, hex, board, move_number, queen_move) -> bool:
        if self.validate_drop(hex, board, move_number, queen_move):
            print("Valid Drop")
            self.new = False
            if isinstance(self, sprite.Queen):
                queen_move[self.team] = True
            self._shift(hex, board)
            return True
        print("Invalid Drop")
        return False

"""

class AbstractInsect:

    def __init__(self, team=True) -> None:
        self.team = team


    def available_moves(self, board):
        """ Returns a list of Hexes of available moves """
        raise NotImplemented


    @abstractmethod
    def pre_moveable(hex, state) -> bool:
        """
        Checks if the stone is moveable
        Which is the case when
            i.  The player has dropped his queen
            ii. The insect is not covered by another one
            iii.The One-Hive rule is not violated
        """
        if not state.queen_move[self.team]:
            return False
        if board[self.hex][-1] != self:
            return False
        return not self.hex in one_hive(board)

    def validate_move(self, hex, state) -> bool:
        """ Checks if a move is legal """
        if not self.pre_moveable(hex, state):
            return False
        return hex in self.available_moves(board)


    def validate_drop(self, hex, state) -> bool:
        """
        Check if adding a stone to the board is legal:
        it may not be adjacent to stones of the enemy and must touch
        atleast one friendly stone.
        (the highest counts if they are stacked)
        The queen must be dropped in the first four moves
        """
        # Only dropping on free hexes is allowed
        if hex in state.board.keys():
            return False
        if not state.queen_move[self.team]:
            if not isinstance(self, sprite.Queen) and state.move_number >= 6:
                return False
        if state.move_number == 0:
            # Any hex is valid
            return True
        elif state.move_number == 1:
            # Only adjacent hexes to the first are valid
            for n in hex.neighbors():
                if n in state.board:
                    return True
            return False
        else:
            # Check all neighbors for the color
            same_color = False
            for n in hex.neighbors():
                if n in state.board:
                    if state.board[n][-1].team != self.team:
                        return False
                    else:
                        same_color = True
            return same_color


class Runner(AbstractHiveStone):

    """
    Provides utility methods for insects that move on the border of the
    hive.
    """

    def available_moves(self, board):
        return self.swarming(hex, board)


    def one_step(self, board) -> list:
        for a, b, c in self.hex.circle_iterator():
            if b in board:
                continue
            if (a in board) ^ (c in board):
                yield b


    def swarming(self, hex, board, filter=None) -> list:
        """
        Runs a DFS on the edge of the hive. Return all hexes that are
        reachable this way
        """
        # Otherwise the stone uses itself to move along
        old = board[hex]
        del board[hex]
        visited = set()
        ordering = []
        parent = {}
        distance = {}
        q = deque()
        q.append(hex)
        parent[hex] = None
        distance[hex] = 0
        visited.add(hex)
        while q:
            v = q.popleft()
            ordering.append(v)
            for a, b, c in v.circle_iterator():
                if (b in board) or (b in visited):
                    continue
                if (a in board) ^ (c in board):
                    visited.add(b)
                    parent[b] = v
                    distance[b] = distance[v] + 1
                    q.append(b)
        for i in ordering:
            print(f"{i}: {distance[i]}, (<- {parent[i]})")
        # restore the stone
        board[hex] = old
        if not filter is None:
            return filter(distance)
        return iter(ordering)



class Queen(Runner):
    """ May only move one hex per turn """

    def is_surrounded(self, board) -> bool:
        """ Game Over condition """
        return all(n in board for n in self.hex.neighbors())


    def available_moves(self, hex, board):
        return self.one_step(board)



class Ant(Runner):
    """ May move as many hexes as it wants """
    pass


class Spider(Runner):
    """ May move exactly three hexes """

    def available_moves(self, hex, board):
        def only_three_hexes(distance):
            for h, d in distance.items():
                if d == 3:
                    yield h
        return self.swarming(hex, board, only_three_hexes)


class GrassHopper(AbstractHiveStone):
    """ Unique piece that jumps over others """

    def available_moves(self, hex, board):
        for d in hex_directions:
            if hex + d in board:
                i = 2
                while hex + d * i in board:
                    i += 1
                yield hex + d * i



class Climber(AbstractHiveStone):
    """ Abstract class for insects that may move on top of others """
    pass


class Beetle(Climber):
    """ May move one hex but can also move up and downwards """

    def available_moves(self, hex, board):
        # TODO Broken
        height = len(board[hex])
        for i, (a, b, c) in enumerate(hex.circle_iterator()):
            ha = hb = hc = 0
            for x, y in zip((ha, hb, hc), (a, b, c)):
                if y in board:
                    x = len(board[y])
                # 1. Upwards / downwards
                # When hb != h
                # Not possible if ha >= h and hb >= h
                # 2. on same niveau
                # else
                # Not possible if ha >= h and hb >= h aka blocked
                # a xor c occupied
                if not (ha >= height and hc >= height):
                    if hb != height:
                        if b in board or ((a in board) ^ (c in board)):
                            yield b
                    elif (a in board) ^ (c in board):
                        yield b

