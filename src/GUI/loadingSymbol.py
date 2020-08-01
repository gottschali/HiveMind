import pygame
import math

class loadingSymbol:
    def __init__(self,pos,size,speed=0.01,color=(0,0,0)):
        self.pos=pos
        self.size=size
        self.speed=speed
        self.color=color
        self.t=0

    def draw(self,screen):
        self.t+=1
        points=[]
        for i in range(6):
            points.append([
                self.pos[0]+self.size*math.cos(self.speed*self.t+math.pi/3*i),
                self.pos[1]+self.size*math.sin(self.speed*self.t+math.pi/3*i)
            ])
        pygame.draw.polygon(screen,(100,0,0),points,3)