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
queen_move = [False, False]
selected_stone = None
board = {}


stones = [sprite.OrangeQueen(Hex(2, 8), new=True),
              sprite.OrangeAnt(Hex(2, 9),  new=True),
              sprite.OrangeAnt(Hex(2, 10), new=True),
              sprite.OrangeAnt(Hex(2, 11),  new=True),
              sprite.OrangeSpider(Hex(2, 12),  new=True),
              sprite.OrangeSpider(Hex(2, 13),  new=True),
              sprite.OrangeGrassHopper(Hex(2, 14),  new=True),
              sprite.OrangeGrassHopper(Hex(2, 15),  new=True),
              sprite.OrangeBeetle(Hex(2, 16),  new=True),
              sprite.OrangeBeetle(Hex(2, 17),  new=True),

              sprite.BlackQueen(Hex(0, 8),  new=True),
              sprite.BlackAnt(Hex(0, 9), new=True),
              sprite.BlackAnt(Hex(0, 10), new=True),
              sprite.BlackAnt(Hex(0, 11), new=True),
              sprite.BlackSpider(Hex(0, 12),  new=True),
              sprite.BlackSpider(Hex(0, 13),  new=True),
              sprite.BlackGrassHopper(Hex(0, 14),  new=True),
              sprite.BlackGrassHopper(Hex(0, 15),  new=True),
              sprite.BlackBeetle(Hex(0, 16),  new=True),
              sprite.BlackBeetle(Hex(0, 17),  new=True),]

for stone in stones:
    board[stone.hex] = [stone]

while True:
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
            if state == IDLE:
                if hex in board.keys(): # select
                    if move_number % 2 == board[hex][-1].team:
                        print(f"selected {board[hex]}")
                        state = SELECTED
                        selected_stone = board[hex][-1]
                    else:
                        print("Wrong color")
            elif state == SELECTED:
                old_hex = selected_stone.hex

                # A new stone is added to the game
                if selected_stone.new:
                    if selected_stone.drop(hex, board, move_number, queen_move):
                        state = IDLE
                        move_number += 1
                    continue

                selected_stone.move(hex, board)
                state = IDLE
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
