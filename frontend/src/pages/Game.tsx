import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socketService from '../services/Socket';
import { getTokenData } from "../utils/getTokenData ";
const Game = () => {
    const host = process.env.REACT_APP_HOST;
    const [players, setPlayers] = useState<string[]>([]);
    const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
    const [board, setBoard] = useState<(string | null)[][]>(Array(3).fill(Array(3).fill(null)));
    const { roomId } = useParams<{ roomId: string }>();
    const [moves, setMoves] = useState<any[]>([]);
    const [playerSymbol, setPlayerSymbol] = useState<string | null>(null);
    const [playerSymbolToSend, setPlayerSymbolToSend] = useState<string | null>(null);


    const fetchPlayerSymbol = async () =>{
        try{
            const decodedToken = getTokenData();
            const userId = decodedToken.id;

            const response = await fetch(`http://localhost:5000/api/game/player-symbol/${roomId}/${userId}`,{
                method:"GET",
                headers: { 'Content-Type': 'application/json' },
            });
        
                const data = await response.json();
                setPlayerSymbolToSend(data.symbol);
        }catch (err){
            console.log(err);
        }
    }

    useEffect(()=>{
        fetchPlayerSymbol();
    },[moves]);

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
                    alert(`Failed to join room ${roomNumber}: ${error.message}`);
                }
            }
        };
        joinRoom();
    }, [roomId]);

    useEffect(() => {
        socketService.listenOnRoom('update_players', (data: any) => {
            setPlayers(data.players);
        });

        socketService.listenOnRoom('update_moves', (data: any) => {
            setMoves(prevMoves => [...prevMoves, data.move]);
        });
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

    useEffect(() => {
        const updateBoardWithMoves = (movesToUse: any[]) => {
            setBoard(prevBoard => {
                const newBoard = prevBoard.map((row, i) =>
                    row.map((cell, j) => {
                        const move = movesToUse.find((m: any) => m.index && m.index.x === i && m.index.y === j);
                        return move ? move.sign : cell;
                    })
                );
                return newBoard;
            });
        };

        updateBoardWithMoves(moves);
    }, [moves]);

    useEffect(() => {
        const fetchMoves = async () => {
            if (roomId) {
                try {
                    const response = await fetch(`${host}/api/game/moves/${roomId}`);
                    const movesData = await response.json();
                    setMoves(movesData);
                } catch (error) {
                    console.error('Error fetching moves:', error);
                    alert(`Error fetching moves: ${error}`);
                }
            }
        };

        fetchMoves();
    }, [roomId, host]);

    const handleCellClick = (row: number, col: number) => {
        console.log("playerSymbolToSend: ", playerSymbolToSend);
        if (!hasJoinedRoom) {
            alert("You have not joined the room yet.");
            return;
        }
        const newBoard = board.map((r, i) => (
            r.map((cell, j) => (i === row && j === col ? playerSymbol : cell))
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
                sign: playerSymbolToSend,
                userId: userId
            };

            const response = await fetch(`${host}/api/game/make-move/${roomId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ move })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to make move');
            }

            const result = await response.json();
            console.log(result);

        } catch (error: any) {
            console.log('Error: ', error);
            alert(`Failed to make move: ${error.message}`);
        }
    };

    const assignPlayer = async (symbol: string) => {
        setPlayerSymbol(symbol);

        try {
            const decodedToken = getTokenData();
            const userId = decodedToken.id;

            const response = await fetch(`${host}/api/game/assign-player/${roomId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, sign: symbol })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to assign player');
            }

            const result = await response.json();
            console.log(result);

        } catch (error: any) {
            console.error('Error assigning player:', error);
            alert("Failed to assign player");
        }
    };

    return (
        <>
            <h2 className="title">Game {roomId}</h2>
            {hasJoinedRoom ? (
                <>
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
                    
                    <div>
                        <button onClick={() => assignPlayer("X")}>Play as X</button>
                        <button onClick={() => assignPlayer("O")}>Play as O</button>
                    </div>
                </>
                
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
                        {`Move ${index + 1}: (${move.index.x}, ${move.index.y}), Sign: ${move.sign}, User: ${move.userId}`}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Game;
