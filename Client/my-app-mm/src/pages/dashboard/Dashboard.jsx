import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";
import Header from "../../components/Header";
import { fetchMenu } from "../../services/menuService"; // ✅ Import API function
import { useCart } from "../../hooks/useCart"; // ✅ Import custom hook

const Dashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Veg", "Non-veg", "Egg", "Add ons"];

  const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart(); // ✅ Use cart hook

  useEffect(() => {
    const loadMenu = async () => {
      const data = await fetchMenu();
      setMenuItems(data);
    };
    loadMenu();
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="dashboard p-4 mt-13 bg-gray-100">
      <Header title="Mintmorsel" showBackButton={false} />

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

      {/* Categories */}
      <div className="categories overflow-x-auto whitespace-nowrap mb-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => setSelectedCategory(category)}
            className={`category-btn mx-2 p-2 rounded ${
              selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items */}
      <div className="menu mt-2">
        {filteredMenuItems.length > 0 ? (
          filteredMenuItems.map((item) => (
            <div key={item.itemName} className="menu-item flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">
                  {item.itemName} - ₹{item.price}
                </p>
                <p className="text-gray-500 text-sm">{item.itemDesc}</p>
              </div>
              {cartItems[item.itemName] ? (
                <div className="flex items-center">
                  <button
                    onClick={() => removeFromCart(item)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="mx-2">{cartItems[item.itemName]}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              ) : (
                <button onClick={() => addToCart(item)} className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                  Add
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>

      {/* Sticky Footer with Cart Summary */}
      {Object.keys(cartItems).length > 0 && (
        <footer className="footer fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center">
          <p>
            {Object.values(cartItems).reduce((total, quantity) => total + quantity, 0)} items - ₹{getTotalPrice(menuItems).toFixed(2)}
          </p>
          <Link to="/cart" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View Cart
          </Link>
        </footer>
      )}
    </div>
  );
};

export default Dashboard;
