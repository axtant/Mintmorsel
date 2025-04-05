import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';

const Confirm = () => {
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch total amount from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const calculatedTotal = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalAmount(calculatedTotal);
  }, []);

  // Open WebSocket connection and send order data
  const handleCashOnDelivery = () => {
    const ws = new WebSocket('ws://localhost:8081'); // Replace with your WebSocket server URL

    ws.onopen = () => {
      const orderData = JSON.parse(localStorage.getItem('cart')) || [];
      ws.send(JSON.stringify({ type: 'order', data: orderData }));
  };  

    ws.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };

  return (
    <div className="confirm-payments">
      <Header title="Confirmation" showBackButton={true} />

      <div className="grid gap-6 justify-center my-6 mt-20">
        <button
          onClick={handleCashOnDelivery}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
        >
          Cash on Delivery
        </button>

        <button
          onClick={() => {
            const upiPaymentUrl = `tez://upi/pay?pa=merchant@upi&am=${totalAmount}&tn=FoodOrder&cu=INR`;
            window.open(upiPaymentUrl, '_blank');
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
