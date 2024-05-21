import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from "../utils/getTokenData ";
const JoinGame = () => {
  const [id, setId] = useState<number | undefined>(undefined);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = getTokenData();
    const username = decodedToken.username;
    if (decodedToken) {
      setUsername(username);
    }
  }, []);
  const joinGame = () => {
    if (id !== undefined && username) {
      navigate(`/game/${id}`);
    } else {
      alert('Please enter a valid game ID and make sure you are logged in.');
    }
  };

  return (
    <div className="join-game-container">
      <h2 className="title">TicTacToe Game</h2>
      <input 
        type="number" 
        className="join-game-input" 
        onChange={(e) => setId(parseInt(e.target.value))} 
        placeholder="Enter game id..." 
      />
      <button className="join-game" onClick={joinGame}>Join Game</button>
    </div>
  );
};

export default JoinGame;
