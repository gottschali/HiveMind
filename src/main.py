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


# states: idle, selected
IDLE = "IDLE"
SELECTED = "SELECTED"
WAITING = "WAITING"

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
