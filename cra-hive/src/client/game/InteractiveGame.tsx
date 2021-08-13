import Hive from '../canvas/Hive'
import { DropInsectMenu } from '../components/DropInsectMenu'
import { useInteractiveController } from '../controllers/useInteractiveController'

export default function InterActiveGame({ state, controller }) {
    const {highlighted, handleBoardClick, handleDropClick} = controller;
    return (
            <div>
                <Hive
                    hive={state.hive}
                    handleClick={handleBoardClick}
                    highlighted={highlighted}
                    team={state.team} />
                <DropInsectMenu
                    stones={state._stones}
                    team={state.team}
                    handleClick={handleDropClick}
                    allowedToDrop={state.allowedToDrop.bind(state)} />
            </div>
    )
}