import InteractiveGame from "../game/InteractiveGame";
import useHiveState from "./useHiveState";

export default function LocalGame({ p1, p2 }) {
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