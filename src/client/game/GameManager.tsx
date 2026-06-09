import { useParams } from 'react-router-dom'
import useQuery from '../utils/useQuery';
import OnlineGame from './OnlineGame';
import LocalSelfGame from './LocalSelfGame'
import LocalRandomGame from './LocalRandomGame'


export default function GameManager() {
    const { gid } = useParams();
    const query = useQuery();
    const team = query.get('team') || 'white';
    const mode = query.get('mode') || 'local';

    if (mode === 'online') {
        return <OnlineGame gid={gid} team={team} />
    } else if (mode === 'local') {
        return  <LocalSelfGame />
    } else if (mode === 'ai' ) {
        return <LocalRandomGame team={team} />
    } else {
        return (
        <div>
            Invalid Game
        </div>)
    }

}
