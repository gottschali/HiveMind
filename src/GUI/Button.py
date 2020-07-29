import pygame
pygame.init()
FONT = pygame.font.Font(None, 24)

def noAction(args):
    pass

def printArgs(args):
    print(args)

class Button:
    def __init__(self, x, y, w, h, text='',colorText=(0,0,0),colorActive=(0,100,0),colorPassive=(100,0,0),action=noAction,args=[]):
        self.rect = pygame.Rect(x, y, w, h)
        # self.color = COLOR_INACTIVE
        self.text=text
        self.txt_surface = FONT.render(text, True, colorText)
        self.active = False
        self.colorActive=colorActive
        self.colorPassive=colorPassive
        self.action=action
        self.args=args
        self.txt_rect=self.txt_surface.get_rect()

    
    def handle_event(self,event):
        if event.type==pygame.MOUSEBUTTONDOWN:
            if self.rect.collidepoint(event.pos):
                self.active= not self.active
                if self.active:
                    self.action(self.args)
        
    def draw(self,screen):
        if self.active:
            pygame.draw.rect(screen, self.colorActive, self.rect)
        else:
            pygame.draw.rect(screen, self.colorPassive, self.rect)

        screen.blit(self.txt_surface, (self.rect.x+self.rect.w // 2-self.txt_rect.w//2, self.rect.y+self.rect.h // 2-self.txt_rect.h//2))