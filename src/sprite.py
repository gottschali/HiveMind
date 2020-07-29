import pygame
from constants import *
from utils import get_path
from libhex import *


class AbstractHiveStone(pygame.sprite.Sprite):

    image = "ant"

    def __init__(self, hex, team=True, new=True):
        # Call the parent class (Sprite) constructor
        pygame.sprite.Sprite.__init__(self)

        self.team = team
        self.hex = hex

        self._load_image()
        self.move(hex)

    def move(self, hex):
        self.hex = hex
        self.update()

    def update(self):
        self.rect.x, self.rect.y = self.hex.to_pixel(3)

    def generate_moves(self):
        pass

    def available_moves(self):
        pass

    def validate_move(self):
        return True

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

class Ant(Runner):
    image = "ant"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class Spider(Runner):
    image = "spider"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class Jumper(AbstractHiveStone):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class GrassHopper(Jumper):
    image = "grass_hopper"
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)


class Climber(AbstractHiveStone):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

class Beetle(Climber):
    image = "beetle"
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
