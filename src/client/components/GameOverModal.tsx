import { Button, Modal, Segment, Header } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { getResult } from '../utils/utils'
import CreateGameButton from '../components/CreateGameButton'

export default function GameOverModal({ open, result }) {
    const resultText = getResult(result);
    return (
        <Modal
            dimmer='blurring'
            open={open} >
            <Segment inverted>
                <Modal.Header>
                    <Header inverted as='h1'>Game over: {resultText} </Header>
                </Modal.Header>
                <hr/>
                <Modal.Actions>
                    <CreateGameButton content="Play another round" />
                    <Button negative as={Link} to='/'>
                        Leave
                    </Button>
                </Modal.Actions>
            </Segment>
        </Modal>
    )
}
