import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { joinGame } from "../utils/game"; 

const JoinGame = () => {
  const host = process.env.REACT_APP_HOST;
  
  const [id, setId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();

  const handleJoinGame = async () => {
    await joinGame(id, host, navigate); 
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
      <button className="join-game" onClick={handleJoinGame}>Join Game</button> 
      <ToastContainer />
    </div>
  );
};

export default JoinGame;
