import math

from hivemind import *


def heuristic(state, player):
    score = 0
    for hex in state.hive:
        stone = state.hive.at(hex)
        if stone.insect == Insect.BEE and state.turn_number > 7:
            n = len(state.hive.neighbours(hex)) * 10
            if stone.team == player:
                score -= n
            else:
                score += n
        score += stone.team == player
        score -= stone.team != player
    return score


def alphabeta(root, depth=3):
    def _alphabeta(state, dep, player, alpha, beta):
        if dep >= depth or state.is_game_over():
            return heuristic(state, player), Pass()
        _action = Pass()
        if player:  # Maximize
            val = -math.inf
            for action in state.possible_actions:
                child = state + action
                ab, _ = _alphabeta(child, dep + 1, ~player, alpha, beta)
                if val < ab:
                    val = ab
                    _action = action
                alpha = max(val, alpha)
            return (val, _action)
        else:  # Minimize
            val = math.inf
            for action in state.possible_actions:
                child = state + action
                ab, _ = _alphabeta(child, dep + 1, ~player, alpha, beta)
                if val > ab:
                    val = ab
                    _action = action
                beta = min(val, beta)
            return (val, _action)

    val, action = _alphabeta(root, 0, root.current_team, -math.inf, math.inf)
    return action


if __name__ == "__main__":
    s = State()
    print(alphabeta(s, 4))
