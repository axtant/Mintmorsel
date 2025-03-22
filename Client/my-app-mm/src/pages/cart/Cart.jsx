import { Link } from "react-router-dom";
import Header from "../../components/Header";
import "./cart.css";

const Cart = (  ) => {

    
    return (
        <div className="container p-4  mt-13">
        <div>
             <Header title="Shopping Cart" showBackButton={true} />
        </div>
            
            {/* Added Items Section */}
            <div className="bg-white shadow-md rounded-lg p-4 mb-">
                <h2 className="text-xl font-semibold mb-2">Added Items</h2>
                <ul className="list-disc pl-5">
                    <li>Item 1 - $10.00</li>
                    <li>Item 2 - $15.00</li>
                    <li>Item 3 - $20.00</li>
                </ul>
            </div>

            {/* Special Note Box */}
            <div>
                <textarea id ="specialNote" 
                rows="1"
                colcols="40" 
                className="specialNote bg-red text-black-700 border border-black-300 rounded-md p-2 mb-4"  
                placeholder="add note to chef"></textarea>
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

            {/* Checkout Button */}
            <div>
      {/* Render cart items and total amount */}
        </div>
            <Link to={{ pathname: '/confirm-payments', state: { totalAmount: "orderTotal" } }}>
              Proceed to Payment
            </Link>

        </div>
    );
}

export default Cart;
