import React, { useState } from 'react';
import Board from './components/Board';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const TicTacToe = () => {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(PLAYER_X);

    const handleTileClick = (index: number) => {
        console.log(index);
    }

    return (
        <>
           <div>
              <h1>Tic Tac Toe</h1>
              <Board tiles={tiles} onTileClick={handleTileClick} />
           </div> 
        </>
    );
}

export default TicTacToe;
