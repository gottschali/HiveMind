import pygame
from libhex import *
from constants import *
from utils import get_path
import sprite
import drawing

# TODO annoying path handling -> should work cross platform

pygame.init()

# WIDTH = int(SCREEN_WIDTH / (RADIUS * sqrt(3)))
# HEIGHT = int(SCREEN_HEIGHT / RADIUS / 2)

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
playground = pygame.image.load(get_path("assets/background.jpg")).convert()

stones = pygame.sprite.Group()


<<<<<<< HEAD
# states: idle, selected
IDLE = "IDLE"
SELECTED = "SELECTED"
WAITING = "WAITING"
=======
size = (SCREEN_WIDTH, SCREEN_HEIGHT)

class Block(pygame.sprite.Sprite):

    # Constructor. Pass in the color of the block,
    # and its x and y position
    def __init__(self, color=ORANGE, width=RADIUS, height=RADIUS):
        # Call the parent class (Sprite) constructor
        pygame.sprite.Sprite.__init__(self)

        # Create an image of the block, and fill it with a color.
        # This could also be an image loaded from the disk.
        self.image = pygame.image.load(str(Path("src/assets/bee.png").absolute()))
        self.image = pygame.transform.scale(self.image, (40, 40))

        # Fetch the rectangle object that has the dimensions of the image
        # Update the position of this object by setting the values of rect.x and rect.y
        self.rect = self.image.get_rect()


playground = pygame.image.load(str(Path("src/assets/background.jpg").absolute())).convert()
>>>>>>> 7732189011473c798b4e5351566f33d4383c621c

state = IDLE
move_number = 0
selected_stone = None
board = {}

while True:
    # Mainloop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
        # TODO new stones
        if event.type == pygame.MOUSEBUTTONUP:
            pixel = pygame.mouse.get_pos()
            hex = Hex.from_pixel(Point(pixel[0], pixel[1]))
            if state == SELECTED: # Drop a stone
                b = sprite.Queen(hex)
                stones.add(b)
            else: # Select a stone
                pass

    # Logic
    stones.update()

    screen.blit(playground, playground.get_rect())
    drawing.draw_grid(playground)

    # draw all sprites
    stones.draw(playground)

    # refresh
    pygame.display.update()

    #Testcomment
