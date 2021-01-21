
from hivemind.state import *
from hivemind.hive import *
from hivemind.hex import *

root = Root()
print(root._unique_availables)
print(root.possible_actions)
state = root
i = 0
while True:
    try:
        state = state.next_state()
        i += 1
    except Exception as e:
        print(state)
        print(state.possible_actions)
        print("i: ", i)
        raise e
