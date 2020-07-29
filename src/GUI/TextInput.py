import pygame as pg


pg.init()
screen = pg.display.set_mode((640, 480))
COLOR_INACTIVE = pg.Color('lightskyblue3')
COLOR_ACTIVE = pg.Color('dodgerblue2')
FONT = pg.font.Font(None, 24)


class InputBox:

    def __init__(self, x, y, w, h, bgText='',text='',done=False,change=True):
        self.rect = pg.Rect(x, y, w, h)
        self.color = COLOR_INACTIVE
        self.bgText=bgText
        self.text = text
        self.txt_surface = FONT.render(bgText, True, self.color)
        self.active = False
        self.done=done
        self.change=change

    def handle_event(self, event):
        if event.type == pg.MOUSEBUTTONDOWN:
            # If the user clicked on the input_box rect.
            if self.rect.collidepoint(event.pos):
                # Toggle the active variable.
                self.active = not self.active
                if self.active:
                    if self.change:
                        self.txt_surface = FONT.render(self.text, True, self.color)
                    self.text=''
                else:
                    if self.change:
                        self.txt_surface = FONT.render(self.bgText, True, self.color)
            else:
                self.active = False
                if self.change:
                    self.text=''
            # Change the current color of the input box.
            self.color = COLOR_ACTIVE if self.active else COLOR_INACTIVE
        if event.type == pg.KEYDOWN:
            if self.active:
                
                if event.key == pg.K_RETURN:
                
                    self.done=True
            
                elif event.key == pg.K_BACKSPACE:
                    self.text = self.text[:-1]
                else:
                    self.text += event.unicode
                # Re-render the text.
                self.txt_surface = FONT.render(self.text, True, self.color)

    def draw(self, screen):
        # Blit the text.
        screen.blit(self.txt_surface, (self.rect.x+5, self.rect.y+5))
        # Blit the rect.
        pg.draw.rect(screen, self.color, self.rect, 2)

