import pygame
from libhex import *
from constants import *
from utils import get_path
from sprite import Queen, Ant, Spider, Beetle, GrassHopper
import drawing

# TODO annoying path handling -> should work cross platform

pygame.display.init()

clock = pygame.time.Clock()
clock.tick(30)
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
playground = pygame.image.load(get_path("assets/background.jpg")).convert()

# states: idle, selected
IDLE = "IDLE"
SELECTED = "SELECTED"
WAITING = "WAITING"

size = (SCREEN_WIDTH, SCREEN_HEIGHT)

state = IDLE
move_number = 0
queen_move = [False, False]
selected_stone = None
board = {}

play_stones = [Queen, Ant, Ant, Ant, Spider, Spider,
               GrassHopper, GrassHopper, Beetle, Beetle]

black_spare_hexes = [Hex(2, 8 + i) for i in range(len(play_stones))]
orange_spare_hexes = [Hex(0, 8 + i) for i in range(len(play_stones))]

black_stones = [cls(h, True, new=True) for cls, h in zip(play_stones,
    orange_spare_hexes)]

orange_stones = [cls(h, False, new=True) for cls, h in zip(play_stones,
    black_spare_hexes)]

stones = black_stones + orange_stones


for stone in stones:
    board[stone.hex] = [stone]

drawing.draw_grid(playground)

def game_over(board):
    for stones in board.values():
        for stone in stones:
            if isinstance(stone, Queen):
                if not stone.new and stone.is_surrounded(board):
                    if stone.team:
                        print("Orange wins")
                        return 1
                    print("Black wins")
                    return -1

while not game_over(board):
    # Mainloop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
        if event.type == pygame.MOUSEBUTTONUP:
            print(stones)
            print(state)
            print(board)
            pixel = pygame.mouse.get_pos()
            hex = Hex.from_pixel(Point(pixel[0], pixel[1]))
            print(hex)

            if hex in board.keys(): # select
                if move_number % 2 == board[hex][-1].team:
                    print(f"selected {board[hex]}")
                    state = SELECTED
                    selected_stone = board[hex][-1]

            elif state == SELECTED:

                # A new stone is added to the game
                if selected_stone.new:
                    if selected_stone.drop(hex, board, move_number, queen_move):
                        state = IDLE
                        move_number += 1
                    continue

                # Try to make a move

                if selected_stone.move(hex, board, queen_move):
                    # Move succesfull
                    move_number += 1
                    state = IDLE


    screen.blit(playground, playground.get_rect())
    for sprite in stones:
        sprite.update()
        screen.blit(sprite.image, sprite.rect)

    # refresh
    pygame.display.update()
