import time
from tqdm import trange
import logging

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

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
a = Root()
b = a + Drop(Stone(Insect.BEE, Team.BLACK), Hex(0, 0)) # 0
logger.debug(b.possible_actions)
c = b + Drop(Stone(Insect.ANT, Team.WHITE), Hex(0, -1)) # 1
d = c + Drop(Stone(Insect.SPIDER, Team.BLACK), Hex(1, 0)) # 0
e = d + Drop(Stone(Insect.GRASSHOPPER, Team.WHITE), Hex(0, -2))
logger.debug(e.possible_actions)

console_handler.setLevel(logging.WARNING)
def fuzz(n):
    state = Root()
    for i in trange(n):
        try:
            state = state.next_state()
            i += 1
        except Exception as e:
            print(state)
            print(state.possible_actions)
            print("i: ", i)
            raise e

n = 1000
k = 3
total = 0
for i in range(k):
    start = time.perf_counter()
    fuzz(n)
    elapsed = time.perf_counter() - start
    total += elapsed
    print(f"Took {elapsed:.3f} seconds")
print("#" * 50)
avg = total / k
print(f"Average time {avg:.3f} seconds")
print(f"Single iteration avg {avg / n * 1e3 :.3f} milli seconds")
