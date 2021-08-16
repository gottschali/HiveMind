import { useState, useEffect } from 'react';

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
        socket.emit('chatMessage', text)
        event.preventDefault();
        setText("");
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={text} onChange={(event)=>setText(event.target.value)} />
                <input type="submit" value="Submit" />
            </form>
            <ul>
                { messages.map( ({text, sender, time}) => {
                    return <li key={time}>{sender} ({time}): {text} </li>
                })}
            </ul>
        </div>
    )
}
