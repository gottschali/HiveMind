import pygame
from Button import*
from TextInput import*

pygame.init()

screen = pygame.display.set_mode((600,600))

ButtonList=[]

playground = pygame.image.load(get_path("assets/background.jpg")).convert()

ButtonList.append(Button(50,50,100,50,text="hello World",action=printArgs,args=["hi","hive"]))
input_box1 = InputBox(100, 100, 140, 32)
input_box2 = InputBox(100, 300, 140, 32)
input_boxes = [input_box1, input_box2]
while True:
    for event in pygame.event.get():
        if event.type==pygame.QUIT:
            pygame.quit()

        for Button in ButtonList:
            Button.handle_event(event)

        for box in input_boxes:
            box.handle_event(event)

    for Button in ButtonList:
        Button.draw(screen)


    for box in input_boxes:
        box.draw(screen)
    pygame.display.update()