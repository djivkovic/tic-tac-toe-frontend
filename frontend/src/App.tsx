import React from 'react';
import Nav from './components/Nav';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

function App() {
  const isLoggedIn = localStorage.getItem('token');
  return (
    <div className="App">
      <BrowserRouter>
        <Nav/>
        <Routes>
          <Route path='/register' element={<Register/>}  />
          <Route path='/home' element={isLoggedIn ? <Home /> : <Navigate to="/" />}  />
          <Route path='/' element={isLoggedIn ? <Navigate to="/home" /> : <Login/>}  />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
