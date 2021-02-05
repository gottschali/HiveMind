from datetime import datetime

from hivemind.state import State


class Room:

    def __init__(self, gid, name, mode=2):
        self.gid = gid
        self.name = name
        self._time = datetime.now()
        self.time = self._time.strftime("%H:%M:%S")
        self._connections = 1
        self._mode = mode
        self.reset()

    def reset(self):
        self.game = State()
