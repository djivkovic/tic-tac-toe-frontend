import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import TicTacToe from '../game/TicTacToe';
import '../css/home.css';

const Home = () => {
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [singlePlayerSelected, setSinglePlayerSelected] = useState(false);
    const [hideCreateNewGame, setHideCreateNewGame] = useState(false);

    const openCreateGameModal = () => {
        setShowModal(true);
        setHideCreateNewGame(true);
    };

    const closeCreateGameModal = () => {
        setShowModal(false);
        setHideCreateNewGame(false);
    };
    useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken: any = jwtDecode(token); 
        setUsername(decodedToken.username);
    }
    }, []);

    const handleSinglePlayerClick = () => {
        setSinglePlayerSelected(true); 
        setShowModal(false); 
    };

    return (
        <>
        <div className='home-container'>
            <h2 className='home-title'>Home Page</h2>
            <p>Welcome, {username} </p> 
            {!hideCreateNewGame && <button className='create-new-game-btn' onClick={openCreateGameModal}>Create New Game</button>}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-btn" onClick={closeCreateGameModal}>X</span>
                        <h2>Create New Game</h2>
                        <p>Choose option: </p>
                        <button className='single-player-btn' onClick={handleSinglePlayerClick}>Single-Player</button>
                        <button className='multi-player-btn'>Multiplayer</button>
                    </div>
                </div>
            )}
            <div className='game-container'>
                {singlePlayerSelected && <TicTacToe />}
            </div>
        </div>
        </>
    );
}

export default Home;
