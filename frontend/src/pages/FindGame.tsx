import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTokenData } from "../utils/getTokenData ";

const FindGame = () => {
    const host = process.env.REACT_APP_HOST;
    const { gameId } = useParams<{ gameId: string }>();
    const [players, setPlayers] = useState<string[]>([]);
    const [playerDetails, setPlayerDetails] = useState<{ [key: string]: string }>({});
    const [board, setBoard] = useState<(string | null)[][]>(Array(3).fill(Array(3).fill(null)));
    const [moves, setMoves] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [winner, setWinner] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const decodedToken = getTokenData();
    const userId = decodedToken.id;

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                const response = await fetch(`${host}/api/game/find-game/${gameId}/${userId}`, {
                    method: "GET",
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    navigate('/');
                }

                const data = await response.json();

                if (data.found && data.game) {
                    setPlayers(data.game.players || []);
                    setMoves(data.game.moves || []);
                    const initialBoard = Array(3).fill(null).map(() => Array(3).fill(null));
                    data.game.moves.forEach((move: any) => {
                        initialBoard[move.index.x][move.index.y] = move.sign;
                    });
                    setBoard(initialBoard);
                    setWinner(playerDetails[data.game.winner] || data.game.winner);
                } else {
                    setError('Game not found!');
                }
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchPlayerDetails = async () => {
            try {
                const response = await fetch(`${host}/api/game/players/${gameId}`, {
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
                setError(error.message);
            }
        };

        fetchPlayerDetails();
        fetchGameDetails();
    }, [gameId, host, navigate, userId, playerDetails]);

    if (loading) {
        return <p>Loading game details...</p>;
    }

    if (error) {
        return <p className="error-msg">{error}</p>;
    }

    return (
        <>
            <h2 className="title">Game {gameId}</h2>
            {winner && winner !== 'Draw' && <p className="winner-info">Winner: {playerDetails[winner] || winner}</p>}
            {winner === 'Draw' && <p className="winner-info">Draw</p>} 
            <div className="board">
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className="board-row">
                        {row.map((cell, colIndex) => (
                            <div key={colIndex} className="board-cell">
                                {cell}
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <ul id="players">
                {players.map((player, index) => (
                    <li key={index}>{playerDetails[player] || player}</li>
                ))}
            </ul>
        <div className="moves-container">
            <ul id="moves">
                {moves.map((move, index) => (
                    <li key={index}>
                        {`Move ${index + 1}: (${move.index.x}, ${move.index.y}), Sign: ${move.sign}, User: ${playerDetails[move.userId] || move.userId}`}
                    </li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default FindGame;
