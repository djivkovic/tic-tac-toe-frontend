import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTokenData } from "../utils/getTokenData ";
import '../css/home.css';
const Home = () => {
    const host = process.env.REACT_APP_HOST;
    const [username, setUsername] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [hideCreateNewGame, setHideCreateNewGame] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [gameId, setGameId] = useState("");

    const navigate = useNavigate();

    const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };

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

    const handleSinglePlayerClick = async () => {
        const gameType = "singlePlayer";

        try{
            const response = await fetch(`${host}/api/game/create-game`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameType })
            });
        
            const data = await response.json();
            const gameId = data.gameId;
    
            navigate(`/singlePlayer-game/${gameId}`);
        }
        catch(err){
            alert(err);
            navigate(`/home`);
        }
    };
    const handleMultiPlayerClick = async () => {
        const gameType = "multiPlayer"; 
    
        try{
            const response = await fetch(`${host}/api/game/create-game`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameType })
            });
        
            const data = await response.json();
            const gameId = data.gameId;
    
            navigate(`/game/${gameId}`);
        }
        catch(err){
            alert(err);
            navigate(`/home`);
        }
    };

    const handleSearchGame = () =>{
        navigate(`/find-game/${gameId}`);
    }

    return (
        <>
        <div className='home-container'>
            <h2 className='home-title'>Home Page</h2>
            <p>Welcome, {username} </p> 
            {!hideCreateNewGame && <button className='create-new-game-btn' onClick={openCreateGameModal}>Create New Game</button>}
           <button className='join-game-btn'><a href="join-game">Join Game</a></button>
           <button className='find-game' onClick={openModal} >Find Game</button>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <label>Enter game id:</label>
                        <input type="number" onChange={(e)=>{
                            setGameId(e.target.value)
                        }} />
                        <button className='search-game' onClick={()=>{
                            handleSearchGame();
                        }}>Search Game</button>
                    </div>
                </div>
            )}
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
        </div>
        </>
    );
}

export default Home;
