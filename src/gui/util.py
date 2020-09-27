import os
import pygame
from .constants import *

def load_image(file_name, image_directory='assets', size=STONE_SIZE):
    'Loads an image, file_name, from image_directory, for use in pygame'
    file = os.path.join(image_directory, file_name)
    _image = pygame.image.load(file)
    _image = _image.convert_alpha()
    _image = pygame.transform.scale(_image, size)
    return _image
