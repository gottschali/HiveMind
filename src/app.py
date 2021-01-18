from flask import Flask, render_template
from flask_socketio import SocketIO, emit

import random

from hivemind.state import *
from hivemind.hive import *
from hivemind.insect import *
from hivemind.hex import *

app = Flask(__name__)
socketio = SocketIO(app)

# In future threading/async

state = State()

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
    state = next_state(state)
    json_state = state.to_json()
    print(json_state)
    emit("testresponse", json_state)

def next_state(state):
    return state + random.choice(list(state.generate_actions()))


if __name__ == '__main__':
    socketio.run(app)
