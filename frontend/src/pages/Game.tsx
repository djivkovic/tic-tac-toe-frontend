import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketService from '../services/Socket';
import { jwtDecode } from 'jwt-decode';
const Game = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [players, setPlayers] = useState<string[]>([]);
    const messageListenerRef = useRef<(data: any) => void>();
    const { roomId } = useParams<{ roomId: string }>();
    useEffect(() => {
        const joinRoom = async () => {
            if (roomId) {
                const roomNumber = parseInt(roomId, 10);
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token not found');
                        alert('Token not found');
                        return;
                    }

                    const decodedToken: any = jwtDecode(token);
                    const userId = decodedToken.id;
                    const username = decodedToken.username;

                    socketService.joinRoom(roomNumber, userId, username);
                } catch (error: any) {
                    console.error(`Failed to join room ${roomNumber}`, error);
                    alert(`Failed to join room ${roomNumber}`);
                }
            }
        };
        joinRoom();
    }, [roomId]);
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
        setPlayers(socketService.players);

        const updatePlayersListener = (data: any) => {
            setPlayers(data.players);
        };
        socketService.socket.on("update_players", updatePlayersListener);

        const joinRoomResponseListener = (response: any) => {
            if (!response.success) {
                alert(response.message);
            } else {
                alert(`Successfully joined room ${roomId}`);
                const newPlayer = response.username;
                if (!players.includes(newPlayer)) {
                    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
                }
            }
        };

        socketService.socket.on("join_room_response", joinRoomResponseListener);

        return () => {
            socketService.socket.off("update_players", updatePlayersListener);
            socketService.socket.off("join_room_response", joinRoomResponseListener);
        };
    }, [players, roomId]);

    return (
        <>
            <h2 className="title">Game {roomId}</h2>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>

            <ul id="players">
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </>
    );
};

export default Game;
