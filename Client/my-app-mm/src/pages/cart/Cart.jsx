import "./cart.css";

const Cart = ({ cartItems = [] }) => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-6">Shopping Cart</h1>
            
            {/* Added Items Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold mb-2">Added Items</h2>
                <ul className="list-disc pl-5">
                    <li>Item 1 - $10.00</li>
                    <li>Item 2 - $15.00</li>
                    <li>Item 3 - $20.00</li>
                </ul>
            </div>

            {/* Instruction Box */}
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded-lg">
                <h2 className="font-semibold">Instructions</h2>
                <p>Please review your items before proceeding to checkout.</p>
            </div>

            {/* Detailed Bill Section */}
            <div className="bg-white shadow-md rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Detailed Bill</h2>
                <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>$45.00</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Tax (5%):</span>
                    <span>$2.25</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>$47.25</span>
                </div>
            </div>
        </div>
    );
}

export default Cart;
