import logging

from hivemind.state import State
from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

root = State()
node = MonteCarloTreeSearchNode(root)
search = MonteCarloTreeSearch(node)
r = search.best_action(100)
print(r.state)
