import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socketService from '../services/Socket';
import { getTokenData } from "../utils/getTokenData ";
import { showErrorToast } from '../utils/toastNotifications';
import { ToastContainer } from "react-toastify";
import { fetchWinner, joinGame, makeMove, fetchMoves, fetchUserSymbol, assignPlayer } from "../utils/game";
import "react-toastify/dist/ReactToastify.css";
import '../css/game.css';

const Game = () => {
    const host = process.env.REACT_APP_HOST;
    
    const [players, setPlayers] = useState<string[]>([]);
    const [hasJoinedRoom, setHasJoinedRoom] = useState<boolean>(false);
    const [board, setBoard] = useState<(string | null)[][]>(Array(3).fill(Array(3).fill(null)));
    const { roomId } = useParams<{ roomId: string }>();
    const [moves, setMoves] = useState<any[]>([]);
    const [userSymbol, setUserSymbol] = useState<string | null>(null);
    const [playerDetails, setPlayerDetails] = useState<{ [key: string]: string }>({});
    const [flag, setFlag] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchWinner(roomId, setWinner, host);
    }, [roomId, host, moves]);

    const handleJoinGame = async () => {
        await joinGame(roomId, host, navigate); 
    };
    
    handleJoinGame();

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
                    showErrorToast(`Failed to join room ${roomNumber}`);
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
        socketService.listenOnRoom('update_sign', () => {
            setFlag(true);
        });
    }, [flag]);

    useEffect(() => {
        const joinRoomResponseListener = (response: any) => {
            if (!response.success) {
                showErrorToast(response.message);
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
    }, [roomId, host, players]);

    useEffect(() => {
        fetchMoves(roomId, setMoves, host);
    }, [roomId, host]);

    useEffect(() => {
        const fetchAndSetUserSymbol = async () => {
            if (roomId) {
                const decodedToken = getTokenData();
                const userId = decodedToken.id;
                await fetchUserSymbol(roomId, host, userId, setUserSymbol);
            }
        };

        fetchAndSetUserSymbol();
    }, [roomId, host, flag, playerDetails]);

    const handleCellClick = (row: number, col: number) => {
        if (!hasJoinedRoom) {
            showErrorToast("You have not joined the room yet!");
            return;
        }

        const isBoardFull = board.every(row => row.every(cell => cell !== null));
        if (isBoardFull) {
            showErrorToast("The board is full. No more moves can be made!");
            return;
        }

        const decodedToken = getTokenData();
        const userId = decodedToken.id;

        const move = {
            index: { x: row, y: col },
            sign: userSymbol,
            userId: userId
        };

        makeMove(roomId, move, userId, host);
    };
    
    const handleAssignPlayer = (symbol :string) => {
        const decodedToken = getTokenData();
        const userId = decodedToken.id;

        assignPlayer(roomId, symbol, host, setUserSymbol, userId);
    };

    return (
        <> 
            {hasJoinedRoom ? (
                <>
                    <h2 className="title">Game {roomId}</h2>
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

                    {!userSymbol && hasJoinedRoom && !flag && (
                        <div className="assign-buttons">
                            <button className="assignX" onClick={() => handleAssignPlayer("X")}>Play as X</button>
                            <button className="assignO" onClick={() => handleAssignPlayer("O")}>Play as O</button>
                        </div>
                    )}

                    {userSymbol && <p className="player-symbol">Your symbol:  <span>{userSymbol}</span></p>}
                    <ToastContainer/>
                </>
            ) : (
                <ToastContainer/>
            )}
            <ul id="players">
                {players.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>

            {players.length === 2 &&  hasJoinedRoom && (
                <div className="moves-container">
                     <ul id="moves">
                    {moves.map((move, index) => (
                        <li key={index}>
                            {`Move ${index + 1}: (${move.index.x}, ${move.index.y}), Sign: ${move.sign}, User: ${playerDetails[move.userId] || move.userId}`}
                        </li>
                    ))}
                    </ul>
                </div>
            )}
        </>
    );
};

export default Game;
