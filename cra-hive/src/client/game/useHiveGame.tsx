import { useState } from 'react';

import { State } from '../../shared/model/state'
import { Action } from '../../shared/model/action';

export default function useHiveGame() {
    const [history, setHistory] = useState([]);
    const [state, setState] = useState(new State());
    const [index, setIndex] = useState(0);

    const apply = (action: Action) => {
        console.log('Applying...')
        history[index] = action;
        setHistory(history);
        setState(state.apply(action));
        setIndex(index + 1);
    }
    const undo = () => {
        const action = history[index]
        setState(state.undo(action));
        setIndex(index - 1)
    }
    const reset = () => {
        setHistory([]);
        setState(new State());
        setIndex(0);
    }
    return {apply, undo, state, reset}
    
}