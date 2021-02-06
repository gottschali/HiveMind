import json
import logging
import uuid

from flask import Flask, flash, redirect, render_template, request, session
from flask_socketio import SocketIO, emit, join_room
from forms import LoginForm
from hivemind.state import *
from room import Room

from brain.alphabeta import alphabeta
from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

app = Flask(__name__)
app.secret_key = uuid.uuid4().hex
app.config["SESSION_TYPE"] = "filesystem"
socketio = SocketIO(app)

app.sessions = {}
app.rooms = {}


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


@app.route("/")
@app.route("/index")
def index():
    gid = str(int(uuid.uuid1()))
    return render_template("index.html", gid=gid)


@app.route("/play")
def play():
    session["gid"] = request.args.get("gid")
    return render_template("play.html")


def create_room(name):
    gid = str(int(uuid.uuid1()))
    app.rooms[gid] = Room(gid, name, mode=MULTI)
    return gid


# Debug Rooms
create_room("Test Room")


@app.route("/lobby", methods=["GET", "POST"])
def lobby():
    form = LoginForm()
    if form.validate_on_submit():
        roomname = form.roomname.data
        gid = create_room(roomname)
        flash(f"Room {roomname} created")
        return redirect(f"/play?gid={gid}&m={MULTI}")
    return render_template("lobby.html", rooms=app.rooms.values(), form=form)


def emit_state(gid):
    json_state = app.rooms[gid].game.to_json()
    emit("sendstate", json_state, room=gid)


@socketio.on("connect")
def connect_handler():
    gid = session.get("gid")
    app.sessions[request.sid] = gid
    print(f"{gid} connected")
    join_room(gid)
    emit_state(gid)


@socketio.on("disconnect")
def disconnect_handler():
    gid = app.sessions[request.sid]
    room = app.rooms[gid]
    if room._connections == 1:
        del app.rooms[gid]
    print(f"{request.sid} disconnected")


@socketio.on("ai_action")
def ai_action_handler():
    gid = app.sessions[request.sid]
    state = app.rooms[gid].game
    app.rooms[gid].game = state.next_state()

    emit_state(gid)


# Debug only
@socketio.on("auto_action")
def auto_action_handler():
    gid = app.sessions[request.sid]
    for i in range(50):
        app.rooms[gid].game = app.rooms[gid].game.next_state()
        emit_state(gid)
        socketio.sleep(0.02)


@socketio.on("reset")
def reset_handler():
    gid = app.sessions[request.sid]
    app.rooms[gid].reset()
    emit_state(gid)


@socketio.on("action")
def action_handler(data):
    gid = app.sessions[request.sid]
    room = app.rooms[gid]
    state = app.rooms[gid].game
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
    app.rooms[gid].game = state + action
    emit_state(gid)
    if room._mode == AI:
        ai_action_handler()
    return True


@socketio.on("options")
def options_handler(data):
    gid = app.sessions[request.sid]
    state = app.rooms[gid].game
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
