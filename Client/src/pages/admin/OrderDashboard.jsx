import React, { useState, useEffect } from 'react';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://127.0.0.1:62814/');
    setWs(websocket);

    websocket.onopen = () => {
      console.log('WebSocket connected');
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        if (data.type === 'new_order' && data.order) {
          setOrders(prev => [...prev, data.order]);
        } else if (data.type === 'order_status_update') {
          setOrders(prev =>
            prev.map(order =>
              order.orderId === data.orderId ? { ...order, status: data.status } : order
            )
          );
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message', err);
      }
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = (event) => {
      console.log('WebSocket closed:', event);
    };

    return () => {
      websocket.close();
    };
  }, []);

  const handleOrderConfirmation = (orderId, status) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'order_status_update', orderId, status }));
    } else {
      console.warn('WebSocket is not open. Cannot send message.');
    }
  };

  return (
    <div className="order-section bg-white shadow p-4 rounded">
      <h2 className="text-xl font-semibold mb-4">Order Management</h2>

      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No pending orders</p>
        ) : (
          orders.map(order => (
            <div key={order.orderId} className="order-item border-b pb-4 mb-4">
              <h3 className="font-bold">Order #{order.orderId}</h3>
              <p>Items: {order.items?.map(item => item.itemName).join(', ') || 'N/A'}</p>
              <p>Total: ₹{order.amount ?? 'N/A'}</p>
              <p>Customer Name: {order.user?.name || 'N/A'}</p>
              <p>Phone Number: {order.user?.phone || 'N/A'}</p>
              <p>Address: {order.user?.address || 'N/A'}</p>
              <p>Status: {order.status}</p>
              {order.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleOrderConfirmation(order.orderId, 'accepted')}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleOrderConfirmation(order.orderId, 'rejected')}
                    className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  >
                    Decline
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;
