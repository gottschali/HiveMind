import { useState, useEffect } from 'react';

export default function GameChat({ socket }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        socket.on('chatMessage', message => {
            messages.push(message);
            setMessages(messages);
        })
    }, []);

    const handleSubmit = (event) => {
        const message = {text, sender: socket.ID, time: Date.now()};
        setText("");
        socket.emit('chatMessage', message)
        event.preventDefault();
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
