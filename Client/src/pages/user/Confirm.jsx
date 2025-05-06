import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import "./../css/Confirm.css"

const Confirm = ({ cartItems: propCartItems, totalAmount: propTotalAmount, onBack }) => {
  const [totalAmount, setTotalAmount] = useState(propTotalAmount || 0);
  const [cartItems, setCartItems] = useState(propCartItems || []);
  const navigate = useNavigate();

  useEffect(() => {
    if (!propCartItems) {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(storedCart);
      const calculatedTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(calculatedTotal);
    }
  }, [propCartItems, propTotalAmount]);

  const handlePaymentMethod = (method) => {
    navigate('/order-confirmation', {
      state: {
        paymentMethod: method,
        cartItems,
        totalAmount
      }
    });
  };

  const handleGPay = () => {
    try {
      window.open(`tez://upi/pay?pa=merchant@upi&am=${totalAmount}&tn=FoodOrder&cu=INR`, '_blank');
    } catch (error) {
      alert('GPay app not found - please install it first');
    }
    handlePaymentMethod('GPay');
  }

  return (
    <div className="confirm-payments">
      {/* <Header title="Payment Method" showBackButton={true} />  */}
      {onBack && (
        <button onClick={onBack} className="cart-back-button" style={{marginBottom: 10}}>
          Back to Cart
        </button>
      )}
      <div className="confirm-button-group">
        <button
          onClick={() => handlePaymentMethod('COD')}
          className="confirm-payment-btn confirm-payment-cod"
        >
          <span className="confirm-payment-icon">💰</span>
          Cash on Delivery
        </button>
        <button
          onClick={handleGPay}
          className="confirm-payment-btn confirm-payment-gpay"
        >
          <span className="confirm-payment-icon">📱</span>
          Pay with GPay
        </button>
      </div>
    </div>
  );
};

export default Confirm;
