import { Icon, Button, Modal, Container, Header, Form } from 'semantic-ui-react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import uuid from 'uuid-random';

function CreateGameModal({ open, setOpen }) {
    const [gameMode, setGameMode] = useState('local');
    const [team, setTeam] = useState('red');
    const createGame = (location) => {
        const gid = uuid();
        if (gameMode === 'online') {
            fetch(`/game/${gid}`, {
                method: 'POST'
            }).catch( err => console.log("Failed to create game", err))
        }
        // Somehow react complains if the AI goes first.
        if (gameMode === 'ai') {
            return {
                pathname: `/play/${gid}`,
                search: `?team=white&mode=${gameMode}`
            }
        }
        return {
            pathname: `/play/${gid}`,
            search: `?team=${team}&mode=${gameMode}`
        }
    }
    return (
        <Modal
            dimmer='blurring'
            open={open}
        >
            <Modal.Header>Create a new Game of Hive</Modal.Header>
            <Modal.Content>
                <Container>
                    <Form>
                        <Header as="h3">
                            Play against
                        </Header>
                        <Form.Field>
                            <Button.Group>
                                <Button onClick={() => setGameMode('local')}>Yourself </Button>
                                <Button.Or />
                                <Button onClick={() => setGameMode('ai')}>A very stupid computer </Button>
                                <Button.Or />
                                <Button onClick={() => setGameMode('online')}>Friend </Button>
                            </Button.Group>
                        </Form.Field>
                        <Header as="h3">
                            Start as
                        </Header>
                        <Form.Field >
                            <Button.Group >
                                <Button onClick={() => setTeam('white')} color="red">red </Button>
                                <Button.Or />
                                {/*                                 <Button onClick={() => setTeam('random')} color="violet">random </Button> */}
                                <Button.Or inverted />
                                <Button onClick={() => setTeam('black')} color="blue">blue </Button>
                            </Button.Group>
                        </Form.Field>
                    </Form>
                </Container>
            </Modal.Content>
            <Modal.Actions>
                <Button negative onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button positive onClick={() => {
                    setOpen(false);
                }} as={Link} 
                to={createGame}>
                    Create
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default function CreateGameButton({ content }) {
    const [createGameModalOpen, setCreateGameModalOpen] = useState(false);
    return (
        <>
            <Button inverted icon labelPosition='left' onClick={() => setCreateGameModalOpen(true)} >
                <Icon name="plus square outline" />
                { content }
            </Button>
            <CreateGameModal open={createGameModalOpen} setOpen={setCreateGameModalOpen} />
        </>
    )
}
