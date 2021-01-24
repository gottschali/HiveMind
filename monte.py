import logging

from hivemind.state import State
from mcts.node import MonteCarloTreeSearchNode
from mcts.search import MonteCarloTreeSearch

LEVEL = logging.WARN

logging.basicConfig(
    filename="test.log", filemode="w", format="%(filename)s: %(message)s", level=LEVEL
)

logger = logging.getLogger()
console_handler = logging.StreamHandler()
console_handler.setLevel(LEVEL)
formatter = logging.Formatter("%(levelname)s %(filename)s:  %(message)s")
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

root = State()
node = MonteCarloTreeSearchNode(root)
search = MonteCarloTreeSearch(node)
r = search.best_action(10)
print(r)
