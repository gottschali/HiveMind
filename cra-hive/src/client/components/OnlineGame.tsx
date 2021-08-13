import { useParams } from 'react-router-dom'

export default function OnlineGame() {
    const { gid } = useParams();
    return <h1> Game ID: {gid} </h1>
}