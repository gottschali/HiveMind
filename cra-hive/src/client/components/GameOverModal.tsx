import { Button, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getResult } from '../utils/utils'

export default function GameOverModal({ open, result }) {
    const resultText = getResult(result);
    return (
        <Modal
            dimmer='blurring'
            open={open}
        >
            <Modal.Header> Game Over !</Modal.Header>
            <Modal.Content>
            {
                tie ? "It's a tie!" : (whiteWin ? 'Team RED wins' : 'Team BLUE wins')
            }
            </Modal.Content>
            <Modal.Actions>
                <Button negative as={Link} to='/'> 
                    Leave
                </Button>
            </Modal.Actions>
                <Modal.Header>
                    <Header inverted as='h1'>Game over: {resultText} </Header>
                </Modal.Header>
                    <CreateGameButton content="Play another round" />
        </Modal>
    )
}
