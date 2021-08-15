import { useParams, useLocation } from 'react-router-dom'
import { useInteractiveController } from '../controllers/useInteractiveController';
import RemoteGame from '../game/RemoteGame';

import { useEffect, useState } from 'react';
import socketIOClient from "socket.io-client";

import useHiveGame from '../game/useHiveGame';

function useForceUpdate(){
    const [value, setValue] = useState(0); // integer state
    return () => setValue(value => value + 1); // update the state to force render
}

const remoteDummy = (submitAction, state) => {
        return ({
            highlighted: [],
            handleBoardClick: () => console.log("Remote player's turn"),
            handleDropClick: () => console.log("Remote player's turn")
        });
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function OnlineGameManager() {
    const socket = socketIOClient();
    const { gid } = useParams();

    const query = useQuery();

    if (query.get("create")) {
        console.log("Creating game")
        socket.emit('createGame', gid)
    }
    const p1code = query.get("p1") || 'local';
    const p2code = query.get("p2") || 'remote';

    const controllerMap = {
        'local': useInteractiveController,
        'remote': remoteDummy,
    }
    const p1 = controllerMap[p1code];
    const p2 = controllerMap[p2code];

    return <OnlineGame socket={socket} gid={gid} p1={p1} p2={p2} />
}

function OnlineGame( {socket, gid, p1, p2} ) {
    const forceUpdate = useForceUpdate();
    const {apply, state} = useHiveGame();

    useEffect( () => {
        socket.emit('joinGame', gid)
        socket.on('updateAction', (action) => {
            apply(action);
            forceUpdate();
            console.log("updating ", action)
        })
        socket.onAny( (...args)=> {
            console.log(...args)
        })

    }, [])
    return (
        <div>
            <h1> Game ID: {gid} </h1>
            {socket ? <RemoteGame p1={p1} p2={p2} state={state} apply={apply} socket={socket} /> : 'Connecting...'}
        </div>
    )}