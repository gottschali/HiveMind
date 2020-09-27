class Action:
    pass

class Move(Action):
    def __init__(self, origin, destination):
        self.origin = origin
        self.destination = destination

    def __repr__(self):
        return f"Move({self.origin}, {self.destination})"

class Drop(Action):
    def __init__(self, insect, destination):
        self.insect = insect
        self.destination = destination

    def __repr__(self):
        return f"Drop('{self.insect}', {self.destination})"
