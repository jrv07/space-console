const express = require('express');
const argon2 = require('argon2');
const nodemailer = require('nodemailer');
const pool = require('../db');
const router = express.Router();

// Email config from .env
const { EMAIL_USER, EMAIL_PASS } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// In-memory OTP storage (key: email, value: { otp, timestamp })
const otpStore = {};

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: 'Space Console - Verify Your Action',
    text: `Your one-time password (OTP) is: ${otp}. It expires in 5 minutes.`,
  };
  await transporter.sendMail(mailOptions);
};

// Login route (Step 1: Request OTP)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];
    if (!user || !(await argon2.verify(user.password, password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const otp = generateOTP();
    otpStore[user.email] = { otp, timestamp: Date.now() };
    await sendOTPEmail(user.email, otp);
    res.json({ success: true, message: 'OTP sent to your email', email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Login OTP verification (Step 2)
router.post('/verify-login-otp', async (req, res) => {
  const { email, otp } = req.body;
  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found' });
  }

  const { otp: storedOtp, timestamp } = storedOtpData;
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - timestamp > fiveMinutes) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedOtp === otp) {
    delete otpStore[email];
    const [users] = await pool.query('SELECT username FROM users WHERE email = ?', [email]);
    const user = users[0];
    res.json({ success: true, token: 'mock-token-' + Date.now(), username: user.username });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// Signup route (Step 1: Request OTP)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const hashedPassword = await argon2.hash(password);
    const otp = generateOTP();
    otpStore[email] = { otp, timestamp: Date.now() };
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to your email', username, email, hashedPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP and complete signup (Step 2)
router.post('/verify-otp', async (req, res) => {
  const { username, email, hashedPassword, otp } = req.body;
  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found' });
  }

  const { otp: storedOtp, timestamp } = storedOtpData;
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - timestamp > fiveMinutes) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedOtp === otp) {
    await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    delete otpStore[email];
    res.json({ success: true, message: 'Signup successful' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

// Get user profile
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;
  try {
    const [users] = await pool.query('SELECT username, email FROM users WHERE username = ?', [username]);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to fetch user data' });
  }
});

// Update user profile
router.put('/user/:username', async (req, res) => {
  const { username } = req.params;
  const { username: newUsername, email } = req.body;
  try {
    const [existingUsers] = await pool.query(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND username != ?',
      [newUsername, email, username]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Username or email already in use' });
    }

    await pool.query(
      'UPDATE users SET username = ?, email = ? WHERE username = ?',
      [newUsername, email, username]
    );
    res.json({ success: true, message: 'Profile updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// Reset password (via profile)
router.post('/reset-password', async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = users[0];
    if (!user || !(await argon2.verify(user.password, oldPassword))) {
      return res.status(401).json({ success: false, message: 'Invalid old password' });
    }

    const hashedNewPassword = await argon2.hash(newPassword);
    await pool.query('UPDATE users SET password = ? WHERE username = ?', [hashedNewPassword, username]);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
});

// Forgot password (Step 1: Request OTP)
router.post('/forgot-password', async (req, res) => {
  const { username, email } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE username = ? AND email = ?', [username, email]);
    const user = users[0];
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found or email mismatch' });
    }

    const otp = generateOTP();
    otpStore[email] = { otp, timestamp: Date.now() };
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Forgot password reset (Step 2: Verify OTP and reset)
router.post('/reset-forgot-password', async (req, res) => {
  const { username, email, newPassword, otp } = req.body;
  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found' });
  }

  const { otp: storedOtp, timestamp } = storedOtpData;
  const fiveMinutes = 5 * 60 * 1000;
  if (Date.now() - timestamp > fiveMinutes) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedOtp === otp) {
    const hashedNewPassword = await argon2.hash(newPassword);
    await pool.query('UPDATE users SET password = ? WHERE username = ? AND email = ?', [hashedNewPassword, username, email]);
    delete otpStore[email];
    res.json({ success: true, message: 'Password reset successful' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

module.exports = router;