import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ title, showBackButton, showLogOutButton }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <header className="app-header">
      <div className="header-section left">
        {showBackButton && (
          <button onClick={() => navigate(-1)} className="header-btn back-btn">
            ←
          </button>
        )}
      </div>

      <div className="header-section center">
        <h1 className="header-title">{title}</h1>
      </div>

      <div className="header-section right">
        {showLogOutButton && (
          <button onClick={handleLogout} className="header-btn logout-btn">
            ⎋
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
