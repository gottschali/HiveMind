import json
import logging

from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit

from brain.alphabeta import alphabeta
from hivemind.state import *
from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

app = Flask(__name__)
socketio = SocketIO(app)

logging.basicConfig(
    filename="app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s"
)

# TODO: standardize JSON de-/serialization
# TODO: send moveable pieces (one-hive) with state
# In future threading/async


@app.route("/")
@app.route("/index")
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


def emit_state(sid):
    json_state = games[sid].to_json()
    emit("sendstate", json_state)


@socketio.on("connect")
def connect_handler():
    # Create a new game
    print(f"{request.sid} connected")
    reset_handler()


@socketio.on("disconnect")
def disconnect_handler():
    # Delete the game
    del games[request.sid]
    print(f"{request.sid} disconnected")


@socketio.on("ai_action")
def ai_action_handler():
    state = games[request.sid]
    games[request.sid] = state.next_state()

    # action = alphabeta(state, depth=2)
    # games[request.sid] = state + action
    # node = MonteCarloTreeSearchNode(state)
    # search = MonteCarloTreeSearch(node)
    # r = search.best_action(100)
    # games[request.sid] = r.state
    emit_state(request.sid)


@socketio.on("auto_action")
def auto_action_handler():
    for i in range(50):
        games[request.sid] = games[request.sid].next_state()
        emit_state(request.sid)
        socketio.sleep(0.02)


@socketio.on("reset")
def reset_handler():
    games[request.sid] = State()
    json_state = State().to_json()
    emit("sendstate", json_state)


@socketio.on("action")
def action_handler(data):
    state = games[request.sid]
    print(f"Action: {data}")
    action_type = data["type"]
    first = data["first"]
    destination = Hex(data["destination"]["q"], data["destination"]["r"])
    if action_type == "move":
        origin = Hex(first["q"], first["r"])
        action = Move(origin, destination)
    elif action_type == "drop":
        insect = Insect(int(first))
        action = Drop(Stone(insect, state.current_team), destination)
    games[request.sid] = state + action
    emit_state(request.sid)
    return True


@socketio.on("options")
def options_handler(data):
    state = games[request.sid]
    print(f"Options: {data}")
    action_type = data["type"]
    first = data["first"]
    if action_type == "move":
        origin = Hex(first["q"], first["r"])
        opts = []
        for action in state.possible_actions:
            if isinstance(action, Move):
                if action.origin == origin:
                    opts.append(action.destination)
        return json.dumps(
            [{"q": h.q, "r": h.r, "h": state.hive.height(h)} for h in opts]
        )

    if action_type == "drop":
        insect = Insect(int(first))
        opts = [a.destination for a in state.possible_actions if isinstance(a, Drop)]
        # Reducible
        return json.dumps([{"q": h.q, "r": h.r, "h": 0} for h in opts])
    else:
        raise Exception(f"Invalid Actiontype {action_type}")


def main():
    socketio.run(app, debug=True)


if __name__ == "__main__":
    main()
