import React from 'react';

const CartPage = ({ cartItems }) => {
  return (
    <div className="cart-page">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cartItems.map(item => (
          <div key={item.id}>
            <p>{item.name}</p>
            <p>Quantity: {item.count}</p>
          </div>
        ))
      )}
      <button>Proceed to Payment</button>
    </div>
  );
};

export default CartPage;
