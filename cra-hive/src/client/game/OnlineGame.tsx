import { useInteractiveController } from '../controllers/interactiveController';
import remoteDummy from '../controllers/remoteDummyController';
import GameChat from '../components/GameChat'

import { useState, useEffect } from 'react';
import socketIOClient from "socket.io-client";

import { Grid } from 'semantic-ui-react'
import SocketGame from './SocketGame';


export default function OnlineGame({ gid, team }) {
    const [socket, setSocket] = useState(null);
    useEffect( () => {
        const newSocket = socketIOClient()
        setSocket(newSocket);
        // newSocket.onAny((...args) => {
            // console.log(args)
        // })
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
            <Grid columns={2} divided>
                <Grid.Row stretched>
                    <Grid.Column>
                        <SocketGame socket={socket} gid={gid} p1={p1} p2={p2} />
                    </Grid.Column>
                    <Grid.Column>
                        <GameChat socket={socket} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            : 'Not Connected' }
        </div>
    )
}
