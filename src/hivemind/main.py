import logging

from .state import *
from .hex import Hex

LEVEL = logging.DEBUG

logging.basicConfig(filename='test.log', filemode="w", format='%(filename)s: %(message)s',
                    level=logging.DEBUG)

logger = logging.getLogger()
console_handler = logging.StreamHandler()
console_handler.setLevel(LEVEL)
formatter = logging.Formatter('%(levelname)s %(filename)s:  %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

logger.info('Starting logger')
a = State()
b = a + Drop("bee", Hex(0, 0)) # 0
c = b + Drop("grasshopper", Hex(1, 0)) # 1
d = c + Drop('ant', Hex(-1, 0, 1)) # 0
e = d + Drop('bee', Hex(2, 1, -3))
print(list(e.generate_actions()))
