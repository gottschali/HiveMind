from flask import Flask, render_template
from flask_socketio import SocketIO, emit

import json
import random

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

app = Flask(__name__)
socketio = SocketIO(app)


@app.route("/")
def hello_world():
    return "Hello World!"


@app.route("/play")
def play():
    return render_template("index.html")

@socketio.on("connect")
def test_connect():
    print("IO: Connected")
    emit("my response", {"data": "Connected"})

@socketio.on("disconnect")
def test_disconnect():
    print("IO: Disconnected")
    emit("my response", {"data": "Disconnected"})

@socketio.on("test")
def test_move(message):
    print("Move requested from client")
    global state
    json_state = state_to_json(state)
    state = state + random.choice(list(state.generate_actions()))
    print(json_state)
    emit("testresponse", json_state)

state = State()

def state_to_json(state):
    dump = {}
    dump["hive"] = []
    index = 0
    for hex, stack in state.hive.items():
        for height, insect in enumerate(stack):
            # r, s, h, name, team
            dump["hive"].append({})
            dump["hive"][index]["q"] = hex.r
            dump["hive"][index]["r"] = hex.s
            dump["hive"][index]["height"] = height
            dump["hive"][index]["name"] = insect.name
            dump["hive"][index]["team"] = insect.team
            index += 1
    dump["availables"] = state._availables
    return json.dumps(dump)

if __name__ == '__main__':
    socketio.run(app)
