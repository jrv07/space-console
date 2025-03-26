import React from 'react';
import { FaSignOutAlt, FaCog, FaQuestionCircle, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const Header = ({ onLogout, toggleNavbar, isNavbarCollapsed }) => {
  const navigate = useNavigate();

  const handleSearchBarClick = () => {
    navigate('/search');
  };

  return (
    <header className="header">
      <div className="header-content">
        <button
          className={`burger-btn ${isNavbarCollapsed ? 'collapsed' : ''}`}
          onClick={toggleNavbar}
        >
          ☰
        </button>
        <div className="search-bar-container" onClick={handleSearchBarClick}>
          <SearchBar />
        </div>
        <div className="header-icons">
          <button className="icon-btn">
            <FaUser />
          </button>
          <button className="icon-btn">
            <FaCog />
          </button>
          <button className="icon-btn">
            <FaQuestionCircle />
          </button>
          <button className="icon-btn" onClick={onLogout}>
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;