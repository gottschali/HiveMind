import { useState } from 'react'
import { Move, Drop } from '../../shared/model/action';
import Stone from '../../shared/model/stone';


export function usePlayerController(submitAction, state, apply): any {
    const [actionType, setActionType] = useState(null);
    const [selected, setSelected] = useState(null);

    const handleBoardClick = (hex) => {
        console.log("Clicked on the board", hex)
        if (selected) {
            const newAction = new actionType.constructor(selected, hex);
            if (submitAction(newAction)) {
                setSelected(null);
                setActionType(null);
                apply(newAction);
            } else {
                setSelected(null);
                console.log("submitAction failed")
            }
        } else {
            if (state.allowedToMove(hex)) {
                setActionType(new Move());
                setSelected(hex);
            } else {
                console.log("Insect may not move")
            }
        }
    }
    const handleDropClick =  (insect) => {
        console.log("Clicked on a drop insec", insect)
        if (state.allowedToDrop(insect)) {
            setActionType(new Drop());
            setSelected(new Stone(insect, state.team));
        } else {
            setSelected(null);
            console.log("Insect may not drop")
        }
    }
    const highlighted = selected ? state.getDestinations(actionType, selected) : [];
    return {
        highlighted: highlighted,
        handleBoardClick: handleBoardClick,
        handleDropClick: handleDropClick
    }
}