import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useCart } from "../../context/CartContext"; 

const Cart = () => {
    const { cartItems, addToCart, removeFromCart } = useCart(); 
    const navigate = useNavigate();
    // Check if the cart is empty
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container p-4 mt-13">
                <Header title="Shopping Cart" showBackButton={true} />
                <p className="text-center text-gray-500">Your cart is empty.</p>
                <div className="text-center mt-6">
                    <button onClick={()=> navigate(-1)}
                    className="bg-blue-600 text-white px-4 py-2 rounded">
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="container p-4 mt-13">
            <Header title="Shopping Cart" showBackButton={true} />

            {/* Cart Items */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Added Items</h2>
                <ul className="list-disc pl-5">
                    {cartItems.map((item) => (
                        <li key={item.itemName} className="flex justify-between items-center mb-2">
                            <span>{item.itemName} - ₹{item.price} x {item.quantity}</span>
                            <div>
                                <button 
                                    onClick={() => removeFromCart(item.itemName)} 
                                    className="bg-red-500 text-white px-2 py-1 rounded mx-1"
                                >
                                    -
                                </button>
                                <button 
                                    onClick={() => addToCart(item)} 
                                    className="bg-green-500 text-white px-2 py-1 rounded mx-1"
                                >
                                    +
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Bill Summary */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Detailed Bill</h2>
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{(totalPrice).toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-6">
                <Link 
                    to="/confirm-payments" 
                    className="proceed-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Proceed to Payment
                </Link>
            </div>
        </div>
    );
};

export default Cart;
