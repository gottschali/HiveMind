import { useEffect } from 'react'
import { Move, Drop } from '../../shared/model/action';
import Stone from '../../shared/model/stone';


export function useRandomPlayer(submitAction, state, apply): any {
    return {actionSelector: () => {
        let action = state.actions[Math.floor(Math.random() * state.actions.length)]
        while (!submitAction(action)) {
            console.log("A random illegal action has been choosen, which should never happen")
            action = state.actions[Math.floor(Math.random() * state.actions.length)]
        }
        apply(action)
    }
    }
}