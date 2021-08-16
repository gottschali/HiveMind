import { Button, Modal, Container, Header, Form } from 'semantic-ui-react'
import { useState } from 'react';
import { Link } from 'react-router-dom'
import uuid from 'uuid-random';

export default function CreateGameModal({ open, setOpen }) {
    const [gameMode, setGameMode] = useState('local');
    const [team, setTeam] = useState('red');
    const createGame = (location) => {
        let path;
        if (gameMode === 'local') {
            path = '/play/local'
        } else if (gameMode === 'ai') {
            path = '/play/ai'
        } else {
            const gid = uuid();
            path = `/play/${gid}`
        }
        return {
            pathname: path,
            search: `?team=${team}`
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
                                <Button onClick={() => setGameMode('ai')}>AI </Button>
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
                                <Button onClick={() => setTeam('random')} color="violet">random </Button>
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