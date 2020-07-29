#!/usr/bin/python

import array
import math

import cairo
import pygame
import rsvg

WIDTH = 512
HEIGHT = 512

data = array.array('c', chr(0) * WIDTH * HEIGHT * 4)
surface = cairo.ImageSurface.create_for_data(
    data, cairo.FORMAT_ARGB32, WIDTH, HEIGHT, WIDTH * 4)

pygame.init()
window = pygame.display.set_mode((WIDTH, HEIGHT))
svg = rsvg.Handle(file="test.svg")
ctx = cairo.Context(surface)
svg.render_cairo(ctx)

screen = pygame.display.get_surface()
image = pygame.image.frombuffer(data.tostring(), (WIDTH, HEIGHT),"ARGB")
screen.blit(image, (0, 0))
pygame.display.flip()

clock = pygame.time.Clock()
while True:
    clock.tick(15)
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            raise SystemExit
