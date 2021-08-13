import { useParams } from 'react-router-dom'
import { useInteractiveController } from '../controllers/useInteractiveController';
import RemoteGame from '../game/RemoteGame';


export default function OnlineGame() {
    const { gid } = useParams();
    const p1 = useInteractiveController;
    const p2 = (submitAction, state) => {
        return ({
            highlighted: [],
            handleBoardClick: () => console.log("Remote player's turn"),
            handleDropClick: () => console.log("Remote player's turn")
        });
    };
    return (
        <div>
            <h1> Game ID: {gid} </h1>
            <RemoteGame p1={p1} p2={p2} />
        </div>
    )}