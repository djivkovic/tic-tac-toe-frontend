import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTokenData } from "../utils/getTokenData ";
import socketService from '../services/Socket';
import '../css/game.css';

const SinglePlayerGame = () => {
    const host = process.env.REACT_APP_HOST;
    const { roomId } = useParams<{ roomId: string }>();
    const [moves, setMoves] = useState<any[]>([]);
    const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
    const [playerDetails, setPlayerDetails] = useState<{ [key: string]: string }>({});
    const [board, setBoard] = useState<(string | null)[][]>(Array(3).fill(Array(3).fill(null)));
    const [winner, setWinner] = useState<string | null>(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const joinRoomResponseListener = (response: any) => {
            if (!response.success) {
                console.log(response.message);
            } else {
                setHasJoinedRoom(true);
            }
        };

        socketService.socket.on("join_room_response", joinRoomResponseListener);

        return () => {
            socketService.socket.off("join_room_response", joinRoomResponseListener);
        };
    }, [playerDetails, roomId]);

    useEffect(() => {
        const fetchWinner = async () => {
            try {
                const response = await fetch(`${host}/api/game/winner/${roomId}`); 
                if (!response.ok) {
                    throw new Error('Failed to fetch winner');
                }
                const data = await response.json();
                setWinner(data.winner); 
            } catch (error) {
                console.error('Error fetching winner:', error);
            }
        };

        fetchWinner();
    }, [roomId, host, moves]);

    const findGameById = async () => {
        try {
            const response = await fetch(`${host}/api/game/find-game/${roomId}`, {
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to find game');
            }

            const data = await response.json();
            return data.found;
        } catch (error) {
            console.error('Error finding game by ID:', error);
            return false;
        }
    };

    const checkGame = async () => {
        const foundGame = await findGameById();

        if (!foundGame) {
            navigate("/");
        } else {
            navigate(`/singlePlayer-game/${roomId}`);
        }
    };

    checkGame();

    useEffect(() => {
        const joinRoom = async () => {
            if (roomId) {
                const roomNumber = parseInt(roomId, 10);
                try {
                    const decodedToken = getTokenData();
                    const userId = decodedToken.id;
                    const username = decodedToken.username;

                    socketService.joinSinglePlayerRoom(roomNumber, userId, username);
                } catch (error: any) {
                    alert(`Failed to join room ${roomNumber}`);
                }
            }
        };
        joinRoom();
    }, [roomId]);

    useEffect(() => {
        const fetchPlayerDetails = async () => {
            try {
                const response = await fetch(`${host}/api/game/players/${roomId}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch player details');
                }

                const data = await response.json();

                const playerMap = data.reduce((acc: { [key: string]: string }, player: any) => {
                    acc[player._id] = player.username;
                    return acc;
                }, {});

                setPlayerDetails(playerMap);
            } catch (error: any) {
                console.error('Error fetching player details:', error);
            }
        };

        fetchPlayerDetails();
    }, [roomId, host]);

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

    const handleCellClick = (row: number, col: number) => {
        const isBoardFull = board.every(row => row.every(cell => cell !== null));
        if (isBoardFull) {
            alert("The board is full. No more moves can be made.");
            return;
        }

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

            const response = await fetch(`${host}/api/game/singlePlayer/make-move/${roomId}`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ move, userId })
            });

            if (!response.ok) {
                throw new Error('Failed to make move');
            }

        } catch (error: any) {
            alert(`${error.message}`);
        }
    };

    useEffect(() => {
        const fetchMoves = async () => {
            if (roomId) {
                try {
                    const response = await fetch(`${host}/api/game/moves/${roomId}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch moves');
                    }
                    const movesData = await response.json();
                    setMoves(movesData);
                } catch (error: any) {
                    alert(`${error.message}`);
                }
            }
        };

        fetchMoves();
    }, [roomId, host]);

    useEffect(() => {
        socketService.listenOnRoom('update_moves', (data: any) => {
            setMoves(prevMoves => [...prevMoves, data.move]);
        });
    }, []);

    const playerNames = Object.values(playerDetails);

    return (
        <>{hasJoinedRoom ? <div>
<h1 className="title">Single Player Game {roomId}</h1>
            {winner && winner !== 'Draw' && <p className="winner-info">Winner: {playerDetails[winner] || winner}</p>}
            {winner === 'Draw' && <p className="winner-info">Draw</p>} 
           
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

            <p className="player-symbol">Your symbol:  <span>X</span></p>

            <div id="players">
                <ul>
                    {playerNames.map((player, index) => (
                        <li key={index}>{player}</li>
                    ))}
                </ul>
            </div>

            <div className="moves-container">
                <ul id="moves">
                    {moves.map((move, index) => (
                        <li key={index}>
                            {`Move ${index + 1}: (${move.index.x}, ${move.index.y}), Sign: ${move.sign}, User: ${playerDetails[move.userId] || move.userId}`}
                        </li>
                    ))}
                </ul>
            </div>
        </div> : <div className="access-denied">Unable to join the room!</div>}
            
        </>
    );
}

export default SinglePlayerGame;
