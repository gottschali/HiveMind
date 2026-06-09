import { useInteractiveController } from '../controllers/interactiveController';
import LocalGame from '../game/LocalGame';



function InteractiveRandom() {
    const p1 = useInteractiveController;
    const p2 = useInteractiveController;
    return <LocalGame p1={p1} p2={p2} />
}


export default InteractiveRandom;