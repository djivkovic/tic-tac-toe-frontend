import React from 'react';
import GameState from './GameState'; 

interface GameOverProps {
    gameState: number;
}

const GameOver: React.FC<GameOverProps> = ({ gameState }) => {
    let message = ""; 

    switch(gameState) {
        case GameState.playerXWins:
            message = "Player X wins!";
            break;
        case GameState.playerOWins:
            message = "Player O wins!";
            break;
        case GameState.draw:
            message = "It's a draw!";
            break;
        default:
            message = "Game in progress...";
    }

    return (
        <div className='game-over'>{message}</div>
    );
}

export default GameOver;
