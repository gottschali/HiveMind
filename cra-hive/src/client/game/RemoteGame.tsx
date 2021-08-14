import InteractiveGame from "../game/InteractiveGame";

export default function RemoteGame({ p1, p2, state, apply, socket }) {
    const submitAction = (action) => socket.emit("intendAction", {action: action})
    const player = ((state.turnNumber % 2 == 0) ? p1 : p2)(submitAction, state)
    return <InteractiveGame 
        state={state}
        controller={player} />
}