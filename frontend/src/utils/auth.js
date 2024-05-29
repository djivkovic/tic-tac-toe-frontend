import { showErrorToast } from '../utils/toastNotifications';

const loginUser = async (username, password, host) => {
  try {
    const response = await fetch(`${host}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.auth) {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('token', JSON.stringify(result.auth));
      window.location.reload();
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    showErrorToast(error.message);
  }
};

const checkLoggedIn = (navigate) => {
  const isLoggedIn = localStorage.getItem('token');
  if (isLoggedIn) {
    navigate('/home');
  }
};

const registerUser = async (username, password, host) => {
  try {
    const response = await fetch(`${host}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const result = await response.json();
    if (result.auth) {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('token', JSON.stringify(result.auth));
      window.location.reload();
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    showErrorToast(error.message);
  }
};

export { loginUser, checkLoggedIn, registerUser };
