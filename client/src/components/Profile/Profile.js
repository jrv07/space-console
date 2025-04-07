import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { username } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState({ username: '', email: '' });
  const [editMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/user/${username}`);
        setUserData(response.data);
        setNewUsername(response.data.username);
        setNewEmail(response.data.email);
      } catch (err) {
        setError('Failed to fetch user data');
      }
    };
    fetchUserData();
  }, [username]);

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/user/${username}`, {
        username: newUsername,
        email: newEmail,
      });
      if (response.data.success) {
        setUserData({ username: newUsername, email: newEmail });
        setMessage('Profile updated successfully');
        setEditMode(false);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        username,
        oldPassword,
        newPassword,
      });
      if (response.data.success) {
        setMessage('Password reset successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Failed to reset password');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-content">
        <h2>User Profile</h2>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        
        <div className="profile-details">
          <h3>Your Details</h3>
          {!editMode ? (
            <>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </>
          ) : (
            <>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email"
              />
              <button onClick={handleUpdate}>Save Changes</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </>
          )}
        </div>

        <div className="password-reset">
          <h3>Reset Password</h3>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Old Password"
          />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm New Password"
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;