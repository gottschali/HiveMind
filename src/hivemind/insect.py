class Insect:
    def __init__(self, name, team):
        self.name = name
        self.team = team


    def __repr__(self):
        return f"{type(self).__name__}({self.team})"

class Bee(Insect):
    name = "bee"
    def __init__(self, team):
        super().__init__(self.name, team)

class Spider(Insect):
    name = "spider"
    def __init__(self, team):
        super().__init__(self.name, team)

class Ant(Insect):
    name = "ant"
    def __init__(self, team):
        super().__init__(self.name, team)

class GrassHopper(Insect):
    name = "grasshopper"
    def __init__(self, team):
        super().__init__(self.name, team)

class Beetle(Insect):
    name = "beetle"
    def __init__(self, team):
        super().__init__(self.name, team)
