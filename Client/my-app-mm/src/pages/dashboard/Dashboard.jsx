import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Dashboard.css';

const Dashboard = () => {
  const [cartItems, setCartItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Veg', 'Non-veg', 'Egg', 'Add ons'];
  const menuItems = [
    { id: 1, category: 'Veg', name: 'Veg Thali', price: 50 },
    { id: 2, category: 'Non-veg', name: 'Non-veg Thali', price: 100 },
    { id: 3, category: 'Egg', name: 'Egg Thali', price: 70 },
    { id: 4, category: 'Add ons', name: 'Fish fry ', price: 200 },
  ];

  // Increment item quantity
  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const currentCount = prev[item.id] || 0;
      if (currentCount < 5) {
        return {
          ...prev,
          [item.id]: currentCount + 1,
        };
      }
      return prev;
    });
  };

  // Decrement item quantity
  const handleRemoveFromCart = (item) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev };
      if (updatedCart[item.id] > 1) {
        updatedCart[item.id] -= 1;
      } else {
        delete updatedCart[item.id];
      }
      return updatedCart;
    });
  };

  // Filter menu items based on search term and selected category
  const filteredMenuItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard p-4 bg-gray-100">
      {/* Fixed Header */}
      <header className="header">
        <h1 className="text-3xl font-bold text-center mb-6">BLa Bla Menu</h1>
      </header>

      {/* Search Bar */}
      <div className="search ml-4">
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
      </div>

      {/* Horizontal Scrollable Categories */}
      <div className="categories overflow-x-auto whitespace-nowrap mb-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn mx-2 p-2 rounded ${selectedCategory === category ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu mt-2">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <div key={item.id} className="menu-item flex justify-between items-center border-b py-2">
              <span>{item.name} - ₹{item.price}</span>
              {cartItems[item.id] ? (
                <div className="flex items-center">
                  <button
                    onClick={() => handleRemoveFromCart(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="mx-2">{cartItems[item.id]}</span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => handleAddToCart(item)} 
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Add
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* Sticky Footer */}
      {Object.keys(cartItems).length > 0 && (
  <footer className="footer fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
    <p>
      {Object.values(cartItems).reduce((totalItems, quantity) => totalItems + quantity, 0)} items - ₹
      {menuItems.reduce((totalPrice, item) => {
        const itemQuantity = cartItems[item.id] || 0; // Get quantity for the item from cartItems
        return totalPrice + (item.price * itemQuantity); // Calculate total price for each item
      }, 0).toFixed(2)} {/* Format to two decimal places */}
    </p>
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
