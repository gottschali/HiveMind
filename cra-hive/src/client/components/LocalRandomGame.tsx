import { useInteractiveController } from '../controllers/interactiveController';
import randomController from '../controllers/randomController';
import LocalGame from '../game/LocalGame';

export default function LocalRandomGame({ team }) {
    let p1, p2;
    if (team === 'white') {
        p1 = useInteractiveController;
        p2 = randomController;
    } else {
        p1 = randomController;
        p2 = useInteractiveController;
    }
    return <LocalGame p1={p1} p2={p2} />
}