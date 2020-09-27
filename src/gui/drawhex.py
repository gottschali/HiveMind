import hivemind.hex
import collections
import math

Point = collections.namedtuple("Point", ["x", "y"])
OffsetCoord = collections.namedtuple("OffsetCoord", ["col", "row"])

EVEN = 1
ODD = -1

Orientation = collections.namedtuple(
    "Orientation", ["f0", "f1", "f2", "f3", "b0", "b1", "b2", "b3", "start_angle"]
)
orientation_pointy = Orientation(
    math.sqrt(3.0),
    math.sqrt(3.0) / 2.0,
    0.0,
    3.0 / 2.0,
    math.sqrt(3.0) / 3.0,
    -1.0 / 3.0,
    0.0,
    2.0 / 3.0,
    0.5,
)

orientation_flat = Orientation(
    3.0 / 2.0,
    0.0,
    math.sqrt(3.0) / 2.0,
    math.sqrt(3.0),
    2.0 / 3.0,
    0.0,
    -1.0 / 3.0,
    math.sqrt(3.0) / 3.0,
    0.0,
)

Layout = collections.namedtuple("Layout", ["orientation", "size", "origin"])
layout_pointy = Layout(orientation_pointy, Point(25, 25), Point(0, 0))

layout_flat = Layout(orientation_flat, Point(10, 10), Point(0, 0))

LAYOUT = layout_pointy



def hex_to_pixel(hex, corner=None, layout=LAYOUT):
    m = layout.orientation
    size = layout.size
    origin = layout.origin
    x = (m.f0 * hex.q + m.f1 * hex.r) * size.x
    y = (m.f2 * hex.q + m.f3 * hex.r) * size.y
    if not corner is None:
        dx, dy = hex_corner_offset(corner)
        return x + origin.x + dx, y + origin.y + dy
    return x + origin.x, y + origin.y


class NewHex(hivemind.hex.Hex):

    def __round__(self):
        qi = int(round(self.q))
        ri = int(round(self.r))
        si = int(round(self.s))
        q_diff = abs(qi - self.q)
        r_diff = abs(ri - self.r)
        s_diff = abs(si - self.s)
        if q_diff > r_diff and q_diff > s_diff:
            qi = -ri - si
        else:
            if r_diff > s_diff:
                ri = -qi - si
        return Hex(qi, ri)


    @classmethod
    def from_pixel(cls, p, layout=LAYOUT):
        M = layout.orientation
        size = layout.size
        origin = layout.origin
        pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y)
        q = M.b0 * pt.x + M.b1 * pt.y
        r = M.b2 * pt.x + M.b3 * pt.y
        return round(cls(q, r, -q - r))


    def polygon_corners(self, layout=LAYOUT):
        corners = []
        center = h.to_pixel(layout)
        for i in range(6):
            offset = hex_corner_offset(i, layout)
            corners.append(Point(center.x - offset.x, center.y - offset.y))
        return corners


def hex_corner_offset(corner, layout=LAYOUT):
    M = layout.orientation
    size = layout.size
    angle = 2.0 * math.pi * (M.start_angle - corner) / 6.0
    return Point(size.x * math.cos(angle), size.y * math.sin(angle))
