import React, { useState, useEffect, useRef } from 'react';
import { jwtDecode } from "jwt-decode";
import socketService from '../services/Socket';

const MessageDisplay = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [roomName, setRoomName] = useState<string>("");
    const messageListenerRef = useRef<(data: any) => void>();
    const [username, setUsername] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token); ; 
            setUsername(decodedToken.username);
        }

        
        }, []);

    useEffect(() => {
        messageListenerRef.current = (data: any) => {
            const newMessage = data.message;
            setMessages(prevMessages => [...prevMessages, newMessage]);
            localStorage.setItem("messages", JSON.stringify([...messages, newMessage]));
        };

        socketService.socket.on("receive_message", messageListenerRef.current);

        return () => {
            if (messageListenerRef.current) {
                socketService.socket.off("receive_message", messageListenerRef.current);
            }
        };
    }, [messages]);

    useEffect(() => {
        const storedMessages = localStorage.getItem("messages");
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    const joinRoom = () => {
        socketService.joinRoom(roomName);
        setRoomName(""); 
    };

    const leaveRoom = () => {
        socketService.leaveRoom(roomName); 
    };


    return (
        <div>
            <h2>Messages:</h2>
            <h3>{username}</h3>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
            <div>
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Naziv sobe"
                />
                <button onClick={joinRoom}>Join room</button>
                <button onClick={leaveRoom}>Leave room</button>
            </div>
        </div>
    );
};

export default MessageDisplay;
