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
                return current_node.expand()  # -> a child node
            else:
                # Return the best child if the tree is fully expanded
                current_node = current_node.best_child()
        return current_node
