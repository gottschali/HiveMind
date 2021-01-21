import math
import logging
from copy import deepcopy
from collections import deque
from typing import Iterator, List, Tuple

from .hex import Hex
from .insect import Insect, Stone, Team

logger = logging.getLogger(__name__)

class Hive(dict):
    """
    Datastructure for the relationship between the insects in a hive.
    There resides atleast one insect at every key, but they may be staked.
    As keys Hex are used.
    Example:
       Hive[Hex(0, 0)] = [Bee(True), Beetle(False)]
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def __repr__(self):
        return f"Hive({super().__repr__()})"

    def stone_at_hex(self, hex: Hex) -> Stone:
        return self[hex][-1]

    def get_root_hex(self):
        # TODO self may be empty
        return next(iter(self))

    def remove_stone(self, hex: Hex):
        """
        Removes the highest insect from the hive at hex.
        If it was the only one the key gets deleted.
        """
        self[hex].pop()
        if not len(self[hex]):
            del self[hex]

    def get_hex_and_stones_of_team(self, team: Team) -> Iterator[Tuple[Hex, Stone]]:
        for hex, stack in self.items():
            stone = self.stone_at_hex(hex)
            if stone.team == team:
                yield hex, stone

    def add_stone(self, hex: Hex, stone: Stone) -> None:
        if hex not in self:
            self[hex] = [stone]
        else:
            self[hex].append(stone)

    def hex_surrounded(self, hex: Hex) -> bool:
        """ Tests if all surrounding hexes of hex are occupied """
        return all(n in self for n in hex.neighbors())

    def neighbors(self, hex: Hex) -> Iterator[Hex]:
        """ Yields all neighboring hexes that are occupied """
        return (neighbor for neighbor in hex.neighbors() if neighbor in self)

    def highest_neighbor_stones(self, hex: Hex) -> Iterator[Stone]:
        """ Yields the highest adjacent insects """
        for n in self.neighbors(hex):
            yield self[n][-1]

    def neighbor_team(self, hex: Hex, team: Team) -> bool:
        """ Checks if all adjacent hexes of hex are uniquely of the same team """
        logger.debug(list(self.stone_at_hex(neighbor).team for neighbor in self.neighbors(hex)))
        return all(self.stone_at_hex(neighbor).team == team for neighbor in self.neighbors(hex))

    def one_hive(self) -> List[Hex]:
        """
        Finds articulation points of hive-graph
        These are insects that if removed would seperate the hive into atleast two components.
        """
        lowlink = {}
        visited = set()
        index = {}
        counter = 0
        articulation_points = set()
        def dfs(node, parent, counter):
            """ Performs a depth first search on node at depth counter """
            visited.add(node)
            counter += 1
            index[node] = counter
            lowlink[node] = counter
            children = 0
            for neighbor in self.neighbors(node):
                if neighbor == parent: # That's where we cam from
                    continue
                if neighbor in visited: # A backlink is found
                    lowlink[node] = min(lowlink[node], index[neighbor])
                else:
                    dfs(neighbor, node, counter) # Recurse the dfs on the child
                    lowlink[node] = min(lowlink[node], lowlink[neighbor])
                    # Backpropagate the lowest link
                    #     |
                    #     n: 1
                    #   /  .: 2 -> 1
                    #  /   .: ... -> 1
                    #  node: 1
                    if lowlink[neighbor] >= index[node] and parent != None:
                        # If the neighbor has a backlink the node must not be an articulation point as
                        # it has atleast another connection
                        # But if the node is the lowest link it the only link to the upper tree
                        # it is necessarily an articulation point
                        #            k  ..
                        #          /    |
                        #         |    v
                        #          \   |
                        #           \ n
                        articulation_points.add(node)
                    children += 1 # A neighbor that is not visited is a new child
            if parent == None and children >= 2:
                # Root has no parent and is articulation point if it has more than 1 children
                #      R     Removal of R would remove the link between the subtrees
                #     / \
                #   ...  ...
                articulation_points.add(node)
        try:
            root = self.get_root_hex()
            dfs(root, None, counter)
        except StopIteration:
            pass
        return articulation_points

    def height(self, hex: Hex) -> int:
        return len(self[hex]) if hex in self else 0

    def generate_walks_from_hex(self, hex: Hex) -> Iterator[Hex]:
        """ Find neigboring hexes that can be reached in one move (only on the first level)"""
        for a, b, c in hex.circle_iterator():
            if self.height(b): # The destination is occupied
                continue
            # One of a and c must be occupied as the insect must keep contact to the hive
            # But not both otherwise it cannot pass -> XOR
            if (self.height(a)) ^ (self.height(c)):
                yield b

    def generate_any_walks_from_hex(self, hex: Hex, func=None) -> List[Hex]:
        """
        Runs a BFS on the edge of the hive. Return all hexes that are reachable this way
        Func can be a unary function that filters out distances
        """
        # Otherwise dict keys get changed
        # VERY UGLY
        new = deepcopy(self)
        # Remove the insect temporarily, otherwise the insect uses itself to move along
        tmp = new[hex]
        del new[hex]
        visited = set()
        parent = {}
        distance = {}
        queue = deque()
        queue.append(hex)
        parent[hex] = None
        distance[hex] = 0
        visited.add(hex)
        while queue:
            vertex = queue.popleft()
            visited.add(vertex)
            for neighbor in new.generate_walks_from_hex(vertex):
                if neighbor in visited:
                    continue
                parent[neighbor] = vertex
                distance[neighbor] = distance[vertex] + 1
                queue.append(neighbor)
        logger.debug(f"The calculated distance map is {distance}")
        if not (func is None):
            for h, d in distance.items():
                if func(d):
                    yield h
        else:
            visited.discard(hex)
            yield from visited

    def generate_spider_walks_from_hex(self, hex: Hex) -> List[Hex]:
        """ Finds hexes that can be reached in three steps """
        return self.generate_any_walks_from_hex(hex, lambda x: x == 3)

    def generate_jumps_from_hex(self, hex: Hex) -> Iterator[Hex]:
        """ Yield all hexes that a grasshopper can jump to """
        for d in Hex.directions: # Consider all possible directions
            offset = Hex(*d)
            if hex + offset in self: # It must jump over atleast one insect
                i = 2
                while hex + offset * i in self: # continue until an empty hex is found
                    i += 1
                yield hex + offset * i

    def generate_climbs_from_hex(self, hex: Hex) -> Iterator[Hex]:
        # TODO Verify correctness
        hh = self.height(hex)
        if hh > 1: # I. The insect is on elevated level
            for a, b, c in hex.circle_iterator():
                if self.height(b) < hh:
                    # Blocked if both sides have high larger equal to the own height
                    # II.1 The insect moves on the same level or jump down
                    if (self.height(a) < hh) or (self.height(c) < hh):
                        yield b
        else: # II. The insect is on the ground level, move normal there
            yield from self.generate_walks_from_hex(hex)
        # III. Climbing up is always possible
        for b in self.neighbors(hex):
            if self.height(b) >= hh:
                yield b

    def generate_moves_for_stone(self, stone: Stone, hex: Hex) -> Iterator[Hex]:
        """ Yield possible move destination hexes for insect by name """
        if stone.insect == Insect.BEE:
            return self.generate_walks_from_hex(hex)
        elif stone.insect == Insect.SPIDER:
            return self.generate_spider_walks_from_hex(hex)
        elif stone.insect == Insect.ANT:
            return self.generate_any_walks_from_hex(hex)
        elif stone.insect == Insect.GRASSHOPPER:
            return self.generate_jumps_from_hex(hex)
        elif stone.insect == Insect.BEETLE:
            return self.generate_climbs_from_hex(hex)
        else:
            # TODO better excpetion
            raise Exception("Unknown insect")

    def generate_drops(self, team: Team) -> Iterator[Hex]:
        """ Finds hexes on which an insect of team could be dropped """
        empty_hexes = set()
        visited = {}
        def dfs(node, parent):
            if node in visited:
                return
            visited[node] = True
            for neighbor in node.neighbors():
                if neighbor == parent:
                    continue
                if neighbor not in self:
                    empty_hexes.add(neighbor)
                else:
                    dfs(neighbor, node)
        if self:
            # Find empty hexes adjacent to the hive
            root = self.get_root_hex()
            dfs(root, None)
            logger.debug(f"Found empty hexes {empty_hexes}")
            # Not the most efficient solution though
            yield from filter(lambda hex: self.neighbor_team(hex, team), empty_hexes)
        else: # The hive is empty -> only the Origin is valid / everything is valid
            yield Hex()


    def generate_moves(self, team):
        for hex, stone in self.get_hex_and_stones_of_team(team):
            logger.debug(f"Found {hex, stone} belonging to {team}")
            if self.height(hex) == 1 and hex in self.one_hive():
                logger.debug(f"{hex, stone} can't be moved due to one-hive")
                continue
            for destination in self.generate_moves_for_stone(stone, hex):
                logger.debug(f"Found destination {destination} for {stone} at {hex}")
                yield hex, destination
