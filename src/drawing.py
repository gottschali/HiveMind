from pygame.draw import aalines
from libhex import *
from constants import *

from math import sin, cos, tau

def draw_hexagon(Surface, position, radius=RADIUS):
    points = [(sin(i / 6 * tau) * radius + position[0], cos(i / 6 * tau) * radius + position[1]) for i in range(0, 6)]
    # Filled
    #pygame.draw.polygon(Surface, BLUE, points)
    # Only lines
    return aalines(Surface,
                             BLACK,
                             True,
                             points,
                            )

def draw_grid(Surface):
    for y in range(-HEIGHT, HEIGHT):
        for x in range(-WIDTH, WIDTH):
            draw_hexagon(Surface, Hex(x, y).to_pixel())

