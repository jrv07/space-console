import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/store';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Search from './components/Search/Search';
import Navbar from './components/Navbar/Navbar';
import MyBoard from './components/MyBoard/MyBoard';
import Data from './components/Data/Data';
import Templates from './components/Templates/Templates';
import Profile from './components/Profile/Profile';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './styles/fonts.css';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/login';
  };

  const toggleNavbar = () => {
    setIsNavbarCollapsed(!isNavbarCollapsed);
  };

  return (
    <Router>
      <div className="app">
        {isAuthenticated && (
          <Navbar isCollapsed={isNavbarCollapsed} toggleCollapse={toggleNavbar} />
        )}
        {isAuthenticated && (
          <Header
            onLogout={handleLogout}
            toggleNavbar={toggleNavbar}
            isNavbarCollapsed={isNavbarCollapsed}
          />
        )}
        <main className={`main-content ${isNavbarCollapsed ? 'navbar-collapsed' : 'navbar-expanded'}`}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/search"
              element={<ProtectedRoute><Search /></ProtectedRoute>}
            />
            <Route
              path="/my-board"
              element={<ProtectedRoute><MyBoard /></ProtectedRoute>}
            />
            <Route
              path="/data"
              element={<ProtectedRoute><Data /></ProtectedRoute>}
            />
            <Route
              path="/templates"
              element={<ProtectedRoute><Templates /></ProtectedRoute>}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/my-board" />} />
          </Routes>
        </main>
        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
};

export default App;