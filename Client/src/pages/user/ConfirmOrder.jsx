import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { WEBSOCKET_URL } from '../../config/webSocketConfig';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderStatus, setOrderStatus] = useState('processing');
  const [orderId, setOrderId] = useState(null);
  const websocketRef = useRef(null);

  const { paymentMethod, cartItems, totalAmount } = location.state || {};

  useEffect(() => {
    if (!paymentMethod || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !totalAmount) {
      setOrderStatus('error');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')) || {};

    const ws = new WebSocket(WEBSOCKET_URL);
    websocketRef.current = ws;

    ws.onopen = () => {
      const message = {
        type: 'order',
        data: {
          items: cartItems.map(item => ({
            itemName: item.itemName || item.name,
            quantity: item.quantity,
            price: item.price
          })),
          user: {
            userId: user._id || 'guest',
            name: user.username || user.name || 'Guest',
            phone: user.pin,
            address: user.gMapLink
          },
          total: totalAmount
        }
      };
      ws.send(JSON.stringify(message));
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.type === 'order_ack') {
          setOrderId(response.orderId);
          setOrderStatus('confirmed');
          localStorage.removeItem('cart');
        }
      } catch (err) {
        console.error('Invalid server response:', err);
        setOrderStatus('error');
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setOrderStatus('error');
    };

    ws.onclose = () => {
      // Optionally handle reconnection
    };

    return () => {
      ws.close();
    };
  }, [paymentMethod, cartItems, totalAmount]);

  useEffect(() => {
    if (orderStatus === 'error') {
      const timer = setTimeout(() => {
        navigate('/cart');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderStatus, navigate]);

  return (
    <div className="order-confirmation">
      <Header title="Order Status" showBackButton={false} />
      <div className="p-4 mt-20 text-center">
        {orderStatus === 'processing' && (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="mt-4">Sending order to kitchen...</p>
          </div>
        )}
        {orderStatus === 'confirmed' && (
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
        )}
        {orderStatus === 'error' && (
          <div className="text-red-600">
            <h2 className="text-2xl font-bold mt-4">Order Failed!</h2>
            <p>There was a problem placing your order. Redirecting to cart...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmation;
