import { useState } from "react";
import { State } from '../../shared/model/state'
import { Action } from '../../shared/model/action';

export default function useHiveState(): [State, (a: Action) => void] {
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