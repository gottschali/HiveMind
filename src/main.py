import pygame
from libhex import *
from constants import *
from utils import get_path
from sprite import Queen, Ant, Spider, Beetle, GrassHopper
import drawing
from state import Board

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
playground = pygame.image.load(get_path("assets/background.jpg")).convert()

IDLE = "IDLE" # The player can make an action but has not yet done so
SELECTED = "SELECTED" # When a stone is selected for movement or dropping
WAITING = "WAITING" # The player can do nothin

state = IDLE # The state of the player

move_number = 0 # Increases by one after every action
# Turns True if a player has dropped his queen and may move his stones
queen_move = [False, False]
selected_stone = None

play_stones = [Queen, Ant, Ant, Ant, Spider, Spider,
               GrassHopper, GrassHopper, Beetle, Beetle]
black_stones = [cls(h, True, new=True) for cls, h in
        zip(play_stones, [Hex(0, 8 + i) for i in range(len(play_stones))])]
orange_stones = [cls(h, False, new=True) for cls, h in
        zip(play_stones, [Hex(2, 8 + i) for i in range(len(play_stones))])]
stones = black_stones + orange_stones

# Initialize the board. It is a hashmap with hexes as keys and
# list of stones as values
board = Board()
board.add_stones(stones)

# The grid has to be drawn only once
drawing.draw_grid(playground)

while board.is_game_over() is None:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
        if event.type == pygame.MOUSEBUTTONUP:
            print(stones)
            print(state)
            print(list(board.get_legal_actions()))
            pixel = pygame.mouse.get_pos()
            hex = Hex.from_pixel(Point(pixel[0], pixel[1]))
            print(hex)
            if state == WAITING:
                continue
            if state == SELECTED:
                # A new stone is added to the game
                update = False
                if selected_stone.new:
                    if selected_stone.drop(hex, board.board, move_number, queen_move):
                        update = True
                # Try to move an existing stone
                else:
                    if selected_stone.move(hex, board.board, queen_move):
                        # Move succesfull
                        update = True
                if update:
                    move_number += 1
                state = IDLE
            elif state == IDLE:
                if hex in board.board.keys(): # Try to select a stone
                    # Check if the selected stone belongs to the player
                    if move_number % 2 == board.board[hex][-1].team:
                        print(f"selected {board.board[hex]}")
                        state = SELECTED
                        selected_stone = board.board[hex][-1]

    screen.blit(playground, playground.get_rect())
    # sort the stones according to their height
    # otherwise a stone that lies under them would be drawn over them
    stones.sort(key=lambda x: len(board.board[x.hex]))
    # Update the positions of
    for sprite in stones:
        sprite.update()
        screen.blit(sprite.image, sprite.rect)

    # refresh
    pygame.display.update()
