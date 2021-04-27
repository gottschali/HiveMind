# Hive-AI

Monte-Carlo-Tree-Search

## Tree lookahead with heuristics
* surround count of enemy - own surround count
	* unpinned insects
	* unpinning insects
	* move distance to queen (may be difficult for hoppers, could happen that it calculates to the same hex)
	* pinning count (how many enemy insects, how valuable the insects are)
* placeable hexes count
* avoid queen move
* incentive beetle mount

-> Value-Function
-> use Alpha-Beta-Pruning
# Model

## Move(from: hex, to: hex)

## State
Board
Movenumber
Queenmove
available_insects

make_action -> new State
copy the board
update_queenmove
drop
   update available_insects
   add at from
move
   remove from old
   add at from
update movenumber

game_over(board, ...)

validate_move(Move)
valid selection?
  board[x] exists
  board[x][-1] is of own team
board[x][-1].available_move(from, board)

validate_drop(to, board)

## Game
Attributes:
- State
Methods:

- Mainloop: While not GAMEOVER

Read -> get input (action)
   - move : from  -> to
   - drop : which -> where
Eval
   - input validation
   - Is the action legit?
     - self.state.validate_drop
     - self.state.validate_move
   - Else prompt again
Exec
   - make_action
   - continue in game flow

GAMEOVER = Game.state.game_over()

## AbstractInsect
team
available_moves(from, board)
moveable?

# View
draw_board(board)

Future:
animate_move()

# Controller
