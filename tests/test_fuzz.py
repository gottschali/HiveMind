from hivemind.state import State


def test_fuzz():
    """ Check that always computing the next state does not raise errors """
    for y in range(5):
        state = State()
        for i in range(50):
            state = state.next_state()
