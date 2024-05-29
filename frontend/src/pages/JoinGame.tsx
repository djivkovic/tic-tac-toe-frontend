import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from "../utils/getTokenData ";
import { showErrorToast } from '../utils/toastNotifications';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const JoinGame = () => {
  const [id, setId] = useState<number | undefined>(undefined);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const host = process.env.REACT_APP_HOST;

  const findGameById = async () => {
        const response = await fetch(`${host}/api/game/find-game/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data.found;
  };

  useEffect(() => {
    const decodedToken = getTokenData();
    const username = decodedToken.username;
    if (decodedToken) {
      setUsername(username);
    }
  }, []);
  
  const joinGame = async () => {
    const foundGame = await findGameById();

    if(foundGame && username){
      navigate(`/game/${id}`);
    }else{
      showErrorToast('Failed to join game!');
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
      <ToastContainer />
    </div>
  );
};

export default JoinGame;
