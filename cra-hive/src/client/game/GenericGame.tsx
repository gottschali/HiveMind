import Hive from '../canvas/Hive'
import { DropInsectMenu } from '../components/DropInsectMenu'

export default function GenericGame({ state, controller }) {
    const {highlighted, handleBoardClick, handleDropClick} = controller;
    return (
            <div>
                <DropInsectMenu
                    stones={state._stones}
                    team={state.team}
                    handleClick={handleDropClick}
                    allowedToDrop={state.allowedToDrop.bind(state)} />
                <Hive
                    hive={state.hive}
                    handleClick={handleBoardClick}
                    highlighted={highlighted}
                    team={state.team} />
            </div>
    )
}