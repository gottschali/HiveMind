import { useParams } from 'react-router-dom'
import { useInteractiveController } from '../controllers/useInteractiveController';
import RemoteGame from '../game/RemoteGame';

import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

import useHiveState from "../game/useHiveState";

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

export default function OnlineGame() {
    const { gid } = useParams();
    const p1 = useInteractiveController;
    const p2 = useInteractiveController;
    const [socket, setSocket] = useState(null)
    // const p2 = (submitAction, state) => {
        // return ({
            // highlighted: [],
            // handleBoardClick: () => console.log("Remote player's turn"),
            // handleDropClick: () => console.log("Remote player's turn")
        // });
    // };
    const forceUpdate = useForceUpdate();

    const [state, apply] = useHiveState();

    useEffect( () => {
        const socket = socketIOClient();
        socket.emit('joinGame', gid)
        socket.on('updateAction', (action) => {
            apply(action);
            forceUpdate();
            console.log("updating ", action)
        })
        setSocket(socket)
        socket.onAny( (...args)=> {
            console.log(...args)
        })

    }, [])
    return (
        <div>
            <h1> Game ID: {gid} </h1>
            {socket ? <RemoteGame p1={p1} p2={p2} state={state} apply={apply} socket={socket} /> : 'Connectin...'}
        </div>
    )}