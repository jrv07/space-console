import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/store';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });
      if (response.data.success) {
        dispatch(login({ username, token: response.data.token }));
        navigate('/my-board'); // Redirect to My Board
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error">{error}</p>}
      <p>
        New user? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;