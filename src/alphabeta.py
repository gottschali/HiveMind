import math

# to implement
# - .is_terminal() ?
# state.children()

def heuristic(state, player):
    score = 0
    for hex in state.hive:
        score += (state.hive.insect_at_hex(hex).team == player)
        score -= (state.hive.insect_at_hex(hex).team != player)
    return score


def alphabeta(root, depth, player):
    def _alphabeta(state, dep, player, alpha, beta):
        if dep >= depth or state.is_game_over():
            return heuristic(state, player)
        if player: # Maximize
            val = - math.inf
            for child in state.children():
                val = max(val, _alphabeta(child, dep + 1, ~player, alpha, beta))
                alpha = max(val, alpha)
            return val
        else: # Minimize
            val = math.inf
            for child in state.children():
                val = min(val, _alphabeta(child, dep + 1, ~player, alpha, beta))
                beta = min(val, beta)
            return val

    return _alphabeta(root, 0, player, -math.inf, math.inf)
