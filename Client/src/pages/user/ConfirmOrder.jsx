// OrderConfirmation.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { WEBSOCKET_URL } from '../../config/webSocketConfig';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('processing');
  const { paymentMethod, cartItems, totalAmount } = location.state || {};
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket(WEBSOCKET_URL);
    const user = JSON.parse(localStorage.getItem('user')) || {}; // Fetch user details

    websocket.onopen = () => {
      const orderData = {
        type: 'order',
        data: {
          paymentMethod,
          items: cartItems,
          total: totalAmount,
          user: {
            name: user.username || 'Guest',
            phone: user.phone || 'N/A',  // Adjust key as needed
            address: user.address || 'N/A',
          },
          timestamp: new Date().toISOString(),
        },
      };
      websocket.send(JSON.stringify(orderData));
    };

    websocket.onmessage = (event) => {
      const response = JSON.parse(event.data);
      if (response.type === 'order_ack') {
        setOrderId(response.orderId);
        setOrderStatus('confirmed');
        localStorage.removeItem('cart');
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setOrderStatus('error');
    };

    return () => {
      websocket.close();
    };
  }, [paymentMethod, cartItems, totalAmount]);

  return (
    <div className="order-confirmation">
      <Header title="Order Status" showBackButton={false} />
      
      <div className="p-4 mt-20 text-center">
        {orderStatus === 'processing' ? (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-4">Sending order to kitchen...</p>
          </div>
        ) : orderStatus === 'confirmed' ? (
          <div className="text-green-600">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            <h2 className="text-2xl font-bold mt-4">Order Confirmed!</h2>
            <p className="mt-2">Your order ID: #{orderId}</p>
            <button
              onClick={() => navigate('/logout')}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-red-600">
            <h2 className="text-2xl font-bold mt-4">Order Failed!</h2>
            <p>Please try again later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
