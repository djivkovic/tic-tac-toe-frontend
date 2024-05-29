import { showErrorToast } from './toastNotifications';

const createGame = async (gameType, host) => {
    try {
        const response = await fetch(`${host}/api/game/create-game`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameType })
        });

        const data = await response.json();
        return data.gameId;
    } catch (error) {
        showErrorToast('Failed to create game!');
        return null;
    }
};

const findGameById = async (id, host) => {
    try {
        const response = await fetch(`${host}/api/game/find-game/${id}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        return data.found;
    } catch (error) {
        showErrorToast('Failed to find game!');
        return null;
    }
};

const joinGame = async (id, host, navigate) => {
    const foundGame = await findGameById(id, host);

    if (foundGame) {
        navigate(`/game/${id}`);
    } else {
        navigate('/');
    }
};

const joinSinglePlayerGame = async (id, host, navigate) => {
    const foundGame = await findGameById(id, host);

    if (foundGame) {
        navigate(`/singlePlayer-game/${id}`);
    } else {
        navigate('/');
    }
};

const fetchGameDetails = async (gameId, userId, setPlayers, setMoves, setBoard, setWinner, setLoading, navigate, host) => {
    try {
        const response = await fetch(`${host}/api/game/find-game/${gameId}/${userId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            navigate("/");
        }

        const data = await response.json();

        if (data.found && data.game) {
            setPlayers(data.game.players || []);
            setMoves(data.game.moves || []);
            const initialBoard = Array(3).fill(null).map(() => Array(3).fill(null));
            data.game.moves.forEach((move) => {
                initialBoard[move.index.x][move.index.y] = move.sign;
            });
            setBoard(initialBoard);
            setWinner(data.game.winner);
        } else {
            showErrorToast('Game not found!');
        }
    } catch (error) {
        showErrorToast(error.message);
    } finally {
        setLoading(false);
    }
};

const fetchPlayerDetails = async (gameId, setPlayerDetails, navigate, host) => {
    try {
        const response = await fetch(`${host}/api/game/players/${gameId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            navigate("/");
        }

        const data = await response.json();

        const playerMap = data.reduce((acc, player) => {
            acc[player._id] = player.username;
            return acc;
        }, {});

        setPlayerDetails(playerMap);
    } catch (error) {
        showErrorToast(error.message);
    }
};

const fetchWinner = async (roomId, setWinner, host) => {
    try {
        const response = await fetch(`${host}/api/game/winner/${roomId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch winner');
        }
        const data = await response.json();
        setWinner(data.winner);
    } catch (error) {
        showErrorToast('Error fetching winner');
        console.error('Error fetching winner:', error);
    }
};

const makeSinglePlayerMove = async (roomId, move, host) => {
    try {
        const response = await fetch(`${host}/api/game/singlePlayer/make-move/${roomId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ move })
        });

        if (!response.ok) {
            throw new Error('Failed to make move');
        }
    } catch (error) {
        showErrorToast('Error making move');
        console.error('Error making move:', error);
    }
};

const makeMove = async (roomId, move, userId, host) => {
    try {
        const response = await fetch(`${host}/api/game/make-move/${roomId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ move, userId })
        });

        if (!response.ok) {
            throw new Error('Failed to make move');
        }
    } catch (error) {
        showErrorToast('Error making move');
        console.error('Error making move:', error);
    }
};

const fetchMoves = async (roomId, setMoves, host) => {
    try {
        const response = await fetch(`${host}/api/game/moves/${roomId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch moves');
        }
        const movesData = await response.json();
        setMoves(movesData);
    } catch (error) {
        showErrorToast('Error fetching moves');
        console.error('Error fetching moves:', error);
    }
};

const fetchUserSymbol = async (roomId, host, userId, setUserSymbol) => {
    try {
        const response = await fetch(`${host}/api/game/player-symbol/${roomId}/${userId}`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            const data = await response.json();
            setUserSymbol(data.symbol);
        } else {
            throw new Error('Failed to fetch user symbol');
        }
    } catch (error) {
        console.error('Error fetching user symbol:', error);
    }
};

const assignPlayer = async (roomId, symbol, host, setUserSymbol, userId) => {
    try {

        const response = await fetch(`${host}/api/game/assign-player/${roomId}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, sign: symbol })
        });

        if (!response.ok) {
            throw new Error('Failed to assign player');
        } else {
            setUserSymbol(symbol);
        }
    } catch (error) {
        showErrorToast('Error assigning player');
        console.error('Error assigning player:', error);
    }
};

export { createGame, joinGame, joinSinglePlayerGame, fetchGameDetails, fetchPlayerDetails, fetchWinner, makeSinglePlayerMove, fetchMoves, makeMove, fetchUserSymbol, assignPlayer };
