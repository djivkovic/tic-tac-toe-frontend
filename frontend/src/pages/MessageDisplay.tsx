import React, { useState, useEffect, useRef } from 'react';
import {jwtDecode} from "jwt-decode";
import socketService from '../services/Socket';

const MessageDisplay = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [roomName, setRoomName] = useState<number | undefined>(undefined);
    const [userId, setUserId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const messageListenerRef = useRef<(data: any) => void>();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedToken: any = jwtDecode(token);
                setUserId(decodedToken.id);
                setUsername(decodedToken.username);
            } catch (error) {
                console.error('Error decoding token', error);
            }
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
        if (!userId || !username) {
            alert('User not authenticated.');
            return;
        }

        if (roomName !== undefined) {
            socketService.joinRoom(roomName, userId, username);
        } else {
            alert('Please enter a valid room number.');
        }
    };

    const leaveRoom = () => {
        if (roomName !== undefined) {
            socketService.leaveRoom(roomName);
        } else {
            alert('Please enter a valid room number.');
        }
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
                    type="number"
                    value={roomName !== undefined ? roomName : ''}
                    onChange={(e) => setRoomName(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Room name"
                />
                <button onClick={joinRoom}>Join room</button>
                <button onClick={leaveRoom}>Leave room</button>
            </div>
        </div>
    );
};

export default MessageDisplay;
