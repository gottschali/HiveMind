import { useState } from 'react'
import InteractiveGame from "../game/InteractiveGame";
import { State } from '../../shared/model/state'

import { Action } from '../../shared/model/action';
import { useInteractiveController } from '../controllers/useInteractiveController';



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


function useRandomController(submitAction, state) {
    const action = state.actions[Math.floor(Math.random() * state.actions.length)];
    submitAction(action);
}

function InteractiveRandom() {
    const p1 = useInteractiveController;
    const p2 = useInteractiveController;
    return <LocalGame p1={p1} p2={p2} />
}

function RemoteGame({ p1, p2 }) {
    const [state, apply] = useHiveState();

    const submitAction = (action) => {
            console.log(`Remote Submitting ${action}`)
            if (state.isLegal(action)) {
                apply(action);
                return true;
            }
            return false;
    };

    const player = ((state.turnNumber % 2 == 0) ? p1 : p2)(submitAction, state)
    return <InteractiveGame 
        state={state}
        controller={player} />
}

function LocalGame({ p1, p2 }) {
    const [state, apply] = useHiveState();

    const submitAction = (action) => {
            console.log(`Submitting ${action}`)
            if (state.isLegal(action)) {
                apply(action);
                return true;
            }
            return false;
    };

    const player = ((state.turnNumber % 2 == 0) ? p1 : p2)(submitAction, state)
    return <InteractiveGame 
        state={state}
        controller={player} />
}


export default InteractiveRandom;