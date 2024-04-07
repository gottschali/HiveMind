import { useState } from 'react'
import { Move, Drop } from '../../shared/model/action';
import Stone from '../../shared/model/stone';


export function useInteractiveController(submitAction, state): any {
    const [actionType, setActionType] = useState(null);
    const [selected, setSelected] = useState(null);
    const handleBoardClick = (hex) => {
        if (selected) {
            const newAction = new actionType.constructor(selected, hex);
            if (submitAction(newAction)) {
                setSelected(null);
                setActionType(null);
            } else {
                setSelected(null);
            }
        } else {
            if (state.allowedToMove(hex)) {
                setActionType(new Move());
                setSelected(hex);
            }
        }
    }
    const handleDropClick =  (insect) => {
        if (state.allowedToDrop(insect)) {
            setActionType(new Drop());
            setSelected(new Stone(insect, state.team));
        } else {
            setSelected(null);
        }
    }
    const highlighted = selected ? state.getDestinations(actionType, selected) : [];
    return {
        highlighted: highlighted,
        handleBoardClick: handleBoardClick,
        handleDropClick: handleDropClick
    }
}
