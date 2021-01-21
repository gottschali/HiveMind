from flask import Flask, render_template
from flask_socketio import SocketIO, emit

import json

from hivemind.state import *
from hivemind.hive import *
from hivemind.hex import *

app = Flask(__name__)
socketio = SocketIO(app)

# TODO: Do without starred imports
# TODO: standardize JSON de-/serialization
# TODO: Standardized naming for signals
# TODO: No gobal state
# TODO: send moveable pieces (one-hive) with state
# - state for each session
# In future threading/async

state = Root()
action_type = None
origin = None

@app.route("/")
def index():
    return render_template("index.html")

@socketio.on("connect")
def test_connect():
    print("Server Connected")
    emit("my response", {"data": "Connected"})

@socketio.on("disconnect")
def test_disconnect():
    print("Server Disconnected")
    emit("disconnect_ack", {"data": "Disconnected"})

@socketio.on("test")
def test_move(message):
    print("Move requested from client")
    global state
    state = state.next_state()
    json_state = state.to_json()
    print(json_state)
    emit("sendstate", json_state)

@socketio.on("auto_move")
def auto_move(message):
    print("AutoMove requested from client")
    global state
    for i in range(50):
        state = state.next_state()
        json_state = state.to_json()
        emit("sendstate", json_state)
        socketio.sleep(0.020)

@socketio.on("selecthex")
def select_hex(hex):
    global action_type
    global origin
    print(hex)
    hex = Hex(hex["data"]["q"], hex["data"]["r"])
    origin = hex
    action_type = Move
    print(hex)
    print(state.possible_actions)
    print("Server sending move options", hex)
    opts = []
    for action in state.possible_actions:
        # Currently only moves supporeted
        if isinstance(action, Move):
            if action.origin == hex:
                opts.append(action.destination)
    print(state.bee_move)
    print(opts)
    emit("moveoptions", json.dumps([{"q": h.q, "r": h.r, "h": state.hive.height(h) } for h in opts]))


@socketio.on("selectdrop")
def select_drop(payload):
    insect = Insect(int(payload["data"]))
    global action_type
    global origin
    print(insect)
    origin = insect
    action_type = Drop
    print(state.possible_actions)
    # opts = [a.destination for a in state.possible_actions if isinstance(a, Drop)]
    opts = list(state.hive.generate_drops(state.current_team))
    print("Server sending drop options",opts)
    emit("moveoptions", json.dumps([{"q": h.q, "r": h.r, "h": 0} for h in opts]))

@socketio.on("targethex")
def target_hex(hex):
    global state
    destination = Hex(hex["data"]["q"], hex["data"]["r"])
    print(destination)
    if action_type == Move:
        move = Move(origin, destination)
        print("Server making move", move)
        # TODO make that raise excpetion
        try:
            state = state + move
        except Exception as e:
            raise e
        json_state = state.to_json()
        emit("sendstate", json_state)
    if action_type == Drop:
        move = Drop(Stone(origin, state.current_team), destination)
        print("Server making move", move)
        # TODO make that raise excpetion
        print("Possible", state.possible_actions)
        print("move", move)
        try:
            state = state + move
        except Exception as e:
            raise e
        json_state = state.to_json()
        emit("sendstate", json_state)

    else:
        raise NotImplementedError



if __name__ == '__main__':
    socketio.run(app)
