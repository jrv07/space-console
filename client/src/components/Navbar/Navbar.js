import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaClipboard, FaSearch, FaChartBar, FaFileAlt } from 'react-icons/fa';
import Logo from '../../assets/logo.svg';
import './Navbar.css';

const Navbar = ({ isCollapsed, toggleCollapse }) => {
  return (
    <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="navbar-header">
        <img
          src={Logo}
          alt="Space Console Logo"
          className="navbar-logo"
          onClick={toggleCollapse}
          style={{ cursor: 'pointer' }}
        />
        {!isCollapsed && <h3>Space Console</h3>}
      </div>
      <nav>
        <NavLink to="/my-board" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaClipboard className="icon" />
          {!isCollapsed && <span>My Board</span>}
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaSearch className="icon" />
          {!isCollapsed && <span>Search</span>}
        </NavLink>
        <NavLink to="/data" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaChartBar className="icon" />
          {!isCollapsed && <span>Data</span>}
        </NavLink>
        <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : '')}>
          <FaFileAlt className="icon" />
          {!isCollapsed && <span>Templates</span>}
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;