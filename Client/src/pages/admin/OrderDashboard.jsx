// src/components/OrderDashboard.jsx
import React, { useState, useEffect } from 'react';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:8081');
    setWs(websocket);

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'order_received') {
        setOrders(prev => [...prev, data]);
      } else if (data.type === 'order_status_update') {
        setOrders(prev => prev.map(order => order.orderId === data.orderId ? { ...order, status: data.status } : order));
      }
    };

    return () => websocket.close();
  }, []);

  const handleOrderConfirmation = (orderId, status) => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'order_status_update', orderId, status }));
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
              <p>Items: {order.items.map(item => item.itemName).join(', ')}</p>
              <p>Total: ₹{order.amount}</p>
              <p>Customer Name: {order.user?.name}</p>
              <p>Phone Number: {order.user?.phone}</p>
              <p>Address: {order.user?.address}</p>
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
