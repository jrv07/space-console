const express = require('express');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const router = express.Router();

// Import Gmail credentials
const emailConfig = require('../config/emailConfig.json');
const { emailUser, emailPass } = emailConfig;

// Path to users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

// In-memory OTP storage (key: email, value: { otp, timestamp })
const otpStore = {};

// Email transporter setup (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Helper to read users
const getUsers = () => {
  const data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper to write users
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: 'Space Console - Verify Your Email',
    text: `Your one-time password (OTP) is: ${otp}. It expires in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email}: ${otp}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP');
  }
};

// Login route
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsers();
  const user = users.find((u) => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, token: 'mock-token', username });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Signup route (Step 1: Request OTP)
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  const users = getUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already exists' });
  }

  const otp = generateOTP();
  otpStore[email] = { otp, timestamp: Date.now() };

  try {
    await sendOTPEmail(email, otp);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
});

// Verify OTP and complete signup
router.post('/verify-otp', (req, res) => {
  const { username, email, password, otp } = req.body;
  const storedOtpData = otpStore[email];

  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email' });
  }

  const { otp: storedOtp, timestamp } = storedOtpData;
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

  if (Date.now() - timestamp > fiveMinutes) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedOtp === otp) {
    const users = getUsers();
    users.push({ username, email, password });
    saveUsers(users);
    delete otpStore[email]; // Clear OTP after use
    res.json({ success: true, message: 'Signup successful' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
});

module.exports = router;