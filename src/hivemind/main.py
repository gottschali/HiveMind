import logging

from state import *
from hex import Hex

logging.basicConfig(filename='test.log', filemode="w", format='%(filename)s: %(message)s',
                    level=logging.DEBUG)

logger = logging.getLogger()
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(levelname)s %(filename)s:  %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

logger.info('Starting logger')
d = Drop("bee", Hex(0, 0))
s = State()
n = s + d
m = n + Drop("ant", Hex(1, 0))
