from flask import Flask, jsonify, request, render_template

from random import choice
import json

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

app = Flask(__name__)

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

@app.route('/state', methods=['GET', 'POST'])
def get_state():
    if request.method == 'POST': # POST request
        print('Incoming..')
        print(request.get_json())  # parse as JSON
        return 'OK', 200
    else: # GET request
        response = jsonify(state_to_json(state))
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

