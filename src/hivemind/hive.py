from collections import deque
from hex import Hex
import math

# TODO use new Hive.neighbors for dfs..
# TODO avoid usign [hex][-1] -> abstract into function
# TODO Utility to iterate only over the highest insects at each index

class Hive(dict):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def remove_insect(self, hex):
        self[hex].pop()
        if not len(self[hex]):
            del self[hex]


    def hex_surrounded(self, hex) -> bool:
        """ Game Over condition """
        return all(n in self for n in hex.neighbors())


    def neighbors(self, hex):
        return (neighbor for neighbor in hex.neighbors() if neighbor in self)

    def neighbor_team(self, hex, team):
        return all(n.team == team for n in self.neighbors(hex))


    def one_hive(self):
        lowlink = {}
        visited = {}
        index = {}
        counter = 0
        articulation_points = []
        def dfs(node, parent, counter):
            visited[node] = True
            counter += 1
            index[node] = counter
            lowlink[node] = counter
            children = 0
            for neighbor in node.neighbors():
                if neighbor == parent or not neighbor in self:
                    continue
                if neighbor in visited:
                    lowlink[node] = min(lowlink[node], lowlink[neighbor])
                else:
                    children += 1
                    dfs(neighbor, node, counter)
                    lowlink[node] = min(lowlink[node], lowlink[neighbor])
                if lowlink[neighbor] >= index[node]:
                    articulation_points.append(node)
            if parent == NoneHex and children > 1:
                # Root is an articulation point
                articulation_points.append(node)
        root = next(iter(self))
        NoneHex = Hex(math.nan, math.nan)
        dfs(root, NoneHex, counter)
        return articulation_points

    def generate_walks_from_hex(self, hex):
        for a, b, c in hex.circle_iterator():
            if b in self:
                continue
            if (a in self) ^ (c in self):
                yield b

    def generate_any_walks_from_hex(self, hex, func=None):
        """
        Runs a DFS on the edge of the hive. Return all hexes that are
        reachable this way
        """
        # BFS vs DFS ?
        # Remove the insect temporarily, otherwise the insect uses itself to move along
        old = self[hex]
        del self[hex]
        visited = set()
        ordering = []
        parent = {}
        distance = {}
        q = deque()
        q.append(hex)
        parent[hex] = None
        distance[hex] = 0
        visited.add(hex)
        while q:
            v = q.popleft()
            ordering.append(v)
            for a, b, c in v.circle_iterator():
                if (b in self) or (b in visited):
                    continue
                if (a in self) ^ (c in self):
                    visited.add(b)
                    parent[b] = v
                    distance[b] = distance[v] + 1
                    q.append(b)
        # restore the stone
        self[hex] = old
        if not func is None:
            return list(filter(func, ordering))
        return ordering

    def generate_spider_walks_from_hex(self, hex):
        return self.generate_any_walks_from_hex(hex, lambda hex, distance: distance == 3)


    def generate_jumps_from_hex(self, hex):
        for d in Hex.directions:
            offset = Hex(*d)
            if hex + offset in self:
                i = 2
                while hex + (offset * i) in self:
                    i += 1
                yield hex + offset * i

    def generate_climbs_from_hex(self, hex):
        # TODO Broken
        height = len(self[hex])
        for i, (a, b, c) in enumerate(hex.circle_iterator()):
            ha = hb = hc = 0
            for x, y in zip((ha, hb, hc), (a, b, c)):
                if y in self:
                    x = len(self[y])
                # 1. Upwards / downwards
                # When hb != h
                # Not possible if ha >= h and hb >= h
                # 2. on same niveau
                # else
                # Not possible if ha >= h and hb >= h aka blocked
                # a xor c occupied
                if not (ha >= height and hc >= height):
                    if hb != height:
                        if b in self or ((a in self) ^ (c in self)):
                            yield b
                    elif (a in self) ^ (c in self):
                        yield b


    def generate_moves_for_insect(self, insect_name, hex):
        # GrassHopper -> Jump
        # Beetle -> Onestep + Climp
        if insect_name == "bee":
            yield from self.generate_walks_from_hex(hex)
        elif insect_name == "spider":
            yield from self.generate_spider_walks_from_hex(hex)
        elif insect_name == "ant":
            yield from self.generate_any_walks_from_hex(hex)
        elif insect_name == "grasshopper":
            yield from self.generate_jumps_from_hex(hex)
        elif insect_name == "beetle":
            yield from self.generate_climbs_from_hex(hex)
        else:
            raise Exception("Unknown insect")

    def generate_drops(self, team):
        empty_hexes = set()
        def dfs(node, parent):
            visited[node] = True
            for neighbor in node.neighbors():
                if neighbor == parent:
                    continue
                if neighbor not in self:
                    empty_hexes.add(neighbor)
                else:
                    dfs(neighbor, node)
        root = next(iter(self))
        dfs(root, NoneHex)
        # Not the most efficient solution though
        return filter(lambda hex: self.neighbor_team(hex, team), empty_hexes)
