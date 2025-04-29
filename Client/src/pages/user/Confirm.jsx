// Confirm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import "./../css/Confirm.css"

const Confirm = () => {
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const calculatedTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(calculatedTotal);
  }, []);

  const handlePaymentMethod = (method) => {
    navigate('/order-confirmation', {
      state: {
        paymentMethod: method,
        cartItems: JSON.parse(localStorage.getItem('cart')) || [],
        totalAmount
      }
    });
  };

  return (
    <div className="confirm-payments">
      <Header title="Payment Method" showBackButton={true} />
      
      <div className="confirm-button-group">
        <button
          onClick={() => handlePaymentMethod('COD')}
          className="confirm-payment-btn confirm-payment-cod"
        >
          <span className="confirm-payment-icon">💰</span>
          Cash on Delivery
        </button>

        <button
          onClick={() => {
            const upiPaymentUrl = `tez://upi/pay?pa=merchant@upi&am=${totalAmount}&tn=FoodOrder&cu=INR`;
            window.open(upiPaymentUrl, '_blank');
            handlePaymentMethod('GPay');
          }}
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
