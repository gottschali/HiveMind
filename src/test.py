import time

from hivemind.state import *
from hivemind.hive import *
from hivemind.hex import *

def fuzz(n):
    state = Root()
    for i in range(n):
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
