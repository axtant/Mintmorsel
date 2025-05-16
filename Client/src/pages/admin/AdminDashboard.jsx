import React, { useState } from 'react';
import {
  postMenuItem,
  updateMenuItemDesc,
  deleteAllMenuItems,
} from '../../services/menuService';
import './../css/Admindashboard.css';

const AdminDashboard = () => {
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all menu items? This action cannot be undone.'
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      await deleteAllMenuItems();
      alert('All menu items deleted successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to delete menu items');
    } finally {
      setLoading(false);
    }
  };

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

  const handleUpdateDesc = async () => {
    if (!newDesc) {
      alert('Please enter a new description');
      return;
    }

    try {
      await updateMenuItemDesc(newDesc); // Assumes the backend targets a fixed ID internally
      alert('Item description updated successfully!');
      setNewDesc('');
      setIsUpdateMode(false);
    } catch (error) {
      console.error('Error updating description:', error);
      alert('Failed to update description.');
    }
  };

  return (
    <div className="admin-wrapper">
      <h1 className="admin-title">Admin Dashboard</h1>

      <section className="admin-card">
        <h2 className="admin-section-title">
          {isUpdateMode ? 'Update Description' : 'Menu Management'}
        </h2>

        {!isUpdateMode ? (
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

              <button
                onClick={handleDeleteAll}
                disabled={isLoading}
                className="admin-button danger"
              >
                {isLoading ? 'Deleting...' : 'Delete All Menu Items'}
              </button>

              <button
                onClick={() => setIsUpdateMode(true)}
                className="admin-button"
              >
                Update Current Menu
              </button>
            </div>
          </div>
        ) : (
          <div className="admin-form">
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="New Item Description"
              className="admin-input"
            />
            <div className="admin-actions">
              <button
                onClick={handleUpdateDesc}
                className="admin-button success"
              >
                Update Description
              </button>
              <button
                onClick={() => setIsUpdateMode(false)}
                className="admin-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
