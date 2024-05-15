import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import GameOver from './components/GameOver';
import ResetGame from './components/ResetGame';
import GameState from './components/GameState';

const PLAYER_X = 'X';
const PLAYER_O = 'O';

const winningCombinations = [
    //rows
    { combo: [0, 1, 2], strikeClass: "strike-row-1" },
    { combo: [3, 4, 5], strikeClass: "strike-row-2" },
    { combo: [6, 7, 8], strikeClass: "strike-row-3" },

    //columns
    { combo: [0, 3, 6], strikeClass: "strike-column-1" },
    { combo: [1, 4, 7], strikeClass: "strike-column-2" },
    { combo: [2, 5, 8], strikeClass: "strike-column-3" },

    //diagonals
    { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
    { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },
];

type Move = {
    index: number;
    player: string;
};

type GameResult = {
    moves: Move[];
    gameType?: string;
    winner?: string | null;
};

const TicTacToe = ({ gameType }: { gameType?: string }) => {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(PLAYER_X);
    const [strikeClass, setStrikeClass] = useState("");
    const [gameState, setGameState] = useState(GameState.inProgress);
    const [moves, setMoves] = useState<Move[]>([]);
    const [gameResult, setGameResult] = useState<GameResult | null>(null);
    const [winner, setWinner] = useState("");
    const [gameId, setGameId] = useState<number>(1); 

    const handleReset = () => {
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null));
        setPlayerTurn(PLAYER_X);
        setStrikeClass("");
        setMoves([]);
        setGameResult(null);
        setGameId(prevId => prevId + 1);
        setWinner("");
    }

    const checkWinner = (tiles: (string | null)[], setStrikeClass: React.Dispatch<React.SetStateAction<string>>, setGameState: React.Dispatch<React.SetStateAction<number>>) => {
        for (const { combo, strikeClass } of winningCombinations) {
            const tileValue1 = tiles[combo[0]];
            const tileValue2 = tiles[combo[1]];
            const tileValue3 = tiles[combo[2]];

            if (tileValue1 !== null && tileValue1 === tileValue2 && tileValue1 === tileValue3) {
                setStrikeClass(strikeClass);
                if (tileValue1 === PLAYER_X) {
                    setGameState(GameState.playerXWins);
                    setWinner(PLAYER_X);
                } else {
                    setGameState(GameState.playerOWins);
                    setWinner(PLAYER_O);
                }
                return;
            }
        }

        const areAllTilesFilledIn = tiles.every((tile) => tile !== null);

        if (areAllTilesFilledIn) {
            setGameState(GameState.draw);
        }
    }

    useEffect(() => {
        checkWinner(tiles, setStrikeClass, setGameState);
    }, [tiles])

    useEffect(() => {
        if (gameState !== GameState.inProgress) {
            setGameResult({ moves, gameType, winner });
        }
    }, [gameState, moves, gameType]);

    const handleTileClick = (index: number) => {
        if (gameState !== GameState.inProgress) {
            return;
        }

        if (tiles[index] !== null) {
            return;
        }

        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);
        setMoves([...moves, { index, player: playerTurn }]);

        if (playerTurn === PLAYER_X) {
            setPlayerTurn(PLAYER_O);
        } else {
            setPlayerTurn(PLAYER_X);
        }
    }

    const renderMoves = () => {
        return moves.map((move, index) => (
            <div key={index}>Move {index + 1}: Player {move.player} at position {move.index}</div>
        ));
    }

    const handleSave = () => {
        console.log({ gameId, gameResult });
    }

    return (
        <div className='game-container'>
            <h1>Tic Tac Toe</h1>
            <h2>Game ID: {gameId}</h2> 
            <div className='game-grid'>
                <div className='board-container'>
                    <Board playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} strikeClass={strikeClass} />
                </div>
                <div className='side-panel'>
                    <GameOver gameState={gameState} />
                    <ResetGame gameState={gameState} onReset={handleReset} saveGame={handleSave} />
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
