import { io } from "socket.io-client";

const URL = "ws://localhost:3000";
const socket = io(URL);

// Useful for debugging
socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;