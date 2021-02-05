import uuid
from datetime import datetime


class Room:

    def __init__(self, name, mode=2):
        self.name = name
        self.gid = str(int(uuid.uuid1()))
        self._time = datetime.now()
        self.time = self._time.strftime("%H:%M:%S")
        self._connections = 1
        self._mode = mode
