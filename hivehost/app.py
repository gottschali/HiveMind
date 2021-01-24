import logging
import json

from flask import Flask, render_template, session, request
from flask_socketio import SocketIO, emit

from hivemind.hex import *
from hivemind.hive import *
from hivemind.state import *

app = Flask(__name__)
socketio = SocketIO(app)

logging.basicConfig(filename='app.log', filemode='w', format='%(name)s - %(levelname)s - %(message)s')

# TODO: Do without starred imports
# TODO: standardize JSON de-/serialization
# TODO: Standardized naming for signals
# TODO: No gobal state
# TODO: send moveable pieces (one-hive) with state
# - state for each session
# In future threading/async

action_type = None
origin = None


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/play/self")
def play_self():
    return render_template("play.html")

@app.route("/play/ai")
def play_ai():
    return render_template("play.html")

@app.route("/play/online")
def play_online():
    return render_template("play.html")

games = {}

@socketio.on("connect")
def connect_handler():
    # Create a new game
    games[request.sid] = State()
    print(f"{request.sid} connected")
    return State().to_json()


@socketio.on("disconnect")
def disconnect_handler():
    # Delete the game
    del games[request.sid]
    print(f"{request.sid} disconnected")


@socketio.on("test")
def move(message):
    state = games[request.sid].next_state()
    games[request.sid] = state
    json_state = state.to_json()
    emit("sendstate", json_state)


@socketio.on("auto_move")
def auto_move(message):
    for i in range(50):
        move(message)
        socketio.sleep(0.020)


@socketio.on("reset")
def reset():
    games[request.sid] = State()
    json_state = State().to_json()
    emit("sendstate", json_state)


@socketio.on("selecthex")
def select_hex(hex):
    global action_type
    global origin
    hex = Hex(hex["data"]["q"], hex["data"]["r"])
    origin = hex
    action_type = Move
    opts = []
    state = games[request.sid]
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
    state = games[request.sid]
    insect = Insect(int(payload["data"]))
    global action_type
    global origin
    origin = insect
    action_type = Drop
    opts = [a.destination for a in state.possible_actions if isinstance(a, Drop)]
    emit("moveoptions", json.dumps([{"q": h.q, "r": h.r, "h": 0} for h in opts]))


@socketio.on("targethex")
def target_hex(hex):
    state = games[request.sid]
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
