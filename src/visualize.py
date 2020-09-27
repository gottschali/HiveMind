import pygame
import time

from gui.constants import *
import gui.drawing as drawing
import gui.util as util
from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

# Conventions
# True <-> Orange <-> 1
# False <-> Black <-> 0

# Usually pygame.init() is used. This inititalizes also other modules
# as for audio and fonts which are at the moment not used yet.
pygame.display.init()

# Set the game to run at 30 ticks per second to limit CPU usage
clock = pygame.time.Clock()
clock.tick(30)
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
playground = util.load_image("background.jpg", size=SIZE)
# playground = pygame.image.load("assets/background.jpg").convert()

# state = State(Hive({Hex(0, 0, 0): [GrassHopper(0)], Hex(0, -1, 1): [GrassHopper(1)]}), [False, False], 2, [['bee', 'spider', 'spider', 'ant', 'ant', 'ant', 'grasshopper', 'grasshopper', 'beetle', 'beetle'], ['bee', 'spider', 'spider', 'ant', 'ant', 'ant', 'grasshopper', 'grasshopper', 'beetle', 'beetle']])
root = State()
node = MonteCarloTreeSearchNode(root)
search = MonteCarloTreeSearch(node)
state = root



while True:
    print(state)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
    drawing.draw_grid(playground)
    screen.blit(playground, playground.get_rect())
    drawing.draw_state(state, screen)
    pygame.display.update()

    node = search.best_action(10)
    state = node.state
    search = MonteCarloTreeSearch(node)
