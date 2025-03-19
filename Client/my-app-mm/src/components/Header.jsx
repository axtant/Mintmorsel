import React from 'react';

const Header = ({ companyName }) => {
  return (
    <header className="header">
      <h1>{companyName}</h1>
    </header>
  );
};

export default Header;
