import pygame
from libhex import *
from constants import *
import drawing
from pathlib import Path

# TODO annoying path handling -> should work cross platform

pygame.init()

# WIDTH = int(SCREEN_WIDTH / (RADIUS * sqrt(3)))
# HEIGHT = int(SCREEN_HEIGHT / RADIUS / 2)

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))



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

stones = pygame.sprite.Group()

while True:
    # Mainloop
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            quit()
        if event.type == pygame.MOUSEBUTTONUP:
            pixel = pygame.mouse.get_pos()
            point = Point(pixel[0], pixel[1])
            print(f"Pixel: {pixel}")
            hex = Hex.from_pixel(point)
            print(f"Hex: {hex}")
            b = Block()

            #b.rect.x, b.rect.y = round_pixel(pixel)
            b.rect.x, b.rect.y = hex.to_pixel(3)

            stones.add(b)

    # Logic
    stones.update()

    screen.blit(playground, playground.get_rect())
    drawing.draw_grid(playground)

    # draw all sprites
    stones.draw(playground)

    # refresh
    pygame.display.update()
