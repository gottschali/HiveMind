import { Container, Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {useState} from 'react'
import CreateGameButton from '../components/CreateGameButton'

export default function Layout(props) {
    const [active, setActive] = useState('Home');
    const handleClick = (e, {name}) => setActive(name);
    return (
        <Container >
            <Segment inverted>
                <Menu compact inverted stackable pointing secondary>
                    <Menu.Item header as={Link} to="/" name='HiveMind'>
                        <img src='/favicon/android-chrome-512x512.png' alt="logo" />
                    </Menu.Item>
                    <Menu.Item as={Link} to="/" name='Home' onClick={handleClick} active={active === 'Home'} />
                    <Menu.Item as={Link} to='/tutorial' name='Tutorial' onClick={handleClick} active={active==='Tutorial'} />
                    <Menu.Item name='play'>
                        <CreateGameButton content="Create a game"/>
                    </Menu.Item>
                    {/*                     <Menu.Item as={Link} to='/play/test' name='Quick Play' onClick={handleClick} active={active==='Quick Play'} /> */}
                </Menu>
            </Segment>
            {props.children}

        </Container>
    )

}
