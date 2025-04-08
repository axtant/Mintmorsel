// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import { API_ENDPOINTS } from '../../config/apiConfig';
import { postMenuItem } from '../../services/menuService';

const AdminDashboard = () => {
  // Menu Management States
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  // Menu Form Submission
  const handlePostMenu = async () => {
    if (!category || !name || !price) {
      alert('Please fill all required fields');
      return;
    }

    setIsPosting(true);
    try {
      await postMenuItem({
        category,
        itemName: name,
        itemDesc: description,
        price: parseFloat(price),
      });
      alert('Menu item added successfully!');
      // Clear form after successful post
      setCategory('');
      setName('');
      setDescription('');
      setPrice('');
    } catch (error) {
      console.error('Error posting menu:', error);
      alert('Failed to add menu item. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  // const handleDeleteAll = async () => {
  //   if (!window.confirm('Are you sure you want to delete all menu items?')) return;

  //   try {
  //     await deleteAllMenuItems();
  //     alert('All menu items deleted!');
  //   } catch (error) {
  //     console.error('Error deleting menu items:', error);
  //     alert('Failed to delete menu items.');
  //   }
  // };
  return (
    <div className="admin-dashboard p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Menu Management Section */}
      <div className="menu-section bg-white shadow p-4 rounded mb-6">
        <h2 className="text-xl font-semibold mb-4">Menu Management</h2>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded p-2 w-full mb-2"
        >
          <option value="">Select Category</option>
          <option value="Veg">Veg</option>
          <option value="Chicken">Chicken</option>
          <option value="Egg">Egg</option>
          <option value="Fish">Fish</option>
          <option value="Addon">Addon</option>
        </select>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Item Name"
          className="border rounded p-2 w-full mb-2"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Item Description"
          className="border rounded p-2 w-full mb-2"
          rows="3"
        />

        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="border rounded p-2 w-full mb-4"
        />

        <div className="flex gap-2">
          <button
            onClick={handlePostMenu}
            disabled={isPosting}
            className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ${isPosting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isPosting ? 'Posting...' : 'Post Menu Item'}
          </button>
        </div>
        <div>
          <button
            // onClick={handleDeleteAll}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete All Menu Items
          </button>
        </div>
      </div>

      {/* Order Dashboard */}
      { <OrderDashboard /> }
    </div>
  );
};

export default AdminDashboard;
