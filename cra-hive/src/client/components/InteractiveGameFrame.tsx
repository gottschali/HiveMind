import Hive from '../canvas/Hive'
import { DropInsectMenu } from './DropInsectMenu'

export default function InterActiveGameFrame({ state, handleBoardClick, handleDropClick, highlighted}) {
    return (
            <div>
                <Hive
                    hive={state.hive}
                    handleClick={handleBoardClick}
                    highlighted={highlighted}
                    team={state.team} />
                <DropInsectMenu stones={state._stones} team={state.team} handleClick={handleDropClick} allowedToDrop={state.allowedToDrop.bind(state)}/>
            </div>
    )
}