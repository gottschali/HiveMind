import json

from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from hivemind.hex import *
from hivemind.hive import *
from hivemind.state import *

app = Flask(__name__)
socketio = SocketIO(app)

# TODO: Do without starred imports
# TODO: standardize JSON de-/serialization
# TODO: Standardized naming for signals
# TODO: No gobal state
# TODO: send moveable pieces (one-hive) with state
# - state for each session
# In future threading/async

state = State()
action_type = None
origin = None


@app.route("/")
def index():
    return render_template("index.html")


@socketio.on("connect")
def test_connect():
    emit("my response", {"data": "Connected"})


@socketio.on("disconnect")
def test_disconnect():
    emit("disconnect_ack", {"data": "Disconnected"})


@socketio.on("test")
def test_move(message):
    global state
    state = state.next_state()
    json_state = state.to_json()
    emit("sendstate", json_state)


@socketio.on("auto_move")
def auto_move(message):
    global state
    for i in range(50):
        state = state.next_state()
        json_state = state.to_json()
        emit("sendstate", json_state)
        socketio.sleep(0.020)


@socketio.on("reset")
def auto_move():
    global state
    state = State()
    json_state = state.to_json()
    emit("sendstate", json_state)


@socketio.on("selecthex")
def select_hex(hex):
    global action_type
    global origin
    hex = Hex(hex["data"]["q"], hex["data"]["r"])
    origin = hex
    action_type = Move
    opts = []
    for action in state.possible_actions:
        # Currently only moves supporeted
        if isinstance(action, Move):
            if action.origin == hex:
                opts.append(action.destination)
    emit(
        "moveoptions",
        json.dumps([{"q": h.q, "r": h.r, "h": state.hive.height(h)} for h in opts]),
    )


@socketio.on("selectdrop")
def select_drop(payload):
    insect = Insect(int(payload["data"]))
    global action_type
    global origin
    origin = insect
    action_type = Drop
    opts = [a.destination for a in state.possible_actions if isinstance(a, Drop)]
    emit("moveoptions", json.dumps([{"q": h.q, "r": h.r, "h": 0} for h in opts]))


@socketio.on("targethex")
def target_hex(hex):
    global state
    destination = Hex(hex["data"]["q"], hex["data"]["r"])
    if action_type == Move:
        move = Move(origin, destination)
        # TODO make that raise excpetion
        try:
            state = state + move
        except Exception as e:
            raise e
        json_state = state.to_json()
        emit("sendstate", json_state)
    if action_type == Drop:
        move = Drop(Stone(origin, state.current_team), destination)
        # TODO make that raise excpetion
        try:
            state = state + move
        except Exception as e:
            raise e
        json_state = state.to_json()
        emit("sendstate", json_state)

    else:
        print("No move-type specified")


def main():
    socketio.run(app)


if __name__ == "__main__":
    main()
