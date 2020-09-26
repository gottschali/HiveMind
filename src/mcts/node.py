import numpy as np
from collections import defaultdict

# Why defaultdict
# state::get_legal_actions
# state::move -> state
# state::is_game_over
# state::next_to_move ???

class MonteCarloTreeSearchNode:

    def __init__(self, state, parent=None):
        self.state = state
        self.parent = parent
        self.children = []
        self._number_of_visits = 0.
        self._results = defaultdict(int)
        self._untried_actions = None

    def untried_actions(self):
        """ returns list of moves """
        if self._untried_actions is None:
            self._untried_actions = self.state.get_legal_actions()
        return self._untried_actions

    def q(self):
        wins = self._results[self.parent.state.move_number % 2]
        loses = self._results[-1 * self.parent.state.move_number % 2]

    def n(self):
        return self._number_of_visits

    def expand(self):
        """ Does add a child """
        action = self.untried_actions.pop()
        next_board = self.state.move(action)
        child_node = MonteCarloTreeSearchNode(
            next_board, parent=self
        )
        self.children.append(child_node)
        return child_node

    def is_terminal_node(self):
        return self.state.is_game_over()

    def rollout(self):
        """ Playout a game until done """
        current_rollout_board = self.state
        while not current_rollout_board.is_game_over():
            possible_moves = current_rollout_board.get_legal_actions()
            action = self.rollout_policy(possible_moves)
            current_rollout_board = current_rollout_board.move(action)
        return current_rollout_board.game_result

    def backpropagate(self, reward):
        """ Update q and n upwards the tree """
        self._number_of_visits += 1.
        self._results[result] += 1.
        if self.parent:
            self.parent.backpropagate(result)

    def is_fully_expanded(self):
        """ Every children move tried """
        return len(self.untried_actions) == 0

    def best_child(self, c_param=1.4):
        """ chooses the best possible node -> Move """
        choices_weights = [
            (c.q / c.n) + c_param * np.sqrt((2 * np.log(self.n) / c.n))
            for c in self.children
        ]
        return self.children[np.argmax(choices_weights)]

    def rollout_policy(self, possible_moves):
        """ How to choose from possible moves -> Move """
        return np.random.choice(possible_moves)

class MonteCarloTreeSearch:

    def __init__(self, node):
        self.root = node

    def best_action(self, simulations_number):
        for _ in range(0, simulations_number):
            v = self._tree_policy()
            reward = v.rollout()
            v.backpropagate(reward)
        # to select best child go for exploitation only
        # return self.root.best_child(c_param=0.)
        return self.root.best_child()

    def _tree_policy(self):
        """
        selects node to run rollout/playout for
        Returns a node
        -------
        """
        current_node = self.root
        while not current_node.is_terminal_node():
            if not current_node.is_fully_expanded():
                return current_node.expand() # -> a child node
            else:
                # Return the best child if the tree is fully expanded
                current_node = current_node.best_child()
        return current_node
