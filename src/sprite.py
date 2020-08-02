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
"""

class AbstractHiveStone(pygame.sprite.Sprite):


    def __init__(self, hex, team=True, new=True) -> None:
        super().__init__()

        self.hex = hex
        self.team = team
        self.new = new

        self._load_image()
        self._update()


    def move(self, hex, board, queen_move) -> bool:
        """ Applies a move if it is legal """
        if self.validate_move(hex, board, queen_move):
            self._shift(hex, board)
            return True
        return False


    def _shift(self, hex, board) -> None:
        """ Updates the references in the board data structure """
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


    def _update(self) -> None:
        """ Update the position on the screen """
        self.rect.x, self.rect.y = self.hex.to_pixel(3)
        # CRITICAL
        self.rect.y -= RADIUS / 2 - 3


    def available_moves(self, board):
        """ Returns a list of Hexes of available moves """
        raise NotImplemented


    def moveable(self, board, queen_move) -> bool:
        """
        Checks if the stone is moveable
        Which is the case when
            i.  The player has dropped his queen
            ii. The One-Hive rule is not violated
        """
        if not queen_move[self.team]:
            print("cannot move as queen not dropped")
            return False
        return not self.hex in one_hive(board)


    def validate_move(self, hex, board, queen_move) -> bool:
        """ Checks if a move is legal """
        if not self.moveable(board, queen_move):
            print("Stone not moveable")
            return False
        return hex in self.available_moves(board)


    def drop(self, hex, board, move_number, queen_move) -> bool:
        """ Add a new stone to the board if it is legal """
        if self.validate_drop(hex, board, move_number, queen_move):
            print("Valid Drop")
            self.new = False
            if isinstance(self, sprite.Queen):
                queen_move[self.team] = True
            self._shift(hex, board)
            return True
        print("Invalid Drop")
        return False


    def validate_drop(self, hex, board, move_number, queen_move) -> bool:
        """
        Check if adding a stone to the board is legal:
        it may not be adjacent to stones of the enemy and must touch
        atleast one friendly stone.
        (the highest counts if they are stacked)
        The queen must be dropped in the first four moves
        """
        # Only dropping on free hexes is allowed
        if hex in board.keys():
            print("Cannot drop on stones")
            return False
        if not queen_move[self.team]:
            if not isinstance(self, sprite.Queen) and move_number >= 6:
                print("Need to drop queen at lastest as the fourth move")
                return False
        if move_number == 0:
            # Any hex is valid
            print("Case first move")
            return True
        elif move_number == 1:
            # Only adjacent hexes to the first are valid
            print("Case second move")
            print(board)
            for n in hex.neighbors():
                if n in board:
                    return True
            return False
        else:
            # Check all neighbors for the color
            print("Testing all neighbors for color")
            same_color = False
            for n in hex.neighbors():
                if n in board:
                    if board[n][-1].team != self.team:
                        return False
                    else:
                        same_color = True
            return same_color


    def _load_image(self) -> None:
        """ Loads and converts the image for the right team """
        self.image = pygame.image.load(get_path(f"assets/{self.image}.png"))
        self.image = pygame.transform.scale(self.image, STONE_SIZE)
        # Fetch the rectangle object that has the dimensions of the image
        # Update the position of this object by setting the values of rect.x and rect.y
        self.rect = self.image.get_rect()



class Runner(AbstractHiveStone):

    """
    Provides utility methods for insects that move on the border of the
    hive.
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


    def available_moves(self, board):
        return self.swarming(board)


    def one_step(self, board) -> list:
        for a, b, c in self.hex.circle_iterator():
            if b in board:
                continue
            if (a in board) ^ (c in board):
                yield b


    def swarming(self, board, filter=None) -> list:
        """
        Runs a DFS on the edge of the hive. Return all hexes that are
        reachable this way
        """
        # Otherwise the stone uses itself to move along
        old = board[self.hex]
        del board[self.hex]
        visited = set()
        ordering = []
        parent = {}
        distance = {}
        q = deque()
        q.append(self.hex)
        parent[self.hex] = None
        distance[self.hex] = 0
        visited.add(self.hex)
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
        board[self.hex] = old
        if not filter is None:
            return filter(distance)
        return iter(ordering)



class Queen(Runner):
    """ May only move one hex per turn """

    def __init__(self, hex, team, *args, **kwargs):
        self.image = "orange_bee" if team else "black_bee"
        super().__init__(hex, team, *args, **kwargs)


    def is_surrounded(self, board) -> bool:
        """ Game Over condition """
        return all(n in board for n in self.hex.neighbors())


    def available_moves(self, board):
        return self.one_step(board)



class Ant(Runner):
    """ May move as many hexes as it wants """

    def __init__(self, hex, team, *args, **kwargs):
        self.image = "orange_ant" if team else "black_ant"
        super().__init__(hex, team, *args, **kwargs)



class Spider(Runner):
    """ May move exactly three hexes """

    def __init__(self, hex, team, *args, **kwargs):
        self.image = "orange_spider" if team else "black_spider"
        super().__init__(hex, team, *args, **kwargs)


    def available_moves(self, board):
        def only_three_hexes(distance):
            for h, d in distance.items():
                if d == 3:
                    yield h
        return self.swarming(board, only_three_hexes)



class GrassHopper(AbstractHiveStone):
    """ Unique piece that jumps over others """

    def __init__(self, hex, team, *args, **kwargs):
        self.image = "orange_grass_hopper" if team else "black_grass_hopper"
        super().__init__(hex, team, *args, **kwargs)


    def available_moves(self, board):
        for d in hex_directions:
            if self.hex + d in board:
                i = 2
                while self.hex + d * i in board:
                    i += 1
                yield self.hex + d * i



class Climber(AbstractHiveStone):
    """ Abstract class for insects that may move on top of others """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)



class Beetle(Climber):
    """ May move one hex but can also move up and downwards """

    def __init__(self, hex, team, *args, **kwargs):
        self.image = "orange_beetle" if team else "black_beetle"
        super().__init__(hex, team, *args, **kwargs)


    def available_moves(self, board):
        height = len(board[self.hex])
        for i, (a, b, c) in enumerate(self.hex.circle_iterator()):
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

