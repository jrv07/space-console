import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/store';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState(''); // Store email from first step
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', { username, password });
      if (response.data.success) {
        setEmail(response.data.email);
        setSuccess(response.data.message);
        setError('');
        setStep(2); // Move to OTP step
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/verify-login-otp', { email, otp });
      if (response.data.success) {
        dispatch(login({ username: response.data.username, token: response.data.token }));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/my-board'), 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('OTP verification failed');
    }
  };

  return (
    <div className="login-container">
      <h2>{step === 1 ? 'Login' : 'Verify OTP'}</h2>
      {step === 1 ? (
        <>
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
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {step === 1 && (
        <p>
          New user? <a href="/signup">Sign up here</a>
        </p>
      )}
    </div>
  );
};

export default Login;