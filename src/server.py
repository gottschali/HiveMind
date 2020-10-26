# WS server example

import asyncio
import websockets

import json
from random import choice

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *


def state_to_json(state):
    dump = {}
    dump['hive'] = []
    index = 0
    for hex, stack in state.hive.items():
        for height, insect in enumerate(stack):
            # r, s, h, name, team
            dump['hive'].append({})
            dump['hive'][index]['q'] = hex.r
            dump['hive'][index]['r'] = hex.s
            dump['hive'][index]['height'] = height
            dump['hive'][index]['name'] = insect.name
            dump['hive'][index]['team'] = insect.team
            index += 1
    dump['availables'] = state._availables
    # return json.dumps(dump)
    return dump

def next_state(state):
    return state + choice(list(state.generate_actions()))

state = State()
for i in range(10):
    state = next_state(state)
print(state)

async def hello(websocket, path):
    json_state = state_to_json(state)
    state = next_state(state)
    await websocket.send(json_state)

start_server = websockets.serve(hello, "localhost", 8766)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
