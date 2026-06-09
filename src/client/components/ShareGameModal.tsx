import { Modal, Segment, Loader, Button, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import ShareButton from './ShareButton'


export default function ShareGameModal({ open, setOpen }) {
    return (
        <Modal
            dimmer='blurring'
            open={open} >
            <Modal.Header> Invite a player </Modal.Header>
            <Modal.Content>
                <Segment inverted>
                    <Loader inline indeterminate>Waiting for your opponent to join</Loader>
                </Segment>
            </Modal.Content>
            <Modal.Actions>

                <Button size='tiny' negative as={Link} to='/'>
                    <Icon name='cancel' />
                    Cancel
                </Button>
                <ShareButton />
            </Modal.Actions>
        </Modal>
    )
}
