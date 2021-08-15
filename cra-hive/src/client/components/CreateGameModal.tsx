import { Button, Modal } from 'semantic-ui-react'

export default function CreateGameModal({open, setOpen}) {
    return (
            <Modal
                dimmer='blurring'
                open={open}
            >
                <Modal.Header>Create a new Game of Hive</Modal.Header>
                <Modal.Content>
                    Let Google help apps determine location. This means sending anonymous
                    location data to Google, even when no apps are running.
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button positive onClick={() => setOpen(false)}>
                        Create
                    </Button>
                </Modal.Actions>
            </Modal>
    )
}