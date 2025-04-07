import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { useCart } from "../../context/CartContext";  // ✅ Import from context

const Cart = () => {
    
    const { cartItems, addToCart, removeFromCart } = useCart();  // ✅ Get cart data
    console.log("Cart Items:", cartItems);
    // ✅ Check if cart is empty
    if (!cartItems || Object.keys(cartItems).length === 0) {
        return (
            <div className="container p-4 mt-13">
                <Header title="Shopping Cart" showBackButton={true} />
                <p className="text-center text-gray-500">Your cart is empty.</p>
                <div className="text-center mt-6">
                    <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
                        Back to Menu
                    </Link>
                </div>
            </div>
        );
    }
    

    // ✅ Calculate total price
    const totalPrice = Object.keys(cartItems).reduce((total, itemName) => {
        const item = { itemName, price: 10 }; // ❌ Fix this: You need to get the real price from Dashboard data
        return total + (item.price * cartItems[itemName]);
    }, 0);

    return (
        <div className="container p-4 mt-13">
            <Header title="Shopping Cart" showBackButton={true} />

            {/* Cart Items */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                <h2 className="text-xl font-semibold mb-2">Added Items</h2>
                <ul className="list-disc pl-5">
                    {Object.keys(cartItems).map((itemName) => (
                        <li key={itemName} className="flex justify-between items-center mb-2">
                            <span>{itemName} - {cartItems[itemName]}x</span>
                            <div>
                                <button onClick={() => removeFromCart({ itemName })} className="bg-red-500 text-white px-2 py-1 rounded mx-1">
                                    -
                                </button>
                                <button onClick={() => addToCart({ itemName })} className="bg-green-500 text-white px-2 py-1 rounded mx-1">
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
                <div className="flex justify-between mb-2">
                    <span>Tax (5%):</span>
                    <span>₹{(totalPrice * 0.05).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>₹{(totalPrice * 1.05).toFixed(2)}</span>
                </div>
            </div>

            {/* Checkout Button */}
            <div className="text-center mt-6">
                <Link to="/confirm-payments" className="proceed-button bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200">
                    Proceed to Payment
                </Link>
            </div>
        </div>
        
    );

    
};


export default Cart;
