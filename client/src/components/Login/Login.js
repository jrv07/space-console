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
  const [email, setEmail] = useState(''); // For login OTP
  const [forgotEmail, setForgotEmail] = useState(''); // For forgot password
  const [forgotUsername, setForgotUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1); // 1: Login, 2: Login OTP, 3: Forgot Password, 4: Forgot OTP
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

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', {
        username: forgotUsername,
        email: forgotEmail,
      });
      if (response.data.success) {
        setSuccess(response.data.message);
        setError('');
        setStep(4); // Move to OTP verification for forgot password
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to initiate password reset');
    }
  };

  const handleVerifyForgotOtp = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/reset-forgot-password', {
        username: forgotUsername,
        email: forgotEmail,
        newPassword,
        otp,
      });
      if (response.data.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setError('');
        setTimeout(() => {
          setStep(1);
          setForgotUsername('');
          setForgotEmail('');
          setNewPassword('');
          setConfirmNewPassword('');
          setOtp('');
        }, 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('OTP verification failed');
    }
  };

  return (
    <div className="login-container">
      <h2>{step === 1 ? 'Login' : step === 2 ? 'Verify OTP' : step === 3 ? 'Forgot Password' : 'Verify OTP'}</h2>
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
          <p>
            <a href="#" onClick={() => setStep(3)}>Forgot Password?</a>
          </p>
        </>
      ) : step === 2 ? (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      ) : step === 3 ? (
        <>
          <input
            type="text"
            placeholder="Username"
            value={forgotUsername}
            onChange={(e) => setForgotUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button onClick={handleForgotPassword}>Submit</button>
          <p>
            <a href="#" onClick={() => setStep(1)}>Back to Login</a>
          </p>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button onClick={handleVerifyForgotOtp}>Reset Password</button>
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