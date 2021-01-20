
from hivemind.state import *
from hivemind.hive import *
from hivemind.hex import *

root = Root()
print(root.unique_availables())
print(root.possible_actions)
state = root
while True:
    try:
        state = state.next_state()
    except Exception as e:
        print(state)
        print(state.possible_actions)
        raise e
