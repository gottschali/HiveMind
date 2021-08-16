import { useInteractiveController } from '../controllers/useInteractiveController';
import RemoteGame from '../game/RemoteGame';
import remoteDummy from '../controllers/remotDummy';
import GameChat from './GameChat'

import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

import useHiveGame from '../game/useHiveGame';
import useForceUpdate from '../utils/useForceUpdate';


export default function OnlineGameManager({ gid, team }) {
    const [socket, setSocket] = useState(null);
    useEffect( () => {
        const newSocket = socketIOClient()
        setSocket(newSocket);
        newSocket.onAny((...args) => {
            console.log(args)
        })
        return () => {
            newSocket.close()
        }
    }, [setSocket])

    let p1, p2;
    if (team === 'white') {
        p1 = useInteractiveController;
        p2 = remoteDummy;
    } else {
        p1 = remoteDummy;
        p2 = useInteractiveController;
    }

    return (
        <div>
            {socket ?  
            <>
                <OnlineGame socket={socket} gid={gid} p1={p1} p2={p2} />
                <GameChat socket={socket} />
            </>
            : 'Not Connected' }
        </div>
    )
}

function OnlineGame( {socket, gid, p1, p2} ) {
    const forceUpdate = useForceUpdate();
    const {apply, state} = useHiveGame();

    useEffect( () => {
        socket.emit('joinGame', gid)
        const actionListener = (action) => {
            apply(action);
            forceUpdate();
            console.log("updating ", action)
        }
        socket.on('updateAction', actionListener)
        return () => {
            socket.off('updateAction', actionListener)
        }
    }, [socket])
    return (
        <RemoteGame p1={p1} p2={p2} state={state} apply={apply} socket={socket} />
    )}