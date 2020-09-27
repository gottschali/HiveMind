import pygame
import time
from random import choice
import logging

from gui.constants import *
import gui.drawing as drawing
import gui.util as util

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

LEVEL = logging.DEBUG

logging.basicConfig(filename='test.log', filemode="w", format='%(filename)s: %(message)s',
                    level=logging.DEBUG)

logger = logging.getLogger()
console_handler = logging.StreamHandler()
console_handler.setLevel(LEVEL)
formatter = logging.Formatter('%(levelname)s %(filename)s:  %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)
pygame.display.init()
# Set the game to run at 30 ticks per second to limit CPU usage
clock = pygame.time.Clock()
clock.tick(30)
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
playground = util.load_image("background.jpg", size=SIZE)
# playground = pygame.image.load("assets/background.jpg").convert()

state = State()

def next_state(state):
    return state + choice(list(state.generate_actions()))


while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
    drawing.draw_grid(playground)
    screen.blit(playground, playground.get_rect())
    drawing.draw_state(state, screen)

    #for n in state.articulation_points:
        #drawing.draw_queen(screen, n)

    pygame.display.update()

    time.sleep(1)

    state = next_state(state)

