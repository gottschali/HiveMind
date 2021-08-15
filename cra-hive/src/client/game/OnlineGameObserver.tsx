import useForceUpdate from "../utils/useForceUpdate";
import useHiveGame from "./useHiveGame";
import socketIOClient from 'socket.io-client';
import Hive from "../canvas/Hive";
import { useEffect } from "react";

export function OnlineGameObserver({ gid }) {
    const forceUpdate = useForceUpdate();
    const {apply, state} = useHiveGame();
    const socket = socketIOClient();
    useEffect(() => {
        socket.emit('joinGame', gid)
    })
    socket.on('updateAction', (action) => {
        apply(action);
        forceUpdate();
        console.log("updating ", action)
    })
    return <Hive hive={state.hive} />
}