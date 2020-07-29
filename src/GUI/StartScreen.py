import pygame
from TextInput import InputBox
from Button import Button
from loadingSymbol import loadingSymbol
# from pathlib import Path
SCREEN_WIDTH = 1080
SCREEN_HEIGHT = 720
pygame.init()


bgImage = pygame.image.load('./src/GUI/bg.jpg')

def get_path(path):
    return str(Path(path).absolute())

screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
bgImage = pygame.transform.scale(bgImage, (SCREEN_WIDTH,SCREEN_HEIGHT))
Inbox_IP= InputBox(SCREEN_WIDTH//2-100,SCREEN_HEIGHT*0.2,200,70,bgText="IP-Addresse")
Inbox_Port=InputBox(SCREEN_WIDTH//2-100,SCREEN_HEIGHT*0.2+80,200,70,bgText="Port")

ListInputBoxes=[Inbox_IP,Inbox_Port]

EnterButton=Button(SCREEN_WIDTH//2-100,SCREEN_HEIGHT*0.2+160,200,70,text="ENTER")

ButtonList=[EnterButton]

LoadingSymbolBig=loadingSymbol((SCREEN_WIDTH//2,600),50)
LoadingSymbolSmall=loadingSymbol((SCREEN_WIDTH//2,600),30,speed=-0.01)

LoadingSymbols=[LoadingSymbolBig,LoadingSymbolSmall]
def DrawStartScreen(Screen,size):
    screen.blit(bgImage, bgImage.get_rect())
    for Inbox in ListInputBoxes:
        Inbox.draw(screen)
    for Button in ButtonList:
        Button.draw(screen)
    pass



while True:
    for event in pygame.event.get():
        if event.type==pygame.QUIT:
            pygame.quit()

        for Inbox in ListInputBoxes:
            Inbox.handle_event(event)
        for Button in ButtonList:
            Button.handle_event(event)
    DrawStartScreen(screen,(SCREEN_WIDTH, SCREEN_HEIGHT))
    for loadingSymbol in LoadingSymbols:
        loadingSymbol.draw(screen)
    pygame.display.update()