import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socketService from '../services/Socket';
import {jwtDecode} from 'jwt-decode';

const Game = () => {
    const host = process.env.REACT_APP_HOST;
    const [messages, setMessages] = useState<string[]>([]);
    const [players, setPlayers] = useState<string[]>([]);
    const [board, setBoard] = useState<string[][]>(Array(3).fill(Array(3).fill('')));
    const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
    const messageListenerRef = useRef<(data: any) => void>();
    const { roomId } = useParams<{ roomId: string }>();
    const [moves, setMoves] = useState<any[]>([]);
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
                setHasJoinedRoom(true);
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


    const handleCellClick = (row: number, col: number) => {
        if (!hasJoinedRoom) {
            alert("You have not joined the room yet.");
            return;
        }
        const newBoard = board.map((r, i) => (
            r.map((cell, j) => (i === row && j === col ? 'X' : cell))
        ));
        setBoard(newBoard);
        makeMove(row, col);
    };

    const makeMove = async (row: number, col: number) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                alert('Token not found');
                return;
            }

            const decodedToken: any = jwtDecode(token);
            const userId = decodedToken.id;

            const move = {
                index: { x: row, y: col },
                sign: 'X', 
                userId: userId 
            };

            const response = await fetch(`${host}/api/game/make-move/${roomId}`,{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ move })
            });

            const result = await response.json();
            console.log(result);

            setMoves((prevMoves) => {
                const updatedMoves = [...prevMoves, move];
                console.log('MOVES: ', updatedMoves); 

                socketService.socket.emit('update_moves', { roomId, moves: updatedMoves });
                return updatedMoves;
            });
    
        } catch (error: any) {
            console.log('Error: ', error);
        }
    };

    return (
        <>
            <h2 className="title">Game {roomId}</h2>
            {hasJoinedRoom ? (
                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="board-row">
                            {row.map((cell, colIndex) => (
                                <div
                                    key={colIndex}
                                    className="board-cell"
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="loading-room">Joining room...</p>
            )}

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

            <ul id="moves">
                {moves.map((move, index) => (
                    <li key={index}>
                        {`Move ${index+1}: (${move.index.x}, ${move.index.y}), Sign: ${move.sign}, User: ${move.userId}`}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Game;