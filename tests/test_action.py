from hivemind.hex import Hex
from hivemind.insect import Insect, Stone, Team
from hivemind.state import Action, Drop, Move, Pass


def test_action():
    m1 = Move(Hex(1, 2), Hex(2, 3))
    d1 = Drop(Stone(Insect.BEE, Team.WHITE), Hex(2, 3))
    p1 = Pass()
    assert isinstance(m1, Action)
    assert isinstance(d1, Action)
    assert isinstance(p1, Action)


def test_eq():
    m1 = Move(Hex(1, 2), Hex(2, 3))
    d1 = Drop(Stone(Insect.BEE, Team.WHITE), Hex(2, 3))
    d2 = Drop(Stone(Insect.ANT, Team.WHITE), Hex(2, 3))
    assert m1 == Move(Hex(1, 2), Hex(2, 3))
    assert m1 != Move(Hex(2, 2), Hex(2, 3))
    assert d1 == Drop(Stone(Insect.BEE, Team.WHITE), Hex(2, 3))
    assert d1 != d2
    assert d1 != m1


def test_pass():
    m1 = Move(Hex(1, 2), Hex(2, 3))
    d1 = Drop(Stone(Insect.BEE, Team.WHITE), Hex(2, 3))
    assert Pass != m1
    assert Pass != d1
    assert Pass == Pass
