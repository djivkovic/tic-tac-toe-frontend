import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import GameOver from './components/GameOver';
import GameState from './components/GameState';
import ResetGame from './components/ResetGame';

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

type Move = {
    index: number;
    player: string;
};

const TicTacToe = () => {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
    const [strikeClass, setStrikeClass] = useState("");
    const [gameState, setGameState] = useState(GameState.inProgress);
    const [moves, setMoves] = useState<Move[]>([]);

    const handleReset = () => {
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null));
        setPlayerTurn(PLAYER_X);
        setStrikeClass("");
        setMoves([]);
    }

    const checkWinner = (tiles: (string | null)[], setStrikeClass: React.Dispatch<React.SetStateAction<string>>, setGameState: React.Dispatch<React.SetStateAction<number>>) => {
        for(const  {combo, strikeClass} of winningCombinations){
            const tileValue1 = tiles[combo[0]];
            const tileValue2 = tiles[combo[1]];
            const tileValue3 = tiles[combo[2]];

            if(tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3){
                setStrikeClass(strikeClass);
                if(tileValue1 === PLAYER_X){
                    setGameState(GameState.playerXWins);
                }
                else{
                    setGameState(GameState.playerOWins);
                }
                return;
            }
        }

        const areAllTilesFilledIn = tiles.every((tile) => tile !== null);

        if(areAllTilesFilledIn){
            setGameState(GameState.draw);
        }
    }

    useEffect(()=>{
        checkWinner(tiles, setStrikeClass, setGameState);
    },[tiles])

    const handleTileClick = (index: number) => {
        if(gameState !== GameState.inProgress){
            return;
        }

        if(tiles[index] !== null){
            return;
        }

        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);
        setMoves([...moves, { index, player: playerTurn }]);

        if(playerTurn === PLAYER_X){
            setPlayerTurn(PLAYER_O);
        }else{
            setPlayerTurn(PLAYER_X);
        }
    }

    const renderMoves = () => {
        return moves.map((move, index) => (
            <div key={index}>Move {index + 1}: Player {move.player} at position {move.index}</div>
        ));
    }

    return (
        <div className='game-container'>
            <h1>Tic Tac Toe</h1>
            <div className='game-grid'>
                <div className='board-container'>
                    <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass}/>
                </div>
                <div className='side-panel'>
                    <GameOver gameState={gameState}/>
                    <ResetGame gameState={gameState} onReset={handleReset}/>
                    <div className='moves-container'>
                        <h2>Moves:</h2>
                        {renderMoves()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TicTacToe;
