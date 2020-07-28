import pygame
pygame.init()
FONT = pygame.font.Font(None, 24)

def noAction(args):
    pass

def printArgs(args):
    print(args)

class Button:
    def __init__(self, x, y, w, h, text='',colorActive=(0,100,0),colorPassive=(100,0,0),action=noAction,args=[]):
        self.rect = pygame.Rect(x, y, w, h)
        self.color = COLOR_INACTIVE
        self.text=text
        self.txt_surface = FONT.render(text, True, colorActive)
        self.active = False
        self.colorActive=colorActive
        self.colorPassive=colorPassive
        self.action=action
        self.args=args
    
    def handle_event(self,event):
        if event.type==pygame.MOUSEBUTTONDOWN:
            if self.rect.collidepoint(event.pos):
                self.active= not self.active
                if self.active:
                    self.action(self.args)
        
    def draw(self,screen):
        if self.active:
            pygame.draw.rect(screen, self.colorActive, self.rect, 2)
        else:
            pygame.draw.rect(screen, self.colorPassive, self.rect, 2)

        screen.blit(self.txt_surface, (self.rect.x+5, self.rect.y+5))