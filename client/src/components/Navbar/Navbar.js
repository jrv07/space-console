import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaClipboard, FaSearch, FaChartBar, FaFileAlt } from 'react-icons/fa';
import Logo from '../../assets/logo.svg';
import './Navbar.css';

const Navbar = ({ isCollapsed, toggleCollapse }) => {
  return (
    <div className={`navbar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="navbar-header">
        {isCollapsed ? (
          <img src={Logo} alt="Space Console Logo" className="navbar-logo" />
        ) : (
          <h3>Space Console</h3>
        )}
      </div>
      <nav>
        <NavLink to="/my-board" className={({ isActive }) => (isActive ? 'active' : '')}>
          {isCollapsed ? <FaClipboard className="icon" /> : 'My Board'}
        </NavLink>
        <NavLink to="/search" className={({ isActive }) => (isActive ? 'active' : '')}>
          {isCollapsed ? <FaSearch className="icon" /> : 'Search'}
        </NavLink>
        <NavLink to="/data" className={({ isActive }) => (isActive ? 'active' : '')}>
          {isCollapsed ? <FaChartBar className="icon" /> : 'Data'}
        </NavLink>
        <NavLink to="/templates" className={({ isActive }) => (isActive ? 'active' : '')}>
          {isCollapsed ? <FaFileAlt className="icon" /> : 'Templates'}
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;