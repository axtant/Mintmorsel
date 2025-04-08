import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title, showBackButton , showLogOutButton}) => {
  const navigate = useNavigate(); // Replaces useHistory
  const handleLogout = () => {
    // Clear authentication (adjust based on your auth method)
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  return (
    <header className="header flex items-center 
    justify-between p-2 
    fixed top-0 left-0 right-0  
    shadow z-10 bg-blue-100 ">
      {showBackButton && (
        <button 
          onClick={() => navigate(-1)} // Navigate to the previous page
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
        >
          Back
        </button>
      )}
      <h1 className="text-3xl font-bold text-center flex-grow">{title}</h1>
      {showLogOutButton &&
        <button 
        onClick={handleLogout}
        className="bg-blue-500 text-black-500 hover:text-red-700 px-3 py-1 rounded"
      >
        Logout
      </button>

      }
      
    </header>
  );
};

export default Header;
  