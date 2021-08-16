import { useState, useEffect } from 'react';
import {  Container, Segment, Divider, Input, Button } from 'semantic-ui-react'

export default function GameChat({ socket }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        const messageListener = (message) => {
            setMessages((prevMsgs) => {
                return [...prevMsgs, message]
            });
        }
        socket.on('chatMessage', messageListener)
        return () => {
            socket.off('chatMessage', messageListener)
        }
    }, [socket]);

    const handleSubmit = (event) => {
        if (text) {
            socket.emit('chatMessage', text)
            setText("");
        }
        event.preventDefault();
    }
    return (
        <div>
            <Container fluid>
            <Segment.Group size='small' style={{
                height: '500px',
                overflow: 'auto'
            }}>
                { messages.map( ({text, sender, time}) => {
                    return (
                        <>
                        <Segment inverted key={time} 
                            floated={sender === socket.id ? 'left' : 'right'}
                            color={sender === socket.id ? 'yellow' : 'green'}
                            style={{
                                borderRadius: sender === socket.id ? '25px 25px 25px 0px' : '25px 25px 0px 25px'
                            }}
                            >
                            {text}
                        </Segment>
                        <Divider hidden clearing/>
                        </>
                    )
                })}
            </Segment.Group>

            <form onSubmit={handleSubmit}>
                <Input fluid focus type="text" value={text}
                    onChange={(event)=>setText(event.target.value)}
                    placeholder='Type something'
                    action={{
                        icon: 'send',
                        color: 'primary'
                     }} />
            </form>
            </Container>
        </div>
    )
}
