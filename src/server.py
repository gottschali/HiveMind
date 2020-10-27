# WS server example

import asyncio
import websockets

import json
import random

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
    return json.dumps(dump)

def next_state(state):
    return state + random.choice(list(state.generate_actions()))

async def hello(websocket, path):
    state = State()
    while True:
        json_state = state_to_json(state)
        print(json_state)
        await websocket.send(json_state)
        await asyncio.sleep(.5)
        state = next_state(state)

start_server = websockets.serve(hello, "127.0.0.1", 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
