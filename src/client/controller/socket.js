import { io } from "socket.io-client";

// const URL = `ws://localhost:${window.location.port}`;
const socket = io();

// Useful for debugging
socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
