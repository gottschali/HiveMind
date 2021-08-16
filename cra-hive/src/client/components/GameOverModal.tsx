import { Button, Modal } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function GameOverModal({ open, result }) {
    const [whiteDone, blackDone] = result;
    const tie = whiteDone && blackDone;
    const whiteWin = blackDone && blackDone != whiteDone;
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
        </Modal>
    )
}