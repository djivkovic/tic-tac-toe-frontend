import React from 'react';
import GameState from './GameState';

interface ResetGameProps {
    gameState: number;
    onReset: () => void; 
    saveGame?:  () => void; 
}
const ResetGame: React.FC<ResetGameProps> = ({ gameState, onReset, saveGame }) => {
    if (gameState !== GameState.inProgress) {
        return (
            <>
                <div className='game-buttons'>
                    <button className="reset-button" onClick={onReset}>Reset Game</button>
                    <button className="save-button" onClick={saveGame}>Save Game</button>
                </div>
            </>
        );
    }

    return null;
}

export default ResetGame;
