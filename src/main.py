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

# stones = pygame.sprite.Group()

# states: idle, selected
IDLE = "IDLE"
SELECTED = "SELECTED"
WAITING = "WAITING"

size = (SCREEN_WIDTH, SCREEN_HEIGHT)

state = IDLE
move_number = 0
selected_stone = None
board = {}

stones = [sprite.Queen(Hex(2, 8), team=True, new=True),
              sprite.Ant(Hex(2, 9), team=True, new=True),
              sprite.Ant(Hex(2, 10), team=True, new=True),
              sprite.Ant(Hex(2, 11), team=True, new=True),
              sprite.Spider(Hex(2, 12), team=True, new=True),
              sprite.Spider(Hex(2, 13), team=True, new=True),
              sprite.GrassHopper(Hex(2, 14), team=True, new=True),
              sprite.GrassHopper(Hex(2, 15), team=True, new=True),
              sprite.Beetle(Hex(2, 16), team=True, new=True),
              sprite.Beetle(Hex(2, 17), team=True, new=True),]

for stone in stones:
    board[stone.hex] = stone

while True:
    # Mainloop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
        # TODO new stones
        if event.type == pygame.MOUSEBUTTONUP:
            print(stones)
            print(state)
            print(board)
            pixel = pygame.mouse.get_pos()
            hex = Hex.from_pixel(Point(pixel[0], pixel[1]))
            print(hex)
            if state == IDLE:
                if hex in board.keys(): # select
                    state = SELECTED
                    selected_stone = board[hex]
            elif state == SELECTED:
                old_hex = selected_stone.hex
                selected_stone.move(hex)
                board[hex] = selected_stone
                del board[old_hex]
                state = "IDLE"
                # LEGIT MOVE -> make
                # NOT LEGIT -> error
                # PLAIN HEX -> clear selection
                pass


    screen.blit(playground, playground.get_rect())
    drawing.draw_grid(playground)
    # Logic
    # stones.update()
    for sprite in stones:
        sprite.update()
        screen.blit(sprite.image, sprite.rect)

    # refresh
    pygame.display.flip()

    #Testcomment
