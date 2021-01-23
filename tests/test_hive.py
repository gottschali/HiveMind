from hivemind.state import *


def test_remove_stone():
    hive = Hive({(1, 1): (1, 1)})


# Drops


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
