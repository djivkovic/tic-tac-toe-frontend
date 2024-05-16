import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import GameOver from './components/GameOver';
import ResetGame from './components/ResetGame';
import GameState from './components/GameState';

const host = process.env.REACT_APP_HOST;

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
    winner: string | null;
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
    const checkWinner = (tiles: (string | null)[], setStrikeClass: React.Dispatch<React.SetStateAction<string>>, gameState: number) => {
        console.log('check-winner tiles: ', tiles);
        
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
    
    const findEmptyTiles = (tiles: (string | null)[]): number[] => {
        const emptyTiles: number[] = [];
        tiles.forEach((tile, index) => {
            if (tile === null) {
                emptyTiles.push(index);
            }
        });
        return emptyTiles;
    }
    const renderMoves = () => {
        return moves.map((move, index) => (
            <div key={index}>Move {index + 1}: Player {move.player} at position {move.index}</div>
        ));
    }
   
    const calculateNextMove = (tiles: (string | null)[]): number => {
        if (gameState !== GameState.inProgress) {
            return -1;
        }
    
        const emptyTiles = findEmptyTiles(tiles);
    
        if (emptyTiles.length === 0) {
            return -1;
        }
    
        const randomIndex = Math.floor(Math.random() * emptyTiles.length);
        return emptyTiles[randomIndex];
    };

    const addMove = (index: number, player: string) => {
        if (gameState === GameState.inProgress) {
            setMoves(prevMoves => {
                const updatedMoves = [...prevMoves, { index, player }];
                return updatedMoves;
            });
        }
    };

    const handleTileClick = (index: number) => {
        if (gameState !== GameState.inProgress || tiles[index] !== null) {
            return;
        }
    
        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);
        console.log('new tiles-after: ', newTiles);
       
        checkWinner(newTiles, setStrikeClass, gameState);
        checkWinner(newTiles, setStrikeClass, gameState);

        addMove(index, playerTurn);
    
        if (gameState !== GameState.inProgress) {
            return;
        }
    
        if (findEmptyTiles(newTiles).length === 0) {
            setGameState(GameState.draw);
            return;
        }
    
        const aiMove = calculateNextMove(newTiles);
        const aiTiles = [...newTiles];
        aiTiles[aiMove] = playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X;
        setTiles(aiTiles);
        console.log('aiTiles-after: ', aiTiles);
        addMove(aiMove, playerTurn === PLAYER_X ? PLAYER_O : PLAYER_X);
        
        checkWinner(aiTiles, setStrikeClass, gameState);
    };

    const handleSave = async () => {
        console.log({ gameId, gameResult });
    
        if (gameResult) {
            const { gameType, winner } = gameResult;
    
            const winnerToSend = winner ? winner : null;
    
            let response = await fetch(`${host}/create-game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moves, gameType, winner: winnerToSend })
            });
    
            const result = await response.json();
            console.log(result);
        }
    }
    useEffect(() => {
        let emptyTiles = findEmptyTiles(tiles);
        console.log("Empty tiles:", emptyTiles);
        console.log('gamestate: ', gameState);

        if (emptyTiles.length !== 0 && gameState === 0){
            // to do
            console.log('hi');
        }

        checkWinner(tiles, setStrikeClass, gameState);
    }, [tiles, gameState]);

    useEffect(() => {
        if (gameState !== GameState.inProgress) {
            setGameResult({ moves, gameType, winner });
        }
    }, [gameState, tiles, moves, gameType, winner]);

    return (
        <div className='game-container'>
            <h1>Tic Tac Toe</h1>
            <h2>Game ID: {gameId}</h2> {/*to do*/}
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
