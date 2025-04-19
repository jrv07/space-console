import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, clearSearch } from '../../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FASTAPI_BASE_URL } from '../../config';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await axios.post(`${FASTAPI_BASE_URL}/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        withCredentials: true
        });
        const { access_token } = response.data;
        dispatch(login({ username, token: access_token }));
        dispatch(clearSearch());
        navigate('/my-board'); // 👈 Navigate immediately
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
      setSuccess('');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <p>
        New user? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;