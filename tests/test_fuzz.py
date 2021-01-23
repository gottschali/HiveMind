from hivemind.state import State


def test_fuzz():
    for y in range(10):
        state = State()
        for i in range(100):
            state = state.next_state()
