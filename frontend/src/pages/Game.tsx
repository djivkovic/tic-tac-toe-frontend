import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketService from '../services/Socket';
import { getTokenData } from "../utils/getTokenData ";

const Game = () => {
    const host = process.env.REACT_APP_HOST;
    const [players, setPlayers] = useState<string[]>([]);
    const [board, setBoard] = useState<string[][]>(Array(3).fill(Array(3).fill('')));
    const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
    const { roomId } = useParams<{ roomId: string }>();
    const [moves, setMoves] = useState<any[]>([]);
    useEffect(() => {
        const joinRoom = async () => {
            if (roomId) {
                const roomNumber = parseInt(roomId, 10);
                try {
                    const decodedToken = getTokenData();

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
        socketService.listenOnRoom('update_players', (data: any) => {
            setPlayers(() => {
                return data.players;
            });
        });
        socketService.listenOnRoom('update_moves', (data: any) => {
            setMoves(() => {
                return data.moves;
            });
        } );
    }, []);
    useEffect(() => {
        const joinRoomResponseListener = (response: any) => {
            if (!response.success) {
                alert(response.message);
            } else {
                setHasJoinedRoom(true);
            }
        };

        socketService.socket.on("join_room_response", joinRoomResponseListener);

        return () => {
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
            const decodedToken = getTokenData();
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
