import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicTacToe from '../game/TicTacToe';
import { getTokenData } from "../utils/getTokenData ";
import '../css/home.css';
const Home = () => {
    const host = process.env.REACT_APP_HOST;
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [singlePlayerSelected, setSinglePlayerSelected] = useState(false);
    const [hideCreateNewGame, setHideCreateNewGame] = useState(false);
    const [gameType, setGameType] = useState('');
    const navigate = useNavigate();

    const openCreateGameModal = () => {
        setShowModal(true);
        setHideCreateNewGame(true);
    };

    const closeCreateGameModal = () => {
        setShowModal(false);
        setHideCreateNewGame(false);
    };
    useEffect(() => {
        const decodedToken = getTokenData();
        const username = decodedToken.username;

    if (decodedToken) {
        setUsername(username);
    }
    }, []);

    const handleSinglePlayerClick = () => {
        setSinglePlayerSelected(true); 
        setShowModal(false); 
        setGameType("singlePlayer");
    };

    const handleMultiPlayerClick = async () => {
        const gameType = "multiPlayer"; 
    
        const response = await fetch(`${host}/api/game/create-game`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameType })
        });
    
        const data = await response.json();
        const gameId = data.gameId;

        navigate(`/game/${gameId}`);
    };

    return (
        <>
        <div className='home-container'>
            <h2 className='home-title'>Home Page</h2>
            <p>Welcome, {username} </p> 
            {!hideCreateNewGame && <button className='create-new-game-btn' onClick={openCreateGameModal}>Create New Game</button>}
           <button className='join-game-btn'><a href="join-game">Join Game</a></button>
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeCreateGameModal}>X</span>
                        <h2>Create New Game</h2>
                        <p>Choose option: </p>
                        <button className='single-player-btn' onClick={handleSinglePlayerClick}>Single-Player</button>
                        <button className='multi-player-btn' onClick={handleMultiPlayerClick}>Multiplayer</button>
                    </div>
                </div>
            )}
            <div className='game-container'>
                {singlePlayerSelected && <TicTacToe gameType={gameType} />}
            </div>
        </div>
        </>
    );
}

export default Home;
