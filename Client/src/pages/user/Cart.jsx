import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useCart } from "../../context/CartContext";
import "./../css/Cart.css";

const Cart = () => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-container p-4 mt-13">
        <Header title="Shopping Cart" showBackButton={true} />
        <p className="cart-empty-message">Your cart is empty.</p>
        <div className="text-center">
          <button
            onClick={() => navigate(-1)}
            className="cart-back-button"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container p-4 mt-13">
      <Header title="Shopping Cart" showBackButton={true} />

      {/* Cart Items */}
      <div className="cart-card">
        <h2 className="cart-section-title">Added Items</h2>
        <ul className="cart-items-list">
          {cartItems.map((item) => (
            <li key={item.itemName} className="cart-item">
              <span>
                {item.itemName} - ₹{item.price} x {item.quantity}
              </span>
              <div>
                <button
                  onClick={() => removeFromCart(item.itemName)}
                  className="cart-item-btn cart-item-btn-remove"
                  aria-label={`Remove one ${item.itemName}`}
                >
                  -
                </button>
                <button
                  onClick={() => addToCart(item)}
                  className="cart-item-btn"
                  aria-label={`Add one ${item.itemName}`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Bill Summary */}
      <div className="cart-card">
        <h2 className="cart-section-title">Detailed Bill</h2>
        <div className="cart-bill-row">
          <span>Subtotal:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        <div className="cart-bill-row cart-bill-row-total">
          <span>Total:</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="text-center">
        <Link
          to="/confirm-payments"
          className="cart-proceed-button"
        >
          Proceed to Payment
        </Link>
      </div>
    </div>
  );
};

export default Cart;
