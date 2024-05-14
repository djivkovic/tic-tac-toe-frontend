import React, { useState, useEffect } from 'react';
import Board from './components/Board';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const winningCombinations = [
    //rows
    {combo:[0,1,2], strikeClass: "strike-row-1"},
    {combo:[3,4,5], strikeClass: "strike-row-2"},
    {combo:[6,7,8], strikeClass: "strike-row-3"},

    //columns
    {combo:[0,3,6], strikeClass: "strike-column-1"},
    {combo:[1,4,7], strikeClass: "strike-column-2"},
    {combo:[2,5,8], strikeClass: "strike-column-3"},

    //diagonals
    {combo:[0,4,8], strikeClass: "strike-diagonal-1"},
    {combo:[2,4,6], strikeClass: "strike-diagonal-2"},
];

const TicTacToe = () => {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
    const [strikeClass, setStrikeClass] = useState("");

    const checkWinner = (tiles: (string | null)[], setStrikeClass: React.Dispatch<React.SetStateAction<string>>) => {
        for(const  {combo, strikeClass} of winningCombinations){
            const tileValue1 = tiles[combo[0]];
            const tileValue2 = tiles[combo[1]];
            const tileValue3 = tiles[combo[2]];

            if(tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3){
                setStrikeClass(strikeClass);
            }
        }
    }

    useEffect(()=>{
        checkWinner(tiles, setStrikeClass);
    },[tiles])
    const handleTileClick = (index: number) => {
        if(tiles[index] !== null){
            return;
        }

        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);

        if(playerTurn === PLAYER_X){
            setPlayerTurn(PLAYER_O);
        }else{
            setPlayerTurn(PLAYER_X);
        }
    }

    return (
        <>
           <div>
              <h1>Tic Tac Toe</h1>
              <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass}/>
           </div> 
        </>
    );
}

export default TicTacToe;
