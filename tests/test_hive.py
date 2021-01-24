from hivemind.state import *


def test_remove_stone():
    hive = Hive({(1, 1): (1, 1)})


def drop_test(state, drops):
    return sorted(state.hive.generate_drops(state.current_team)) == sorted(drops)


def test_init_drop():
    assert drop_test(State(Hive({}), 0), ())


def test_second_drop():
    assert drop_test(State(Hive({}), 0), ())


def test_drop_3():
    assert drop_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                }
            ),
            2,
        ),
        (Hex(0, 1, -1), Hex(1, 0, -1), Hex(-1, 1, 0)),
    )


def test_drop_4():
    assert drop_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                }
            ),
            3,
        ),
        (Hex(0, -2, 2), Hex(1, -2, 1), Hex(-1, -1, 2)),
    )


def test_drop_5():
    assert drop_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                }
            ),
            4,
        ),
        (Hex(-1, 2, -1), Hex(1, 0, -1), Hex(-2, 1, 1), Hex(-2, 2, 0), Hex(0, 1, -1)),
    )


def test_drop_6():
    assert drop_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-2, 2, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, 3, -2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, 0, -1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                }
            ),
            9,
        ),
        (
            Hex(-2, -1, 3),
            Hex(-2, 4, -2),
            Hex(-1, 4, -3),
            Hex(1, -2, 1),
            Hex(0, 3, -3),
            Hex(-1, -2, 3),
            Hex(-2, 0, 2),
            Hex(0, -2, 2),
        ),
    )


def test_drop_7():
    assert drop_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, 3, -2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, 0, -1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(0, 3, -3): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(1, 3, -4): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-2, 4, -2): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(1, 1, -2): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                }
            ),
            13,
        ),
        (
            Hex(-3, 4, -1),
            Hex(-3, 5, -2),
            Hex(-2, -1, 3),
            Hex(-1, 4, -3),
            Hex(1, -2, 1),
            Hex(-2, 5, -3),
            Hex(-1, -2, 3),
            Hex(-2, 0, 2),
            Hex(0, -2, 2),
        ),
    )


def ant_test(state, dests, hex):
    return sorted(state.hive.generate_walks(hex)) == sorted(dests)


def test_ant_1():
    assert ant_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, 0, -1): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-2, 0, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                }
            ),
            6,
        ),
        (
            Hex(0, 1, -1),
            Hex(-1, 0, 1),
            Hex(1, 1, -2),
            Hex(-2, 1, 1),
            Hex(2, 0, -2),
            Hex(-3, 1, 2),
            Hex(2, -1, -1),
            Hex(-3, 0, 3),
            Hex(1, -1, 0),
            Hex(-2, -1, 3),
            Hex(1, -2, 1),
            Hex(-1, -2, 3),
            Hex(0, -2, 2),
            Hex(0, -2, 2),
        ),
        Hex(-1, 1),
    )


def test_ant_2():
    assert ant_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-2, -1, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-2, 2, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(0, -3, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, -2, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, -4, 4): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(2, -2, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                }
            ),
            13,
        ),
        (),
        Hex(0, -2, 2),
    )


def test_ant_3():
    assert ant_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-2, -1, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-2, 2, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(0, -3, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, -2, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, -4, 4): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(2, -2, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-3, 2, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(2, -3, 1): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                }
            ),
            16,
        ),
        (
            Hex(-3, 3, 0),
            Hex(-2, 1, 1),
            Hex(-2, 3, -1),
            Hex(-1, 0, 1),
            Hex(-1, 3, -2),
            Hex(-2, 0, 2),
            Hex(0, 2, -2),
            Hex(-3, 0, 3),
            Hex(0, 1, -1),
            Hex(-3, -1, 4),
            Hex(1, 0, -1),
            Hex(-2, -2, 4),
            Hex(1, -1, 0),
            Hex(-1, -2, 3),
            Hex(2, -1, -1),
            Hex(-1, -3, 4),
            Hex(3, -2, -1),
            Hex(-1, -4, 5),
            Hex(3, -3, 0),
            Hex(0, -5, 5),
            Hex(3, -4, 1),
            Hex(1, -5, 4),
            Hex(2, -4, 2),
            Hex(1, -4, 3),
            Hex(1, -3, 2),
            Hex(1, -3, 2),
        ),
        Hex(-3, 2, 1),
    )


def test_ant_4():
    assert ant_test(
        State(
            Hive(
                {
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, -1, 2): [
                        Stone(insect=Insect.ANT, team=Team.WHITE),
                        Stone(insect=Insect.BEETLE, team=Team.BLACK),
                    ],
                    Hex(-2, -1, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(0, -3, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, -2, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(2, -3, 1): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, 0, 1): [
                        Stone(insect=Insect.ANT, team=Team.BLACK),
                        Stone(insect=Insect.BEETLE, team=Team.WHITE),
                    ],
                    Hex(-3, 0, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(2, -4, 2): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(3, -5, 2): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(0, -4, 4): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(0, 2, -2): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-3, 4, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, 3, -1): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(-4, 1, 3): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                }
            ),
            66,
        ),
        (
            Hex(-3, 1, 2),
            Hex(-4, 0, 4),
            Hex(-3, 2, 1),
            Hex(-3, -1, 4),
            Hex(-2, 2, 0),
            Hex(-2, -2, 4),
            Hex(-3, 3, 0),
            Hex(-1, -3, 4),
            Hex(-4, 4, 0),
            Hex(-1, -4, 5),
            Hex(-4, 5, -1),
            Hex(0, -5, 5),
            Hex(-3, 5, -2),
            Hex(1, -5, 4),
            Hex(-2, 4, -2),
            Hex(1, -4, 3),
            Hex(-1, 3, -2),
            Hex(2, -5, 3),
            Hex(0, 3, -3),
            Hex(3, -6, 3),
            Hex(1, 2, -3),
            Hex(4, -6, 2),
            Hex(1, 1, -2),
            Hex(4, -5, 1),
            Hex(1, 0, -1),
            Hex(3, -4, 1),
            Hex(0, 0, 0),
            Hex(3, -3, 0),
            Hex(0, -1, 1),
            Hex(2, -2, 0),
            Hex(1, -1, 0),
            Hex(1, -1, 0),
        ),
        Hex(-4, 1, 3),
    )


def test_ant_5():
    assert ant_test(
        State(
            Hive(
                {
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, -1, 2): [
                        Stone(insect=Insect.ANT, team=Team.WHITE),
                        Stone(insect=Insect.BEETLE, team=Team.BLACK),
                    ],
                    Hex(-2, -1, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(0, -3, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, -2, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(2, -3, 1): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, 0, 1): [
                        Stone(insect=Insect.ANT, team=Team.BLACK),
                        Stone(insect=Insect.BEETLE, team=Team.WHITE),
                    ],
                    Hex(-3, 0, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(2, -4, 2): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(3, -5, 2): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(0, -4, 4): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(0, 2, -2): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-3, 4, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, 3, -1): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-3, 1, 2): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                }
            ),
            67,
        ),
        (
            Hex(-2, -2, 4),
            Hex(-1, -3, 4),
            Hex(-3, -1, 4),
            Hex(-1, -4, 5),
            Hex(-4, 0, 4),
            Hex(0, -5, 5),
            Hex(-4, 1, 3),
            Hex(1, -5, 4),
            Hex(-4, 2, 2),
            Hex(1, -4, 3),
            Hex(-3, 2, 1),
            Hex(2, -5, 3),
            Hex(-2, 2, 0),
            Hex(3, -6, 3),
            Hex(-3, 3, 0),
            Hex(4, -6, 2),
            Hex(-4, 4, 0),
            Hex(4, -5, 1),
            Hex(-4, 5, -1),
            Hex(3, -4, 1),
            Hex(-3, 5, -2),
            Hex(3, -3, 0),
            Hex(-2, 4, -2),
            Hex(2, -2, 0),
            Hex(-1, 3, -2),
            Hex(1, -1, 0),
            Hex(0, 3, -3),
            Hex(0, -1, 1),
            Hex(1, 2, -3),
            Hex(0, 0, 0),
            Hex(1, 1, -2),
            Hex(1, 0, -1),
            Hex(1, 0, -1),
        ),
        Hex(-1, -2, 3),
    )


def bee_test(state, dests, hex):
    return sorted(state.hive.generate_single_walks(hex)) == sorted(dests)


def test_bee_1():
    assert bee_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                }
            ),
            3,
        ),
        (Hex(1, -1, 0), Hex(-1, 0, 1)),
        Hex(0, -1, 1),
    )


def jump_test(state, dests, hex):
    return sorted(state.hive.generate_jumps(hex)) == sorted(dests)


def test_jump_1():
    assert jump_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                }
            ),
            10,
        ),
        (Hex(0, 1, -1),),
        Hex(-2, 1, 1),
    )


def test_jump_2():
    assert jump_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                }
            ),
            11,
        ),
        (Hex(1, 0, -1), Hex(-1, 0, 1)),
        Hex(1, -2, 1),
    )


def test_jump_3():
    assert jump_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-1, 0, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, 0, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                }
            ),
            13,
        ),
        (Hex(1, -2, 1), Hex(2, 0, -2), Hex(-1, 2, -1), Hex(-1, -3, 4)),
        Hex(-1, 0, 1),
    )


def test_jump_4():
    assert jump_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-1, -1, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(-1, 0, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(1, 0, -1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -3, 3): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(-1, 2, -1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-1, 3, -2): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, -2, 4): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(1, -4, 3): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(2, -5, 3): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(-2, 0, 2): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(-3, -2, 5): [
                        Stone(insect=Insect.ANT, team=Team.WHITE),
                        Stone(insect=Insect.BEETLE, team=Team.BLACK),
                    ],
                    Hex(0, -1, 1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(-3, 2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(2, -1, -1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                }
            ),
            63,
        ),
        (
            Hex(1, -2, 1),
            Hex(2, 0, -2),
            Hex(-1, 4, -3),
            Hex(-4, 3, 1),
            Hex(-3, 0, 3),
            Hex(-1, -3, 4),
        ),
        Hex(-1, 0, 1),
    )


def spider_test(state, dests, hex):
    return sorted(state.hive.generate_spider_walks(hex)) == sorted(dests)


def test_spider_1():
    assert spider_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(2, -2, 0): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(1, 1, -2): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(2, -3, 1): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                }
            ),
            10,
        ),
        (Hex(0, 2, -2), Hex(-1, -2, 3)),
        Hex(-2, 1, 1),
    )


def test_spider_2():
    assert spider_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, -1, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(2, -2, 0): [Stone(insect=Insect.BEE, team=Team.WHITE)],
                    Hex(1, 1, -2): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(0, -2, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(2, -3, 1): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                }
            ),
            11,
        ),
        (Hex(2, -1, -1), Hex(-1, -3, 4)),
        Hex(2, -3, 1),
    )


def test_spider_3():
    assert spider_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(2, -2, 0): [
                        Stone(insect=Insect.BEE, team=Team.WHITE),
                        Stone(insect=Insect.BEETLE, team=Team.WHITE),
                    ],
                    Hex(0, -2, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-2, 2, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(4, -3, -1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(0, 2, -2): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(5, -5, 0): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(-3, 2, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(3, -3, 0): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-4, 3, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-4, 4, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(5, -4, -1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, 3, -3): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, 3, -2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-1, 0, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                }
            ),
            69,
        ),
        (Hex(5, -3, -2), Hex(2, -3, 1)),
        Hex(5, -5, 0),
    )


def test_spider_4():
    assert spider_test(
        State(
            Hive(
                {
                    Hex(0, 0, 0): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(0, 1, -1): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(1, -2, 1): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, 1, 0): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(2, -2, 0): [
                        Stone(insect=Insect.BEE, team=Team.WHITE),
                        Stone(insect=Insect.BEETLE, team=Team.WHITE),
                    ],
                    Hex(0, -2, 2): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-1, -2, 3): [Stone(insect=Insect.SPIDER, team=Team.BLACK)],
                    Hex(-2, 2, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(4, -3, -1): [Stone(insect=Insect.BEETLE, team=Team.WHITE)],
                    Hex(0, 2, -2): [Stone(insect=Insect.GRASSHOPPER, team=Team.BLACK)],
                    Hex(5, -5, 0): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(-3, 2, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(3, -3, 0): [Stone(insect=Insect.SPIDER, team=Team.WHITE)],
                    Hex(1, -1, 0): [Stone(insect=Insect.GRASSHOPPER, team=Team.WHITE)],
                    Hex(-4, 3, 1): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                    Hex(-4, 4, 0): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-2, 1, 1): [Stone(insect=Insect.BEETLE, team=Team.BLACK)],
                    Hex(5, -4, -1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(0, 3, -3): [Stone(insect=Insect.BEE, team=Team.BLACK)],
                    Hex(-1, 0, 1): [Stone(insect=Insect.ANT, team=Team.BLACK)],
                    Hex(-2, 0, 2): [Stone(insect=Insect.ANT, team=Team.WHITE)],
                }
            ),
            70,
        ),
        (Hex(-3, 0, 3), Hex(2, -3, 1)),
        Hex(-1, -2, 3),
    )
