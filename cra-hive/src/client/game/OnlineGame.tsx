import { useInteractiveController } from '../controllers/interactiveController'
import remoteDummy from '../controllers/remoteDummyController'
import GameChat from '../components/GameChat'
import ShareGameModal from '../components/ShareGameModal'
import { useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"

import SocketGame from './SocketGame'


export default function OnlineGame({ gid, team }) {
    const [socket, setSocket] = useState(null);
    const [shareGameModalOpen, setShareGameModalOpen] = useState(true);
    useEffect( () => {
        const newSocket = socketIOClient()
        setSocket(newSocket);
        // newSocket.onAny((...args) => {
            // console.log(args)
        // })
        newSocket.on('startGame', () => {
            setShareGameModalOpen(false);
        });
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
             <div>
                <SocketGame socket={socket} gid={gid} p1={p1} p2={p2} team={team} />
                <GameChat socket={socket} />
             </div>
            : 'Not Connected' }

            <ShareGameModal open={shareGameModalOpen} setOpen={setShareGameModalOpen} />
        </div>
    )
}
