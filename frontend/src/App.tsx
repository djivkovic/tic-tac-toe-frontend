import React from 'react';
import Nav from './components/Nav';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Chat from './pages/Chat';
import MessageDisplay from './pages/MessageDisplay';

function App() {
  const isLoggedIn = localStorage.getItem('token');
  return (
    <div className="App">
      <BrowserRouter>
        <Nav/>
        <Routes>
          <Route path='/register' element={<Register/>}  />
          <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to="/" />}  />
          <Route path='/chat' element={<Chat />}  />
          <Route path='/message-display' element={<MessageDisplay />}  />
          <Route path='/' element={isLoggedIn ? <Navigate to="/home" /> : <Login/>}  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
