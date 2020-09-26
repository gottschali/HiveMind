from libhex import *


def one_hive(hive):
    lowlink = {}
    visited = {}
    index = {}
    counter = 0
    def dfs(node, parent, counter):
        visited[node] = True
        counter += 1
        index[node] = counter
        lowlink[node] = counter
        children = 0
        for neighbor in node.neighbors():
            if neighbor == parent or not neighbor in hive:
                continue
            if neighbor in visited:
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            else:
                children += 1
                dfs(neighbor, node, counter)
                lowlink[node] = min(lowlink[node], lowlink[neighbor])
            if lowlink[neighbor] >= index[node]:
                yield node
        if parent == None and children > 1:
            # Root is an articulation point
            yield node
    root = next(iter(hive))
    yield from dfs(root, None, counter)

