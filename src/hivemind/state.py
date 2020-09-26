from sprite import *
from one_hive import one_hive
from copy import deepcopy
from itertools import repeat

"""
UnorderedDict maybe -> contains ?
default -> []

move_number = 0 # Increases by one after every action
queen_move = [False, False]

make a root state
"""

class Board(dict):

    def __init__(self, board=None, move_number=0, queen_move=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if board is None:
            self.board = dict()
        else:
            self.board = dict(board)
        self.move_number = move_number
        if queen_move is None:
            self.queen_move = [False, False]
        else:
            self.queen_move = queen_move


    def add_stones(self, stones):
        for stone in stones:
            self.board[stone.hex] = [stone]

    def is_game_over(self):
        """ If a queen is completely surrounded the other player wins """
        orange_over = black_over = False
        for stones in self.board.values():
            for stone in stones:
                if isinstance(stone, Queen):
                    if not stone.new and stone.is_surrounded(self.board):
                        if stone.team:
                            orange_over = True
                        else:
                            black_over = True
        if orange_over and black_over:
            # DRAW
            return -1
        elif orange_over:
            return True
        elif black_over:
            return False


    def get_legal_actions(self):
        for hex, stack in self.board.items():
            for sprite in stack:
                # TODO valid drops
                if sprite.new or sprite.team != self.move_number % 2:
                    continue
                yield from zip(repeat(hex), sprite.available_moves(self.board))


    def move(self, fro, to):
        sprite = self.board[fro][-1]
        new_board = self.board[fro].pop()
        if not len(new_board[fro]):
            del new_board[fro]
        # self.hex = hex
        if to not in board.keys():
            new_board[to] = [sprite]
        else:
            new_board[to].append(sprite)
        sprite._update()
        return new_board

