import pygame
from constants import *
from utils import get_path
from libhex import *

"""
team True <-> White
team False <-> Black
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

    def move(self, hex, board):

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

    def available_moves(self, queen_move):
        if not queen_move[self.team]:
            return []
        pass

    def validate_move(self):
        if not queen_move[self.team]:
            return False
        return True


    def drop(self, hex, board, move_number):
        if self.validate_drop(hex, board, move_number):
            print("Valid Drop")
            self.new = False
            self.move(hex, board)
            return True
        print("Invalid Drop")
        return False

    def validate_drop(self, hex, board, move_number):
        if move_number == 0:
            print("Case first move")
            return True
        elif move_number == 1:
            print("Case second move")
            print(board)
            for n in hex.neighbors():
                print(n)
                try:
                    if board[n]:
                        return True
                except KeyError:
                    pass
            return False
        else:
            if hex in board.keys():
                print("Cannot drop on stones")
                return False
            print("Testing all neighbors for color")
            same_color = False
            for n in hex.neighbors():
                try:
                    if board[n][-1].team != self.team:
                        return False
                    else:
                        same_color = True
                except KeyError:
                    pass
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


class Queen(Runner):
    image = "bee"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def is_surrounded():
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
