from hivemind.hex import Hex


def test_default_hex():
    assert Hex() == Hex(0, 0)


def test_equality():
    assert Hex(2, 3) != Hex(2, 2)
    assert Hex(2, 2) == Hex(2, 2)


def test_repr():
    assert eval(str(Hex(2, 2))) == Hex(2, 2)


def test_addition():
    assert Hex(-5, 2) + Hex(1, 7) == Hex(-4, 9)


def test_neighbours():
    for n in Hex(0, 0).neighbours():
        assert n.adjacent(Hex(0, 0))


def test_circle_iterator():
    for x, y, z in Hex().circle_iterator():
        assert x.adjacent(y) is True
        assert y.adjacent(z) is True


def test_adjacent():
    h = Hex(-5, 2)
    assert h.adjacent(Hex(-5, 3)) is True
    assert h.adjacent(Hex(-5, 2)) is False
    assert h.adjacent(Hex(-5, 4)) is False
