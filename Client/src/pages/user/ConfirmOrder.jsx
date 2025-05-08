import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WEBSOCKET_URL } from '../../config/webSocketConfig';
import styles from './../css/OrderConfirmation.module.css';

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
    <div className={styles.container}>
  {orderStatus === 'processing' && (
    <div>
      <div className={styles.spinner} />
      <p className={styles.statusText}>Sending order to kitchen...</p>
    </div>
  )}
  {orderStatus === 'confirmed' && (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.confirmationIcon}
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
      <h2 className={styles.confirmationTitle}>Order Confirmed!</h2>
      <p className={styles.orderId}>Your order ID: #{orderId}</p>
      <button
        onClick={() => navigate('/logout')}
        className={styles.logoutButton}
      >
        Logout
      </button>
    </div>
  )}
  {orderStatus === 'error' && (
    <div>
      <h2 className={styles.errorText}>Order Failed!</h2>
      <p className={styles.redirectMessage}>
        There was a problem placing your order. Redirecting to cart...
      </p>
    </div>
  )}
</div>
  );
};

export default OrderConfirmation;
