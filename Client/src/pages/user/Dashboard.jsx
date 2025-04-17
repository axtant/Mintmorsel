import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { fetchMenu } from "../../services/menuService";
import { useCart } from "../../context/CartContext";
import "./../css/dashboard.css";

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
                {CATEGORIES.map((category, index) => (
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
                {filteredMenuItems.map((item) =>  {
                    const cartItem = Array.isArray(cartItems)
                        ? cartItems.find((ci) => ci.itemName === item.itemName)
                        : null;
                    return (
                        <div key={item.id} className="menu-item flex justify-between items-center border-b py-2">
                            <div>
                                <p className="font-semibold">{item.itemName} - ₹{item.price}</p>
                                <p className="text-gray-500 text-sm">{item.itemDesc}</p>
                            </div>
                            {cartItem ? (
                                <div className="flex items-center">
                                    <button 
                                        onClick={() => removeFromCart(item.itemName)} 
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        -
                                    </button>
                                    <span className="mx-2">{cartItem.quantity}</span>
                                    <button 
                                        onClick={() => addToCart(item)} 
                                        className="bg-green-500 text-white px-2 py-1 rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => addToCart(item)} 
                                    className="bg-green-500 text-white px-4 py-1 rounded"
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
                <footer className="cart-footer fixed bottom-0 left-0 w-full bg-white shadow-md p-4 flex justify-between items-center">
                    <p>Total Items: {cartItems.length}</p>
                    <Link 
                        to="/cart" 
                        state={{ cartItems }}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        View Cart
                    </Link>
                </footer>
            )}
        </div>
    );
};

export default Dashboard;
