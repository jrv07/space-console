import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config'; // Import config
import './Signup.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);
  const [hashedPassword, setHashedPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/api/signup`, {
        username,
        email,
        password,
      });
      if (response.data.success) {
        setHashedPassword(response.data.hashedPassword);
        setSuccess(response.data.message);
        setError('');
        setStep(2);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Signup failed');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/verify-otp`, {
        username,
        email,
        hashedPassword,
        otp,
      });
      if (response.data.success) {
        setSuccess('Signup successful! Redirecting to login...');
        setError('');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('OTP verification failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>{step === 1 ? 'Sign Up' : 'Verify Email'}</h2>
      {step === 1 ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Sign Up</button>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button type="submit">Verify OTP</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      {step === 1 && (
        <p>
          Already have an account? <a href="/login">Login here</a>
        </p>
      )}
    </div>
  );
};

export default Signup;