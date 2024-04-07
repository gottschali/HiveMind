import GenericGame from "./GenericGame";
import useForceUpdate from "../utils/useForceUpdate";
import useHiveGame from "./useHiveGame";
import { useEffect } from "react";
import InformationMenu from '../components/InformationMenu'
import { deserializeAction } from "../../shared/model/action";

export default function SocketGame( {socket, gid, p1, p2, team} ) {
    const forceUpdate = useForceUpdate();
    const {apply, state} = useHiveGame();
    const submitAction = (action) => socket.emit("intendAction", {action: action})
    const surrender = () => socket.emit("surrender");

    useEffect( () => {
        socket.emit('joinGame', {gid: gid, team: team})
        const actionListener = (json) => {
            const action = deserializeAction(json);
            apply(action);
            forceUpdate();
        }
        socket.on('updateAction', actionListener);
        socket.on('surrender', ({team}) => {
            state.surrender(team);
            forceUpdate();
        });
        return () => {
            socket.off('updateAction', actionListener)
        }
    }, [socket])
    return <>
            <InformationMenu team={team} state={state} surrender={surrender}/>
            <Wrapped state={state} p1={p1} p2={p2} submitAction={submitAction} />
            </>
}    

function Wrapped({state, p1, p2, submitAction}) {
    const player = ((state.turnNumber % 2 === 0) ? p1 : p2)(submitAction, state)
    return (
        <GenericGame controller={player} state={state} />
    )
}
