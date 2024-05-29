import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getTokenData } from "../utils/getTokenData ";
import socketService from '../services/Socket';
import { showErrorToast } from '../utils/toastNotifications';
import { ToastContainer } from "react-toastify";
import { fetchWinner, joinSinglePlayerGame, fetchPlayerDetails, makeSinglePlayerMove, fetchMoves } from "../utils/game";
import "react-toastify/dist/ReactToastify.css";
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

    const handleJoinGame = () => {
        joinSinglePlayerGame(roomId, host, navigate);
    }

    handleJoinGame();
    
    useEffect(() => {
        const joinRoomResponseListener = (response: any) => {
            if (!response.success) {
                showErrorToast(response.message);
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
        fetchWinner(roomId, setWinner, host);
    }, [roomId, host, moves]);

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
                    showErrorToast(`Failed to join room ${roomId}`);
                }
            }
        };
        joinRoom();
    }, [roomId]);

    useEffect(() => {
        fetchPlayerDetails(roomId, setPlayerDetails, navigate, host);
    }, [roomId, host, navigate]);

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

    const handleCellClick = async (row: number, col: number) => {
        const isBoardFull = board.every(row => row.every(cell => cell !== null));
        if (isBoardFull) {
            showErrorToast("The board is full. No more moves can be made!");
            console.log("The board is full. No more moves can be made!");
            return;
        }
    
        try {
            const decodedToken = getTokenData();
            const userId = decodedToken.id;
    
            const move = {
                index: { x: row, y: col },
                sign: 'X',
                userId: userId
            };
    
            await makeSinglePlayerMove(roomId, move, host);
        } catch (error: any) {
            showErrorToast(error.message);
        }
    };

    useEffect(() => {
        fetchMoves(roomId, setMoves, host);
    }, [roomId, host]);

    useEffect(() => {
        socketService.listenOnRoom('update_moves', (data: any) => {
            setMoves(prevMoves => [...prevMoves, data.move]);
        });
    }, []);

    const playerNames = Object.values(playerDetails);

    return (
        <>  {hasJoinedRoom ? <div>
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
            <ToastContainer/>
        </div> : <div> <ToastContainer/> </div>}
        </>
    );
}

export default SinglePlayerGame;
