import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Beverages', 'Snacks', 'Desserts', 'Main Course'];
  const menuItems = [
    { id: 1, category: 'Beverages', name: 'Coffee', price: 50 },
    { id: 2, category: 'Snacks', name: 'Burger', price: 100 },
    { id: 3, category: 'Desserts', name: 'Ice Cream', price: 70 },
    { id: 4, category: 'Main Course', name: 'Pizza', price: 200 },
  ];

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  return (
    <div className="dashboard">
      {/* Fixed Header */}
      <header className="header">
        <h1>img</h1>
      </header>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="categories">
        {categories.map((category, index) => (
          <button key={index} className="category-btn">
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu">
        {menuItems
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <div key={item.id} className="menu-item">
              <span>{item.name}</span>
              <button onClick={() => handleAddToCart(item)}>Add</button>
            </div>
          ))}
      </div>

      {/* Sticky Footer */}
      {cartItems.length > 0 && (
        <footer className="footer">
          <p>{cartItems.length} items in cart</p>
        </footer>
      )}
    </div>
  );
};

export default Dashboard;
