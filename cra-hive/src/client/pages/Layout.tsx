import { Button, Container, Divider, Grid, Header, Image, Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import {useState} from 'react'


export default function Layout(props) {
    const [active, setActive] = useState('Home');
    const handleClick = (e, {name}) => setActive(name);
    return (
        <Container >
            <Segment inverted>
                <Menu compact inverted stackable pointing secondary>
                    <Menu.Item header as={Link} to="/" name='HiveMind'>
                        <img src='/favicon/android-chrome-512x512.png' />
                    </Menu.Item>
                    <Menu.Item as={Link} to="/" name='Home' onClick={handleClick} active={active === 'Home'} />
                    <Menu.Item as={Link} to='/about' name='About' onClick={handleClick} active={active==='About'} />
                    <Menu.Item as={Link} to='/debug' name='Debug' onClick={handleClick} active={active==='Debug'} />
                    <Menu.Item as={Link} to='/join' name='Join' onClick={handleClick} active={active==='Join'} />
                    <Menu.Item as={Link} to='/play' name='play' onClick={handleClick} active={active==='play'} />
                    <Menu.Item as={Link} to='/play/test' name='Quick Play' onClick={handleClick} active={active==='Quick Play'} />
                </Menu>
            </Segment>

            {props.children}

        </Container>
    )

}