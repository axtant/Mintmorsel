import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title, showBackButton }) => {
  return (
    <header className="header flex items-center 
    justify-between p-2 
    fixed top-0 left-0 right-0  
    shadow z-10 bg-yellow-100 ">
      {showBackButton && (
        <Link to="/dashboard">
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
            Back
          </button>
        </Link>
      )}
      <h1 className="text-3xl font-bold text-center flex-grow">{title}</h1>
    </header>
  );
};

export default Header;
