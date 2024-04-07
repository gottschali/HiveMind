import socketIOClient from 'socket.io-client';
import { useState, useEffect } from "react";
import remoteDummy from '../controllers/remoteDummyController';

import SocketGame from "./SocketGame";

export function OnlineGameObserver({ gid }) {
    const [socket, setSocket] = useState(null);
    useEffect( () => {
        const newSocket = socketIOClient()
        setSocket(newSocket);
        return () => {
            newSocket.close()
        }
    }, [setSocket])
    const p1 = remoteDummy;
    const p2 = remoteDummy;
    return <>
        {socket ? <SocketGame socket={socket} gid={gid} p1={p1} p2={p2} team='spectator' /> : 'Loading...'}
        </>
}
