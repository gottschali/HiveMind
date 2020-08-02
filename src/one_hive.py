from libhex import *

null_hex = Hex(-999, 999)

def one_hive(board):
    lowlink = {}
    visited = {}
    index = {}
    articulation = set()
    counter = 0
    def dfs(v, p, counter):
        visited[v] = True
        counter += 1
        index[v] = counter
        lowlink[v] = counter
        children = 0
        for n in v.neighbors():
            if n == p or not n in board:
                continue
            if n in visited:
                lowlink[v] = min(lowlink[v], lowlink[n])
            else:
                children += 1
                dfs(n, v, counter)
                lowlink[v] = min(lowlink[v], lowlink[n])
            if lowlink[n] >= index[v]:
                articulation.add(v)
        if p == null_hex and children > 1:
            # Root is an articulation point
            articulation.add(v)
    for e in board:
        if not board[e][-1].new:
            root = e
            break
    dfs(root, null_hex, counter)
    print(articulation)
    return articulation

