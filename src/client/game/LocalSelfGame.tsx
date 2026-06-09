import { useInteractiveController } from '../controllers/interactiveController';
import LocalGame from './LocalGame';

export default function InteractiveRandom() {
    const p1 = useInteractiveController;
    const p2 = useInteractiveController;
    return <LocalGame p1={p1} p2={p2} />
}
