// src/components/AdminDashboard.jsx
import React, {  useState } from 'react';

const AdminDashboard = () => {
  const [category, setCategory] = useState(''); // State for category
  const [name, setName] = useState(''); // State for item name
  const [price, setPrice] = useState(''); // State for price
  const [storeOpen, setStoreOpen] = useState(true); // State for store status

  const handleSubmit = () => {
    if (!category || !name || !price) {
      alert("Please fill in all fields."); // Simple validation
      return;
    }

    // Convert price to a number
    const priceValue = parseFloat(price);
    if (isNaN(priceValue) || priceValue <= 0) {
      alert("Please enter a valid price."); // Validate price
      return;
    }

    // Clear inputs after submission
    setCategory('');
    setName('');
    setPrice('');
  };

  return (
    <div className="admin-dashboard p-4 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {/* Input section for adding menu items */}
      <div className="mb-4">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (e.g., Veg)"
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name (e.g., Veg Thali)"
          className="border rounded p-2 w-full mb-2"
        />
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (e.g., 75)"
          className="border rounded p-2 w-full mb-4"
        />
        <button 
          onClick={handleSubmit} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Item
        </button>
      </div>

      {/* Store open/close toggle */}
      <div className="mt-4">
        <label>
          <input 
            type="checkbox" 
            checked={storeOpen} 
            onChange={() => setStoreOpen(!storeOpen)} 
          />
          Store is {storeOpen ? 'Open' : 'Closed'}
        </label>
      </div>
    </div>
  );
};

export default AdminDashboard;
