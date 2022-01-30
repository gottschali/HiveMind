import { Button, Icon, Container, Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {useState} from 'react'
import CreateGameModal from '../components/CreateGameModal'

export default function Layout(props) {
    const [active, setActive] = useState('Home');
    const [createGameModalOpen, setCreateGameModalOpen] = useState(false);
    const handleClick = (e, {name}) => setActive(name);
    return (
        <Container >
            <Segment inverted>
                <Menu compact inverted stackable pointing secondary>
                    <Menu.Item header as={Link} to="/" name='HiveMind'>
                        <img src='/favicon/android-chrome-512x512.png' alt="logo" />
                    </Menu.Item>
                    <Menu.Item as={Link} to="/" name='Home' onClick={handleClick} active={active === 'Home'} />
                    <Menu.Item as={Link} to='/about' name='About' onClick={handleClick} active={active==='About'} />
                    <Menu.Item as={Link} to='/debug' name='Debug' onClick={handleClick} active={active==='Debug'} />
                    <Menu.Item as={Link} to='/join' name='Join' onClick={handleClick} active={active==='Join'} />
                    <Menu.Item name='play'>
                        <Button inverted icon labelPosition='left' onClick={() => setCreateGameModalOpen(true)} >
                            <Icon name="plus square outline" />
                            Create a Game
                        </Button>
                    </Menu.Item>
                    <Menu.Item as={Link} to='/play/test' name='Quick Play' onClick={handleClick} active={active==='Quick Play'} />
                </Menu>
            </Segment>
            <CreateGameModal open={createGameModalOpen} setOpen={setCreateGameModalOpen} />
            {props.children}

        </Container>
    )

}
