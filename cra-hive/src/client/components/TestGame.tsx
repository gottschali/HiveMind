import { useState } from 'react'
import InterActiveGameFrame from "./InteractiveGameFrame";
import { State } from '../../shared/model/state'

import { usePlayerController } from '../controllers/LocalPlayerController';
import { Action } from '../../shared/model/action';


class DummPlayerController {
    handleBoardClick(...args) {
        console.log("Clicked on the board", ...args)
    }
    handleDropClick(insect) {
        console.log("Clicked on a drop insec", insect)
    }
}

function useHiveState(): [State, (a: Action) => void] {
    const [state, setState] = useState(new State());
    const [counter, setCounter] = useState(0);
    const step = () => {
        state.step()
        setCounter(counter + 1);
    }
    const reset = () => {
        setState(new State());
        setCounter(0);
    }
    const apply = (action) => {
        state.apply(action);
        setCounter(counter + 1);
    }
    return [state, apply];
}

export default function Game() {
    const [state, apply] = useHiveState();
    const player1 = usePlayerController(state.isLegal.bind(state), state, apply);
    const player2 = usePlayerController(state.isLegal.bind(state), state, apply);
    return <GameFrame state={state} player1={player1} player2={player2} />
}

function GameFrame({state, player1, player2}) {
    const player = (state.turnNumber % 2 == 0) ? player1 : player2
    return (
        <InterActiveGameFrame state={state} {...player} />
    )
}