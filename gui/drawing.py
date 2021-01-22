from pygame.draw import aalines, polygon
from hivemind.hex import Hex
from .constants import *
from .drawhex import hex_to_pixel
from .util import load_image

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
            draw_hexagon(Surface, hex_to_pixel(Hex(x, y)))


def draw_state(state, surface):
    hive = state.hive
    for hex in hive:
        # Shift by constant factor
        i = hive.insect_at_hex(hex)
        name = i.name
        team = i.team

        key = "".join(("orange" if team else "black", "_", name, ".png"))

        img = load_image(key)
        rect = img.get_rect()
        # Shift the hex by constant factor
        rect.x, rect.y = list(hex_to_pixel(hex + Hex(10, 10), 3))
        rect.y -= RADIUS / 2 - 3
        surface.blit(img, rect)


def draw_queen(surface, hex):
    img = load_image("black_bee.png")
    rect = img.get_rect()
    # Shift the hex by constant factor
    rect.x, rect.y = list(hex_to_pixel(hex + Hex(10, 10), 3))
    rect.y -= RADIUS / 2 - 3
    surface.blit(img, rect)
