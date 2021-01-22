import logging
from collections import deque
from typing import Generator, Tuple, Set

from .hex import Hex
from .insect import Insect, Stone, Team

logger = logging.getLogger(__name__)

class Hive(dict):
    """
    Datastructure to store stones in a hive.
    There resides atleast one stone at every key, but they may be stacked.
    Example:
       Hive[Hex(0, 0)] = [Bee(True), Beetle(False)]
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __repr__(self):
        return f"Hive({super().__repr__()})"

    def at(self, hex: Hex) -> Stone:
        """ Returns the highest stone at hex """
        return self[hex][-1]

    def remove_stone(self, hex: Hex):
        """
        Removes the highest stone from the hive at hex
        If it was the only one the key gets deleted to preserve the invariant
        """
        self[hex].pop()
        if not len(self[hex]):
            del self[hex]

    def add_stone(self, hex: Hex, stone: Stone) -> None:
        if hex not in self:
            self[hex] = [stone]
        else:
            self[hex].append(stone)

    @property
    def game_result(self):
        """ If a Bee is completely surrounded the other player wins. A draw is also possible """
        white_lost = black_lost = False
        for hex, stack in self.values():
            stone = stack[0]
            if stone.insect == Insect.BEE:
                if len(self.neighbours(hex)) == 6:
                    if stone.team == Team.WHITE:
                        white_lost = True
                    else:
                        black_lost = True
        return 0 if white_lost and black_lost else 1 if white_lost else -1 if black_lost else None

    def neighbours(self, hex: Hex) -> Tuple[Hex, ...]:
        """ Yields all neighbouring hexes that are occupied """
        return tuple(neighbour for neighbour in hex.neighbours() if neighbour in self)

    def _get_root(self):
        return next(iter(self))

    def height(self, hex: Hex) -> int:
        return len(self[hex]) if hex in self else 0

    def generate_single_walks(self, hex: Hex, ignore=None) -> Generator[Hex, None, None]:
        """ Find neigboring hexes that can be reached in one move (only on the first level)"""
        for a, b, c in hex.circle_iterator():
            if b in self: # The destination is occupied
                continue
            # One of a and c must be occupied as the insect must keep contact to the hive
            # But not both otherwise it cannot pass -> XOR
            if ignore is None:
                if (a in self) ^ (c in self):
                    yield b
            else:
                # Ignore the origin of the walk such that it does act like it is not a part of the hive
                # Else it could use "itself" as a stepping stone
                if (a in self and a != ignore) ^ (c in self and c != ignore):
                    yield b

    def generate_walks(self, hex: Hex, target=None) -> Generator[Hex, None, None]:
        """
        Runs a BFS on the edge of the hive. Return all hexes that are reachable this way
        Target specifies the length of which walks are searched
        If it is omitted all walks are yielded
        """
        visited = set()
        distance = {}
        queue: Hex = deque()
        queue.append(hex)
        distance[hex] = 0
        visited.add(hex)
        while queue:
            vertex = queue.popleft()
            visited.add(vertex)
            if target is None:
                if vertex != hex:
                    yield vertex
            else:
                d = distance[vertex]
                if d > target:
                    continue
                if d == target:
                    yield vertex
            for neighbour in self.generate_single_walks(vertex, ignore=hex):
                if neighbour in visited:
                    continue
                distance[neighbour] = distance[vertex] + 1
                queue.append(neighbour)

    def generate_spider_walks(self, hex: Hex) -> Generator[Hex, None, None]:
        """ Finds hexes that can be reached in three steps """
        return self.generate_walks(hex, target=3)

    def generate_jumps(self, hex: Hex) -> Generator[Hex, None, None]:
        """ Yield all hexes that a grasshopper can jump to """
        for d in Hex.directions: # Consider all possible directions
            offset = Hex(*d)
            if hex + offset in self: # It must jump over atleast one insect
                i = 2
                while hex + offset * i in self: # continue until an empty hex is found
                    i += 1
                yield hex + offset * i

    def generate_climbs(self, hex: Hex) -> Generator[Hex, None, None]:
        # TODO Check the rulebook
        hh = self.height(hex)
        if hh > 1: # I. The insect is on elevated level
            for a, b, c in hex.circle_iterator():
                if self.height(b) < hh:
                    # Blocked if both sides have high larger equal to the own height
                    # II.1 The insect moves on the same level or jump down
                    if (self.height(a) < hh) or (self.height(c) < hh):
                        yield b
        else: # II. The insect is on the ground level, move normal there
            yield from self.generate_single_walks(hex)
        # III. Climbing up
        for a, b, c in hex.circle_iterator():
            ha = self.height(b)
            hb = self.height(b)
            hc = self.height(c)
            if self.height(b) >= hh and not (ha > hh and hc > hh):
                yield b

    def generate_drops(self, team: Team) -> Tuple[Hex, ...]:
        """ Finds hexes on which a stone of team could be dropped """
        def check_neigbour_team(hex: Hex) -> bool:
            """ Checks if all adjacent hexes of hex are uniquely of the same team """
            return all(self.at(neighbour).team == team for neighbour in self.neighbours(hex))
        candidates: Hex = set()
        for node in self:
            candidates.update(e for e in node.neighbours() if not e in self)
        drops = tuple(filter(check_neigbour_team, candidates))
        # The hive is empty -> every hex would be valid
        # wlog return only the Origin
        return drops if drops else (Hex(0, 0),)

    def _one_hive(self) -> Set[Hex]:
        """
        Finds articulation stones of the hive graph
        That are hexes that if removed would seperate the hive in at least 2 components
        Height is not accounted

        Computes the DFS tree, nodes numbered with counter
        A backlink is an edge that goes up in the DFS tree
        Lowlink keeps track of the lowest node that can be visited by going down the tree
        """
        lowlink = {}
        visited = set()
        index = {}
        articulation_points = set()
        def dfs(node, parent, counter):
            """ Performs a depth first search on node at depth counter """
            visited.add(node)
            counter += 1
            index[node] = counter
            lowlink[node] = counter
            children = 0
            for neighbour in self.neighbours(node):
                if neighbour == parent: # Prevent infinite loops
                    continue
                if neighbour in visited: # A backlink is found
                    lowlink[node] = min(lowlink[node], index[neighbour])
                else:
                    dfs(neighbour, node, counter) # Recurse the dfs on the child
                    # Backpropagate the lowest link
                    # An ancestor further down in the tree may have higher backlink
                    lowlink[node] = min(lowlink[node], lowlink[neighbour])
                    # +----v
                    # ^    |
                    # |    v
                    # ^----+
                    if lowlink[neighbour] >= index[node] and parent != None:
                        # If the neighbour has a backlink
                        # The node may be removed as it has at least another connection
                        # Else the node is the only link to the upper tree
                        # it is necessarily an articulation point
                        articulation_points.add(node)
                    children += 1 # A neighbour that is not visited is a new child
            if parent == None and children >= 2:
                # Root has no parent and is articulation point iff it has more than 1 children
                #      R
                #     / \
                #   ...  ...
                articulation_points.add(node)
        try:
            root = self._get_root()
            dfs(root, None, 0)
        except StopIteration:
            pass
        return articulation_points


    def _generate_moves_from(self, hex: Hex) -> Generator[Hex, None, None]:
        """ Generator that yield possible move destination hexes for the stone at hex """
        move_map = {
            Insect.BEE: self.generate_single_walks,
            Insect.SPIDER: self.generate_spider_walks,
            Insect.ANT: self.generate_walks,
            Insect.GRASSHOPPER: self.generate_jumps,
            Insect.BEETLE: self.generate_climbs,
        }
        yield from move_map[self.at(hex).insect](hex)

    def generate_moves(self, team: Team) -> Generator[Tuple[Hex, Hex], None, None]:
        """ Generator that yield pairs of origin, destination for moves for a team """
        articulation_points = self._one_hive()
        for hex in (hex for hex in self if self.at(hex).team == team):
            # The stone is not moveable if it violates the 'one hive' property
            if self.height(hex) == 1 and hex in articulation_points:
                continue
            for destination in self._generate_moves_from(hex):
                yield hex, destination
