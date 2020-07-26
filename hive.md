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
