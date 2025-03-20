import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
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
        <h1>Menu</h1>
      </header>

      {/* Search Bar */}
      <div className="search">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2"
        />
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="categories overflow-x-auto whitespace-nowrap">
        {categories.map((category, index) => (
          <button key={index} className="category-btn mx-2 p-2 bg-gray-200 rounded hover:bg-gray-300">
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu mt-4">
        {menuItems
          .filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((item) => (
            <div key={item.id} className="menu-item flex justify-between items-center border-b py-2">
              <span>{item.name} - ${item.price}</span>
              <button 
                onClick={() => handleAddToCart(item)} 
                className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
              >
                Add
              </button>
            </div>
          ))}
      </div>

      {/* Sticky Footer */}
      {cartItems.length > 0 && (
        <footer className="footer fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
          <p>{cartItems.length} items in cart</p>
          <Link
            to="/cart"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            View Cart
          </Link>
        </footer>
      )}
    </div>
  );
};

export default Dashboard;
