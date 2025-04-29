import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { fetchMenu } from "../../services/menuService";
import { useCart } from "../../context/CartContext";
import "./../css/Dashboard.css";

const CATEGORIES = ["All", "Veg", "Chicken", "Egg", "Add ons"];

const Dashboard = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const { cartItems, addToCart, removeFromCart } = useCart();

    useEffect(() => {
        const loadMenu = async () => {
            try {
                const data = await fetchMenu();
                setMenuItems(data);
            } catch (error) {
                console.error('Error fetching menu:', error);
            }
        };
        loadMenu();
    }, []);

    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="dashboard p-4 mt-13 bg-gray-100 pb-16">
            <Header title="Mintmorsel" showBackButton={false} showLogOutButton={false} />

            <div className="dashboard-container p-4 mt-13 bg-gray-100 pb-16">
  {/* Search Bar */}
  <div className="dashboard-search ml-4">
    <input
      type="text"
      placeholder="Search for items..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="dashboard-search-input"
    />
  </div>

  {/* Categories */}
  <div className="dashboard-categories overflow-x-auto whitespace-nowrap mb-4">
    {CATEGORIES.map((category, index) => (
      <button
        key={index}
        onClick={() => setSelectedCategory(category)}
        className={`dashboard-category-btn mx-2 p-2 rounded ${
          selectedCategory === category ? "active" : ""
        }`}
      >
        {category}
      </button>
    ))}
  </div>

  {/* Menu Items */}
  <div className="dashboard-menu mt-2">
    {filteredMenuItems.map((item) => {
      const cartItem = Array.isArray(cartItems)
        ? cartItems.find((ci) => ci.itemName === item.itemName)
        : null;
      return (
        <div key={item.id} className="dashboard-menu-item">
          <div className="dashboard-menu-item-info">
            <p className="dashboard-menu-item-name">
              {item.itemName} - ₹{item.price}
            </p>
            <p className="dashboard-menu-item-desc">{item.itemDesc}</p>
          </div>
          {cartItem ? (
            <div className="dashboard-cart-controls">
              <button
                onClick={() => removeFromCart(item.itemName)}
                className="dashboard-cart-btn dashboard-cart-btn-remove"
              >
                -
              </button>
              <span className="dashboard-cart-quantity">{cartItem.quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="dashboard-cart-btn"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(item)}
              className="dashboard-add-btn"
            >
              Add
            </button>
          )}
        </div>
      );
    })}
  </div>

  {/* Footer */}
  {Array.isArray(cartItems) && cartItems.length > 0 && (
    <footer className="dashboard-cart-footer">
      <p>Total Items: {cartItems.length}</p>
      <Link
        to="/cart"
        state={{ cartItems }}
        className="dashboard-cart-footer-link"
      >
        View Cart
      </Link>
    </footer> 
  )}
</div>
</div>
    );
};

export default Dashboard;
