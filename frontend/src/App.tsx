import React from 'react';
import Nav from './components/Nav';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import JoinGame from './pages/JoinGame';
import Game from './pages/Game';
import NotFound from './pages/NotFound';
import FindGame from './pages/FindGame';
function App() {
  const isLoggedIn = localStorage.getItem('token');
  return (
    <div className="App">
      <BrowserRouter>
        <Nav/>
        <Routes>
          <Route path='/register' element={<Register/>}  />
          <Route path='/join-game' element={ isLoggedIn ? <JoinGame/> : <Navigate to="/" />}/>
          <Route path='/game/:roomId' element={ isLoggedIn ? <Game/> : <Navigate to="/"/>}/>
          <Route path='/find-game/:gameId' element={ isLoggedIn ? <FindGame/> : <Navigate to="/" />}/>
          <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to="/" />}  />
          <Route path='/' element={isLoggedIn ? <Navigate to="/home" /> : <Login/>}  />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;