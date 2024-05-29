import { useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { showErrorToast } from '../utils/toastNotifications';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../css/auth.css';

const Login = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const host = process.env.REACT_APP_HOST;

  const navigate = useNavigate();

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault();

    let response = await fetch(`${host}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    });

    const result = await response.json();
    console.log(result);

    if (result.auth) {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('token', JSON.stringify(result.auth));
      window.location.reload();
    } else {
      showErrorToast("Please enter valid details!");
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('token');
    if (isLoggedIn) {
      navigate('/home');
    }
  }, [navigate]);

  return (
    <>
      <div className="auth-form-container">
        <h2 className='title'>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter your username"
              required
              autoComplete="off"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Login
          </button>
        </form>
      </div>
      <ToastContainer/>
    </>
  );
};

export default Login;
