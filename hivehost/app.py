import json
import logging
import uuid

from flask import Flask, render_template, request, session
from flask_socketio import SocketIO, emit, join_room

from room import Room
from brain.alphabeta import alphabeta
from hivemind.state import *
from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

app = Flask(__name__)
app.secret_key = uuid.uuid4().hex
app.config['SESSION_TYPE'] = 'filesystem'
socketio = SocketIO(app)

logging.basicConfig(
    filename="app.log", filemode="w", format="%(name)s - %(levelname)s - %(message)s"
)

# TODO: standardize JSON de-/serialization
# TODO: send moveable pieces (one-hive) with state
# In future threading/async

# TODO make enum
AI = 0
SELF = 1
MULTI = 2


# TODO create room logic

@app.route("/")
@app.route("/index")
def index():
    return render_template("index.html")


@app.route("/play")
def play():
    session["gid"] = request.args.get("gid")
    return render_template("play.html")


@app.route("/lobby")
def lobby():
    return render_template("lobby.html", rooms=rooms.values())

sessions = {}
rooms = {}

def create_room(name):
    gid = str(int(uuid.uuid1()))
    rooms[gid] = Room(gid, name, mode=MULTI)

create_room("test")
create_room("foo bar")

def emit_state(gid):
    json_state = rooms[gid].game.to_json()
    emit("sendstate", json_state, room=gid)


@socketio.on("connect")
def connect_handler():
    gid = session.get("gid")
    sessions[request.sid] = gid
    print(f"{gid} connected")
    join_room(gid)
    emit_state(gid)



@socketio.on("disconnect")
def disconnect_handler():
    gid = sessions[request.sid]
    room = rooms[gid]
    if room._connections == 1:
        del rooms[gid]
    print(f"{request.sid} disconnected")


@socketio.on("ai_action")
def ai_action_handler():
    gid = sessions[request.sid]
    state = rooms[gid].game
    rooms[gid].game = state.next_state()

    emit_state(gid)


# Debug only
@socketio.on("auto_action")
def auto_action_handler():
    gid = sessions[request.sid]
    for i in range(50):
        rooms[gid].game = rooms[gid].game.next_state()
        emit_state(gid)
        socketio.sleep(0.02)


@socketio.on("reset")
def reset_handler():
    gid = sessions[request.sid]
    rooms[gid].reset()
    emit_state(gid)


@socketio.on("action")
def action_handler(data):
    gid = sessions[request.sid]
    state = rooms[gid].game
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
    rooms[gid].game = state + action
    emit_state(gid)
    return True


@socketio.on("options")
def options_handler(data):
    gid = sessions[request.sid]
    state = rooms[gid].game
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
    socketio.run(app, host="0.0.0.0", debug=True)


if __name__ == "__main__":
    main()
