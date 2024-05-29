import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTokenData } from "../utils/getTokenData ";
import { fetchGameDetails, fetchPlayerDetails } from "../utils/game";

const FindGame = () => {
    const host = process.env.REACT_APP_HOST;
    
    const { gameId } = useParams<{ gameId: string }>();
    const [players, setPlayers] = useState<string[]>([]);
    const [playerDetails, setPlayerDetails] = useState<{ [key: string]: string }>({});
    const [board, setBoard] = useState<(string | null)[][]>(Array(3).fill(Array(3).fill(null)));
    const [moves, setMoves] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [winner, setWinner] = useState<string | null>(null);
    const decodedToken = getTokenData();
    const userId = decodedToken.id;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchPlayerDetails(gameId, setPlayerDetails, navigate, host);
                await fetchGameDetails(gameId, userId, setPlayers, setMoves, setBoard, setWinner, setLoading, navigate, host);
            } catch (error :any) {
                navigate('/');
            }
        };

        fetchData();
    }, [gameId, userId, host, navigate]);
    
    if (loading) {
        return <p>Loading game details...</p>;
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
