import React from 'react';
import GameState from './GameState';

interface ResetGameProps {
    gameState: number;
    onReset: () => void; 
}

const ResetGame: React.FC<ResetGameProps> = ({ gameState, onReset }) => {
    if (gameState !== GameState.inProgress) {
        return (
            <button className="reset-button" onClick={onReset}>Reset Game</button>
        );
    }

    return null;
}

export default ResetGame;
