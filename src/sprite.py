import pygame
import sprite
from constants import *
from utils import get_path
from libhex import *

"""
team True <-> White
team False <-> Black

TODO move_number maybe obsolote to pass because of self.team
TODO handle KeyError -> Custom dictionnary implementation
"""


class AbstractHiveStone(pygame.sprite.Sprite):

    image = "ant"

    def __init__(self, hex, team=True, new=True):
        # Call the parent class (Sprite) constructor
        pygame.sprite.Sprite.__init__(self)

        self.hex = hex
        self.team = team
        self.new = new

        self._load_image()
        self.update()

    def move(self, hex, board, queen_move):
        if self.validate_move(hex, board, queen_move):
            self.shift(hex, board)
            return True
        return False


    def shift(self, hex, board):
        # TODO abstract this
        board[self.hex].pop()
        if not len(board[self.hex]):
            del board[self.hex]

        self.hex = hex

        if hex not in board.keys():
            board[hex] = [ self ]
        else:
            board[hex].append(self)

        self.update()

    def update(self):
        self.rect.x, self.rect.y = self.hex.to_pixel(3)
        self.rect.y -= RADIUS / 2 - 3

    def generate_moves(self):
        pass

    def available_moves(self, board):
        pass

    def moveable(self, board, queen_move):
        if not queen_move[self.team]:
            print("cannot move as queen not dropped")
            return False

        # TODO One-Hive check

        return True

    def validate_move(self, hex, board, queen_move):
        if not self.moveable(board, queen_move):
            print("Stone not moveable")
            return False

        return hex in self.available_moves(board)


    def drop(self, hex, board, move_number, queen_move):
        if self.validate_drop(hex, board, move_number, queen_move):
            print("Valid Drop")
            self.new = False
            if isinstance(self, sprite.Queen):
                queen_move[move_number % 2] = True
            self.shift(hex, board)
            return True
        print("Invalid Drop")
        return False

    def validate_drop(self, hex, board, move_number, queen_move):
        if not queen_move[move_number % 2]:
            if not isinstance(self, sprite.Queen) and move_number >= 6:
                print("Need to drop queen at lastest as the fourth move")
                return False
        if move_number == 0:
            print("Case first move")
            return True
        elif move_number == 1:
            print("Case second move")
            print(board)
            for n in hex.neighbors():
                if n in board:
                    return True
            return False
        else:
            if hex in board.keys():
                print("Cannot drop on stones")
                return False
            print("Testing all neighbors for color")
            same_color = False
            for n in hex.neighbors():
                if n in board:
                    if board[n][-1].team != self.team:
                        return False
                    else:
                        same_color = True
            return same_color

    def _load_image(self):
        self.image = pygame.image.load(get_path(f"assets/{self.image}.png"))
        self.image = pygame.transform.scale(self.image, STONE_SIZE)
        # Fetch the rectangle object that has the dimensions of the image
        # Update the position of this object by setting the values of rect.x and rect.y
        self.rect = self.image.get_rect()

class Runner(AbstractHiveStone):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


    def available_moves(self, board):
        return self.swarming(board)

    def swarming(self, board):
        # Runs a DFS on the edge of the hive
        visited = set()
        ordering = []
        stack = []
        for a, b, c in self.hex.circle_iterator():
            if b in board:
                continue
            if (a in board) ^ (c in board):
                stack.append(b)
        while stack:
            v = stack[-1]
            stack.pop()
            ordering.append(v)
            visited.add(v)
            for a, b, c in v.circle_iterator():
                if (b in board) or (b in visited):
                    continue
                if (a in board) ^ (c in board):
                    stack.append(b)
        print(f"Swarming: {ordering}")
        return ordering


class Queen(Runner):
    image = "bee"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def is_surrounded():
        # TODO Game Over condition
        pass



class BlackQueen(Queen):
    image = "black_bee"

    def __init__(self, *args, **kwargs):
        super().__init__(team=False, *args, **kwargs)


class OrangeQueen(Queen):
    image = "orange_bee"

    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)

class Ant(Runner):
    image = "ant"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class BlackAnt(Ant):
    image = "black_ant"

    def __init__(self, *args, **kwargs):
        super().__init__(team=False, *args, **kwargs)

class OrangeAnt(Ant):
    image = "orange_ant"

    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)


class Spider(Runner):
    image = "spider"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class BlackSpider(Spider):
    image = "black_spider"

    def __init__(self, *args, **kwargs):
        super().__init__(team=False, *args, **kwargs)

class OrangeSpider(Spider):
    image = "orange_spider"

    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)

class Jumper(AbstractHiveStone):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class GrassHopper(Jumper):
    image = "grass_hopper"
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class BlackGrassHopper(GrassHopper):
    image = "black_grass_hopper"
    def __init__(self, *args, **kwargs):
        super().__init__(team=False, *args, **kwargs)


class OrangeGrassHopper(GrassHopper):
    image = "orange_grass_hopper"
    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)


class Climber(AbstractHiveStone):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class Beetle(Climber):
    pass

class BlackBeetle(Beetle):
    image = "black_beetle"
    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)

class OrangeBeetle(Beetle):
    image = "orange_beetle"
    def __init__(self, *args, **kwargs):
        super().__init__(team=True, *args, **kwargs)
