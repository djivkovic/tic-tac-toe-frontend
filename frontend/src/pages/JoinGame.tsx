import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const JoinGame = () => {
  const [id, setId] = useState<number | undefined>(undefined);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: { username: string } = jwtDecode(token);
      setUsername(decodedToken.username);
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
