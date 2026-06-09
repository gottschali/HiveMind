import { Container, Label } from 'semantic-ui-react'
import ConfirmSurrender from './ConfirmSurrender'
import {getColor, getResult} from '../utils/utils'
import ShareButton from './ShareButton'


export default function InformationMenu({team, state, surrender}) {
    const message = state.team === team ? "It's your turn" : "It's your opponents turn"
    const result = getResult(state.result);
    return  (
        <Container>
            <Label color={getColor(team)}>
                Your team
            </Label>
            <Label color={getColor(state.team)}>
                {message}
            </Label>
            <Label basic>
                State: {result}
            </Label>
            <ShareButton />
            <ConfirmSurrender surrender={surrender}/>
        </Container>
    )
}
