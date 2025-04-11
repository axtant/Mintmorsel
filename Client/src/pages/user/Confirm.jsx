// Confirm.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

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
      
      <div className="grid gap-6 justify-center my-6 mt-20">
        <button
          onClick={() => handlePaymentMethod('COD')}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Cash on Delivery
        </button>

        <button
          onClick={() => {
            const upiPaymentUrl = `tez://upi/pay?pa=merchant@upi&am=${totalAmount}&tn=FoodOrder&cu=INR`;
            window.open(upiPaymentUrl, '_blank');
            handlePaymentMethod('GPay');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Pay with GPAY
        </button>
      </div>
    </div>
  );
};

export default Confirm;
