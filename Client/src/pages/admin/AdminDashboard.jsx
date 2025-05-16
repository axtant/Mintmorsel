import React, { useState } from 'react';
import { postMenuItem } from '../../services/menuService';
import OrderDashboard from './OrderDashboard';
import './../css/Admindashboard.css';

const AdminDashboard = () => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);

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

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Admin Dashboard</h1>

      <section className="admin-card">
        <h2 className="admin-section-title">Menu Management</h2>

        <div className="admin-form">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="admin-input"
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
            className="admin-input"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Item Description"
            rows="3"
            className="admin-input admin-textarea"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="admin-input"
          />

          <div className="admin-actions">
            <button
              onClick={handlePostMenu}
              disabled={isPosting}
              className={`admin-button success ${isPosting ? 'disabled' : ''}`}
            >
              {isPosting ? 'Posting...' : 'Post Menu Item'}
            </button>

            <button className="admin-button danger">
              Delete All Menu Items
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
