import { useState, useEffect, SyntheticEvent } from 'react';
import { useNavigate } from "react-router-dom";
import { loginUser, checkLoggedIn } from "../utils/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../css/auth.css';

const Login = () => {
  const host = process.env.REACT_APP_HOST;
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const navigate = useNavigate();

  const handleLogin = async (e:SyntheticEvent) => {
    e.preventDefault();

    await loginUser(username, password, host);
  }

  useEffect(() => {
    checkLoggedIn(navigate);
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
